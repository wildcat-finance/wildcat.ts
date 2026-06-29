import { DocumentNode } from "graphql";
import { SupportedChainId, supportsPeriodicTermHooks } from "../constants";
import {
  GetAllMarketsForLenderViewDocument,
  GetMarketDocument,
  GetMarketEventsDocument,
  GetMarketsAndLendersByHooksInstanceOrControllerDocument,
  GetMarketsWithEventsDocument
} from "./graphql";
import {
  LegacyGetAllMarketsForLenderViewDocument,
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

export const getPolicyMarketsAndLendersDocumentForChain = (
  chainId: SupportedChainId
): DocumentNode =>
  selectDocument(
    chainId,
    GetMarketsAndLendersByHooksInstanceOrControllerDocument,
    LegacyGetMarketsAndLendersByHooksInstanceOrControllerDocument
  );
