import { rejects } from "assert";
import {
  ApolloClient,
  ApolloLink,
  FetchResult,
  gql,
  InMemoryCache,
  Observable,
  Operation
} from "@apollo/client";
import { expect } from "chai";
import { GraphQLError } from "graphql";
import { queryWithIndexedSignal } from "../../src/internal/indexed-query";
import { withIndexedTraversal } from "../../src/internal/indexed-traversal";

const query = gql`
  query ReadRecords {
    records {
      id
    }
  }
`;
type Result = { records: Array<{ id: string }> };
type PendingQuery = {
  operation: Operation;
  next: (result: FetchResult<Result>) => void;
  complete: () => void;
  closed: boolean;
};

const createClient = (defaults: Record<string, unknown> = {}) => {
  const requests: PendingQuery[] = [];
  const client = new ApolloClient({
    cache: new InMemoryCache(),
    defaultOptions: { query: defaults },
    link: new ApolloLink(
      (operation) =>
        new Observable((observer) => {
          const request: PendingQuery = {
            operation,
            next: (value) => observer.next(value),
            complete: () => observer.complete(),
            closed: false
          };
          requests.push(request);
          return () => {
            request.closed = true;
          };
        })
    )
  });
  return { client, requests };
};

const waitFor = async (condition: () => boolean) => {
  for (let attempt = 0; attempt < 20 && !condition(); attempt++) {
    await new Promise((resolve) => setTimeout(resolve, 0));
  }
  expect(condition()).to.equal(true);
};

describe("indexed traversal query lifecycle", () => {
  it("aborts and releases an uncooperative link, then allows a fresh read", async () => {
    const { client, requests } = createClient();
    try {
      await rejects(
        withIndexedTraversal({ limits: { timeoutMs: 20 } }, (traversal) =>
          traversal.query(client, { query, fetchPolicy: "no-cache" })
        ),
        { code: "TIMEOUT" }
      );
      expect(requests).to.have.length(1);
      expect(requests[0].operation.getContext().fetchOptions.signal.aborted).to.equal(true);
      await waitFor(() => requests[0].closed);

      const result = withIndexedTraversal({}, (traversal) =>
        traversal.query<Result>(client, { query, fetchPolicy: "no-cache" })
      );
      await waitFor(() => requests.length === 2);
      requests[1].next({ data: { records: [{ id: "a" }] } });
      requests[1].complete();
      expect((await result).data.records).to.deep.equal([{ id: "a" }]);
      await waitFor(() => requests[1].closed);
    } finally {
      client.stop();
    }
  });

  it("isolates cancellation from an independently started identical query", async () => {
    const { client, requests } = createClient();
    try {
      const independent = client.query<Result>({ query, fetchPolicy: "no-cache" });
      await waitFor(() => requests.length === 1);
      const controller = new AbortController();
      const bounded = withIndexedTraversal({ signal: controller.signal }, (traversal) =>
        traversal.query(client, { query, fetchPolicy: "no-cache" })
      );
      await waitFor(() => requests.length === 2);
      controller.abort();
      await rejects(bounded, { code: "CANCELLED" });
      await waitFor(() => requests[1].closed);
      expect(requests[0].closed).to.equal(false);
      requests[0].next({ data: { records: [{ id: "independent" }] } });
      requests[0].complete();
      expect((await independent).data.records[0].id).to.equal("independent");
    } finally {
      client.stop();
    }
  });

  it("preserves query defaults and cleans up all caller-signal listeners", async () => {
    const caller = new AbortController();
    let listenerCount = 0;
    const add = caller.signal.addEventListener.bind(caller.signal);
    const remove = caller.signal.removeEventListener.bind(caller.signal);
    caller.signal.addEventListener = (...args: Parameters<typeof add>) => {
      listenerCount++;
      return add(...args);
    };
    caller.signal.removeEventListener = (...args: Parameters<typeof remove>) => {
      listenerCount--;
      return remove(...args);
    };
    const { client, requests } = createClient({
      errorPolicy: "all",
      context: {
        headers: { "x-fixture": "preserved" },
        fetchOptions: { credentials: "include", signal: caller.signal }
      }
    });
    try {
      const result = withIndexedTraversal({}, (traversal) =>
        traversal.query<Result>(client, {
          query,
          fetchPolicy: "no-cache",
          context: { marker: "kept", fetchOptions: { mode: "cors" } }
        })
      );
      await waitFor(() => requests.length === 1);
      const context = requests[0].operation.getContext();
      expect(context.headers).to.deep.equal({ "x-fixture": "preserved" });
      expect(context.marker).to.equal("kept");
      expect(context.fetchOptions).to.include({ credentials: "include", mode: "cors" });
      caller.abort();
      await rejects(result, { code: "CANCELLED" });
      await waitFor(() => requests[0].closed);
      expect(context.fetchOptions.signal.aborted).to.equal(true);
      expect(listenerCount).to.equal(0);
    } finally {
      client.stop();
    }
  });

  it("honors a pre-cancelled default signal without sending a query", async () => {
    const caller = new AbortController();
    caller.abort();
    const { client, requests } = createClient({
      context: { fetchOptions: { signal: caller.signal } }
    });
    try {
      await rejects(
        withIndexedTraversal({}, (traversal) => traversal.query(client, { query })),
        { code: "CANCELLED" }
      );
      expect(requests).to.have.length(0);
    } finally {
      client.stop();
    }
  });

  it("retains cache-first reads and releases their observer on success", async () => {
    const { client, requests } = createClient();
    client.cache.writeQuery({ query, data: { records: [{ id: "cached" }] } });
    try {
      const result = await withIndexedTraversal({}, (traversal) =>
        traversal.query<Result>(client, { query, fetchPolicy: "cache-first" })
      );
      expect(result.data.records[0].id).to.equal("cached");
      expect(requests).to.have.length(0);
      await waitFor(() => client.getObservableQueries("all").size === 0);
    } finally {
      client.stop();
    }
  });

  it("retains explicit query error policies", async () => {
    const { client, requests } = createClient();
    try {
      const result = queryWithIndexedSignal<Result>(
        client,
        { query, fetchPolicy: "no-cache", errorPolicy: "all" },
        new AbortController().signal
      );
      await waitFor(() => requests.length === 1);
      requests[0].next({ data: { records: [] }, errors: [new GraphQLError("fixture error")] });
      requests[0].complete();
      expect((await result).errors?.[0].message).to.equal("fixture error");
      await waitFor(() => requests[0].closed);
    } finally {
      client.stop();
    }
  });
});
