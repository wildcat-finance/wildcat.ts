import { DocumentNode } from "graphql";
import { SupportedChainId, supportsPeriodicTermHooks } from "../constants";
import {
  GetAccountsWhereLenderAuthorizedOrActiveDocument,
  GetAllMarketsDocument,
  GetAllMarketsForLenderViewDocument,
  GetLenderAccountWithMarketDocument,
  GetLenderMarketCatalogueDocument,
  GetMarketDocument,
  GetMarketEventsDocument,
  GetMarketsAndLendersByHooksInstanceOrControllerDocument,
  GetMarketsWithEventsDocument
} from "./graphql";
import {
  LegacyGetAccountsWhereLenderAuthorizedOrActiveDocument,
  LegacyGetAllMarketsDocument,
  LegacyGetAllMarketsForLenderViewDocument,
  LegacyGetLenderAccountWithMarketDocument,
  LegacyGetLenderMarketCatalogueDocument,
  LegacyGetMarketDocument,
  LegacyGetMarketEventsDocument,
  LegacyGetMarketsAndLendersByHooksInstanceOrControllerDocument,
  LegacyGetMarketsWithEventsDocument
} from "./legacy-documents";

const selectDocument = (
  chainId: SupportedChainId,
  periodicDocument: DocumentNode,
  legacyDocument: DocumentNode
): DocumentNode => (supportsPeriodicTermHooks(chainId) ? periodicDocument : legacyDocument);

/**
 * Generated documents are built from the V2.1 schema. Use these selectors for
 * operations that include PTH fields so V2.0 chains receive the compatible
 * document instead of an invalid superset query.
 */

export const getMarketsWithEventsDocumentForChain = (chainId: SupportedChainId): DocumentNode =>
  selectDocument(chainId, GetMarketsWithEventsDocument, LegacyGetMarketsWithEventsDocument);

export const getMarketDocumentForChain = (chainId: SupportedChainId): DocumentNode =>
  selectDocument(chainId, GetMarketDocument, LegacyGetMarketDocument);

export const getMarketEventsDocumentForChain = (chainId: SupportedChainId): DocumentNode =>
  selectDocument(chainId, GetMarketEventsDocument, LegacyGetMarketEventsDocument);

export const getAllMarketsForLenderViewDocumentForChain = (
  chainId: SupportedChainId
): DocumentNode =>
  selectDocument(
    chainId,
    GetAllMarketsForLenderViewDocument,
    LegacyGetAllMarketsForLenderViewDocument
  );

export const getLenderMarketCatalogueDocumentForChain = (chainId: SupportedChainId): DocumentNode =>
  selectDocument(chainId, GetLenderMarketCatalogueDocument, LegacyGetLenderMarketCatalogueDocument);

export const getAllMarketsDocumentForChain = (chainId: SupportedChainId): DocumentNode =>
  selectDocument(chainId, GetAllMarketsDocument, LegacyGetAllMarketsDocument);

export const getLenderAccountWithMarketDocumentForChain = (
  chainId: SupportedChainId
): DocumentNode =>
  selectDocument(
    chainId,
    GetLenderAccountWithMarketDocument,
    LegacyGetLenderAccountWithMarketDocument
  );

export const getAccountsWhereLenderAuthorizedOrActiveDocumentForChain = (
  chainId: SupportedChainId
): DocumentNode =>
  selectDocument(
    chainId,
    GetAccountsWhereLenderAuthorizedOrActiveDocument,
    LegacyGetAccountsWhereLenderAuthorizedOrActiveDocument
  );

export const getPolicyMarketsAndLendersDocumentForChain = (
  chainId: SupportedChainId
): DocumentNode =>
  selectDocument(
    chainId,
    GetMarketsAndLendersByHooksInstanceOrControllerDocument,
    LegacyGetMarketsAndLendersByHooksInstanceOrControllerDocument
  );
