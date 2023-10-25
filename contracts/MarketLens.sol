// SPDX-License-Identifier: MIT
pragma solidity ^0.8.20;

import "./MarketLensStructs.sol";

interface MarketLens {
  function archController() external view returns (address);

  function controllerFactory() external view returns (address);

  function getAllControllersDataForBorrowers() external view returns (ControllerData[] memory data);

  function getAllMarketsData() external view returns (MarketData[] memory data);

  function getAllMarketsDataWithLenderStatus(
    address lender
  ) external view returns (MarketDataWithLenderStatus[] memory data);

  function getAllMarketsLenderStatus(
    address lender
  ) external view returns (MarketLenderStatus[] memory status);

  function getArchControllerData() external view returns (ArchControllerData memory data);

  function getControllerDataForBorrower(
    address borrower
  ) external view returns (ControllerData memory data);

  function getControllersDataForBorrowers(
    address[] calldata borrowers
  ) external view returns (ControllerData[] memory data);

  function getMarketData(address market) external view returns (MarketData memory data);

  function getMarketDataWithLenderStatus(
    address lender,
    address market
  ) external view returns (MarketDataWithLenderStatus memory data);

  function getMarketLenderStatus(
    address lender,
    address market
  ) external view returns (MarketLenderStatus memory status);

  function getMarketsCount() external view returns (uint256);

  function getMarketsData(
    address[] calldata markets
  ) external view returns (MarketData[] memory data);

  function getMarketsDataWithLenderStatus(
    address lender,
    address[] calldata markets
  ) external view returns (MarketDataWithLenderStatus[] memory data);

  function getMarketsLenderStatus(
    address lender,
    address[] calldata market
  ) external view returns (MarketLenderStatus[] memory status);

  function getPaginatedArchControllerData(
    SliceParameters calldata borrowersSlice,
    SliceParameters calldata controllerFactoriesSlice,
    SliceParameters calldata controllersSlice,
    SliceParameters calldata marketsSlice
  ) external view returns (ArchControllerData memory data);

  function getPaginatedControllersDataForBorrowers(
    uint256 start,
    uint256 end
  ) external view returns (ControllerData[] memory data);

  function getPaginatedMarketsData(
    uint256 start,
    uint256 end
  ) external view returns (MarketData[] memory data);

  function getPaginatedMarketsDataWithLenderStatus(
    address lender,
    uint256 start,
    uint256 end
  ) external view returns (MarketDataWithLenderStatus[] memory data);

  function getTokenInfo(address token) external view returns (TokenMetadata memory info);

  function getTokensInfo(
    address[] calldata tokens
  ) external view returns (TokenMetadata[] memory info);

  function getWithdrawalBatchData(
    address market,
    uint32 expiry
  ) external view returns (WithdrawalBatchData memory data);

  function getWithdrawalBatchDataWithLenderStatus(
    address market,
    uint32 expiry,
    address lender
  ) external view returns (WithdrawalBatchDataWithLenderStatus memory status);

  function getWithdrawalBatchDataWithLendersStatus(
    address market,
    uint32 expiry,
    address[] calldata lenders
  )
    external
    view
    returns (WithdrawalBatchData memory batch, WithdrawalBatchLenderStatus[] memory statuses);

  function getWithdrawalBatchesData(
    address market,
    uint32[] calldata expiries
  ) external view returns (WithdrawalBatchData[] memory data);

  function getWithdrawalBatchesDataWithLenderStatus(
    address market,
    uint32[] calldata expiries,
    address lender
  ) external view returns (WithdrawalBatchDataWithLenderStatus[] memory statuses);
}
