// SPDX-License-Identifier: MIT
pragma solidity ^0.8.20;

import "./HooksFactory.sol";

interface HooksFactoryRevolving {
  error InvalidMarketData();
  error UnsupportedMarketDataVersion();
  error InvalidCommitmentFeeBips();

  event HooksInstanceDeployed(address hooksInstance, address hooksTemplate);
  event HooksTemplateAdded(
    address hooksTemplate,
    string name,
    address feeRecipient,
    address originationFeeAsset,
    uint80 originationFeeAmount,
    uint16 protocolFeeBips
  );
  event HooksTemplateDisabled(address hooksTemplate);
  event HooksTemplateFeesUpdated(
    address hooksTemplate,
    address feeRecipient,
    address originationFeeAsset,
    uint80 originationFeeAmount,
    uint16 protocolFeeBips
  );
  event MarketDeployed(
    address indexed hooksTemplate,
    address indexed market,
    string name,
    string symbol,
    address asset,
    uint256 maxTotalSupply,
    uint256 annualInterestBips,
    uint256 delinquencyFeeBips,
    uint256 withdrawalBatchDuration,
    uint256 reserveRatioBips,
    uint256 delinquencyGracePeriod,
    HooksConfig hooks
  );

  function archController() external view returns (address);

  function sanctionsSentinel() external view returns (address);

  function wrapperFactory() external view returns (address);

  function marketInitCodeStorage() external view returns (address);

  function marketInitCodeHash() external view returns (uint256);

  function registerWithArchController() external;

  function name() external pure returns (string memory);

  function addHooksTemplate(
    address hooksTemplate,
    string calldata name,
    address feeRecipient,
    address originationFeeAsset,
    uint80 originationFeeAmount,
    uint16 protocolFeeBips
  ) external;

  function updateHooksTemplateFees(
    address hooksTemplate,
    address feeRecipient,
    address originationFeeAsset,
    uint80 originationFeeAmount,
    uint16 protocolFeeBips
  ) external;

  function disableHooksTemplate(address hooksTemplate) external;

  function getHooksTemplateDetails(address hooksTemplate) external view returns (HooksTemplate memory);

  function isHooksTemplate(address hooksTemplate) external view returns (bool);

  function getHooksTemplates() external view returns (address[] memory);

  function getHooksTemplates(
    uint256 start,
    uint256 end
  ) external view returns (address[] memory arr);

  function getHooksTemplatesCount() external view returns (uint256);

  function getMarketsForHooksTemplate(address hooksTemplate) external view returns (address[] memory);

  function getMarketsForHooksTemplate(
    address hooksTemplate,
    uint256 start,
    uint256 end
  ) external view returns (address[] memory arr);

  function getMarketsForHooksTemplateCount(address hooksTemplate) external view returns (uint256);

  function deployHooksInstance(
    address hooksTemplate,
    bytes calldata constructorArgs
  ) external returns (address hooksDeployment);

  function getHooksInstancesForBorrower(address borrower) external view returns (address[] memory);

  function getHooksInstancesCountForBorrower(address borrower) external view returns (uint256);

  function isHooksInstance(address hooks) external view returns (bool);

  function getHooksTemplateForInstance(address hooks) external view returns (address);

  function getMarketsForHooksInstance(address hooksInstance) external view returns (address[] memory);

  function getMarketsForHooksInstance(
    address hooksInstance,
    uint256 start,
    uint256 len
  ) external view returns (address[] memory arr);

  function getMarketsForHooksInstanceCount(address hooksInstance) external view returns (uint256);

  function getMarketParameters() external view returns (MarketParametersV2 memory parameters);

  function getRevolvingMarketCommitmentFeeBips() external view returns (uint16);

  function deployMarket(
    DeployMarketInputsV2 calldata parameters,
    bytes calldata hooksData,
    bytes calldata marketData,
    bytes32 salt,
    address originationFeeAsset,
    uint256 originationFeeAmount
  ) external returns (address market);

  function deployMarketAndHooks(
    address hooksTemplate,
    bytes calldata hooksConstructorArgs,
    DeployMarketInputsV2 calldata parameters,
    bytes calldata hooksData,
    bytes calldata marketData,
    bytes32 salt,
    address originationFeeAsset,
    uint256 originationFeeAmount
  ) external returns (address market, address hooks);

  function computeMarketAddress(bytes32 salt) external view returns (address);

  function pushProtocolFeeBipsUpdates(
    address hooksTemplate,
    uint256 marketStartIndex,
    uint256 marketEndIndex
  ) external;

  function pushProtocolFeeBipsUpdates(address hooksTemplate) external;
}
