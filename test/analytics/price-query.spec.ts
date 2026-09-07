import { expect } from "chai";
import { readFileSync } from "fs";
import { resolve } from "path";
import { buildSchema, getOperationAST, Kind, print, validate } from "graphql";
import { batchedPriceQuery } from "../../src/analytics/price-query";
import {
  GetLenderWithdrawalChildrenDocument,
  GetWithdrawalBatchChildrenDocument
} from "../../src/gql/graphql";

describe("bounded price query documents", () => {
  for (const legacy of [false, true]) {
    it(`retains per-token top-one selection and schema fields for legacy=${legacy}`, () => {
      const document = batchedPriceQuery(legacy, 20);
      const operation = getOperationAST(document)!;
      const fields = operation.selectionSet.selections.filter(
        (field) => field.kind === Kind.FIELD && field.name.value === "tokenDailyPrices"
      );
      expect(fields).to.have.length(20);
      expect(operation.variableDefinitions).to.have.length(21);
      fields.forEach((field, index) => {
        if (field.kind !== Kind.FIELD) throw Error("Expected field");
        expect(field.alias?.value).to.equal(`price${index}`);
        expect(print(field)).to.include("first: 1");
        expect(print(field)).to.include("orderBy: timestamp");
        expect(print(field)).to.include("orderDirection: desc");
        expect(print(field)).to.include(`where: $filter${index}`);
        expect(print(field)).to.include("block: $block");
      });
      expect(print(document).includes("observedAtBlock")).to.equal(!legacy);
      expect(print(document).includes("priceSource")).to.equal(!legacy);
      expect(batchedPriceQuery(legacy, 20)).to.equal(document);
    });
  }

  it("validates generated price batches and withdrawal page documents against the bundled schema", () => {
    const schema = buildSchema(
      readFileSync(resolve(__dirname, "../../gql/v2.5-schema.graphql"), "utf8")
    );
    for (const document of [
      batchedPriceQuery(false, 1),
      batchedPriceQuery(false, 20),
      GetWithdrawalBatchChildrenDocument,
      GetLenderWithdrawalChildrenDocument
    ]) {
      expect(validate(schema, document).map((error) => error.message)).to.deep.equal([]);
    }
  });
});
