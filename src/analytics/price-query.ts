import {
  DocumentNode,
  getOperationAST,
  Kind,
  visit,
  OperationDefinitionNode,
  SelectionNode
} from "graphql";
import { GetLatestTokenPriceObservationDocument } from "../gql/graphql";
import { assert } from "../utils";
import { LegacyGetLatestTokenPriceObservationDocument } from "./legacy";

export const PRICE_QUERY_BATCH_SIZE = 20;
const documents = new Map<string, DocumentNode>();

/** Alias the canonical per-token query so schema fields and top-one ordering stay identical. */
export const batchedPriceQuery = (legacy: boolean, count: number): DocumentNode => {
  assert(
    Number.isInteger(count) && count > 0 && count <= PRICE_QUERY_BATCH_SIZE,
    "Invalid price batch size"
  );
  const key = `${legacy}:${count}`;
  const cached = documents.get(key);
  if (cached) return cached;
  const source = legacy
    ? LegacyGetLatestTokenPriceObservationDocument
    : GetLatestTokenPriceObservationDocument;
  const operation = getOperationAST(source);
  assert(operation?.name !== undefined, "Missing price query operation");
  const indexes = Array.from({ length: count }, (_, index) => index);
  const batched: OperationDefinitionNode = {
    ...operation,
    name: { ...operation.name, value: `${operation.name.value}Batch` },
    variableDefinitions: operation.variableDefinitions?.flatMap((definition) =>
      definition.variable.name.value === "filter"
        ? indexes.map((index) => ({
            ...definition,
            variable: {
              ...definition.variable,
              name: { ...definition.variable.name, value: `filter${index}` }
            }
          }))
        : [definition]
    ),
    selectionSet: {
      ...operation.selectionSet,
      selections: operation.selectionSet.selections.flatMap<SelectionNode>((selection) =>
        selection.kind === Kind.FIELD && selection.name.value === "tokenDailyPrices"
          ? indexes.map((index) => ({
              ...visit(selection, {
                Variable: (node) =>
                  node.name.value === "filter"
                    ? { ...node, name: { ...node.name, value: `filter${index}` } }
                    : undefined
              }),
              alias: { kind: Kind.NAME as const, value: `price${index}` }
            }))
          : [selection]
      )
    }
  };
  const document: DocumentNode = {
    ...source,
    definitions: source.definitions.map((definition) =>
      definition === operation ? batched : definition
    )
  };
  documents.set(key, document);
  return document;
};
