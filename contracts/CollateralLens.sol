// SPDX-License-Identifier: MIT
import { TokenMetadata } from "./MarketLensStructs.sol";

struct CollateralContractData {
  address collateralContract;
  // Basic configuration
  address market;
  address marketBorrower;
  address bebopSettlementContract;
  TokenMetadata underlyingAsset;
  TokenMetadata collateralAsset;
  uint32 liquidationCooldown;
  uint16 maxRepaymentBips;
  // Collateral contract state
  uint32 fullLiquidationIndex;
  uint224 totalShares;
  uint256 availableCollateral;
  uint256 collateralBalance;
  uint32 nextLiquidationTrigger;
  // Relevant market state
  bool isMarketClosed;
  bool isMarketInPenalty;
  uint256 delinquentDebt;
  uint256 maxRepayment;
}

struct CollateralContractDepositorData {
  bool isLiquidator;
  uint256 shares;
  uint256 lastFullLiquidationIndex;
  uint256 balanceCollateralAsset;
  uint256 allowanceCollateralAsset;
}

interface CollateralLens {
  function getCollateralContract(
    address collateralContract
  ) external view returns (CollateralContractData memory data);

  function getCollateralContractWithDepositor(
    address collateralContract,
    address depositor
  )
    external
    view
    returns (
      CollateralContractData memory data,
      CollateralContractDepositorData memory depositorData
    );

  function getCollateralContractsWithDepositor(
    address[] memory collateralContracts,
    address depositor
  )
    external
    view
    returns (
      CollateralContractData[] memory data,
      CollateralContractDepositorData[] memory depositorData
    );

  function getCollateralContractsForMarket(
    address market
  ) external view returns (CollateralContractData[] memory data);

  function getCollateralContractsForMarket(
    address market,
    uint256 start,
    uint256 end
  ) external view returns (CollateralContractData[] memory data);

  function getCollateralContractsForMarketWithDepositor(
    address market,
    address depositor
  )
    external
    view
    returns (
      CollateralContractData[] memory data,
      CollateralContractDepositorData[] memory depositorData
    );
}
