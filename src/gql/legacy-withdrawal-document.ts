import { DocumentNode, visit } from "graphql";

/** Legacy schemas have no fractional withdrawal carry. Keep their query projection unchanged. */
export const legacyWithdrawalDocument = (document: DocumentNode): DocumentNode =>
  visit(document, {
    Field(node) {
      return node.name.value === "paymentRemainder" ? null : undefined;
    }
  });
