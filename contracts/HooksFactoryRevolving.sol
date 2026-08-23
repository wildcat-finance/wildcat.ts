// SPDX-License-Identifier: MIT
pragma solidity ^0.8.20;

import "./HooksFactory.sol";

interface HooksFactoryRevolving {
  error InvalidMarketData();
  error UnsupportedMarketDataVersion();
  error InvalidCommitmentFeeBips();

  event HooksInstanceDeployed(
    address indexed hooksInstance,
    address indexed hooksTemplate,
    address indexed administrator,
    address deployer,
    string name,
    string version
  );
  event HooksInstanceRoleProviders(
    address indexed hooksInstance,
    bool metadataAvailable,
    uint256[] pullProviders,
    uint256[] pushProviders
  );
  event HooksInstanceAdministratorTransferred(
    address indexed hooksInstance,
    address indexed previousAdministrator,
    address indexed newAdministrator
  );
  event HooksTemplateAdded(
    address indexed hooksTemplate,
    address indexed caller,
    string name,
    address feeRecipient,
    address originationFeeAsset,
    uint80 originationFeeAmount,
    uint16 protocolFeeBips
  );
  event HooksTemplateDisabled(address indexed hooksTemplate, address indexed caller);
  event HooksTemplateFeesUpdated(
    address indexed hooksTemplate,
    address indexed caller,
    address previousFeeRecipient,
    address newFeeRecipient,
    address previousOriginationFeeAsset,
    address newOriginationFeeAsset,
    uint80 previousOriginationFeeAmount,
    uint80 newOriginationFeeAmount,
    uint16 previousProtocolFeeBips,
    uint16 newProtocolFeeBips
  );
  event MarketDeployed(
    address indexed hooksTemplate,
    address indexed hooksInstance,
    address indexed market,
    address borrower,
    address borrowerPrincipal,
    address borrowerIdentityRegistry,
    string name,
    string symbol,
    address asset,
    HooksConfig requestedHooks,
    HooksConfig hooks
  );
  event MarketDeploymentConfig(
    address indexed market,
    uint256 maxTotalSupply,
    uint256 annualInterestBips,
    uint256 delinquencyFeeBips,
    uint256 withdrawalBatchDuration,
    uint256 reserveRatioBips,
    uint256 delinquencyGracePeriod,
    address feeRecipient,
    uint256 protocolFeeBips,
    address originationFeeAsset,
    uint256 originationFeeAmount
  );
  event MarketHooksData(address indexed market, bytes hooksData);

  function archController() external view returns (address);

  function sanctionsSentinel() external view returns (address);

  function wrapperFactory() external view returns (address);

  function borrowerIdentityRegistry() external view returns (address);

  function sphereXOperator() external view returns (address);

  function sphereXEngine() external view returns (address);

  function changeSphereXEngine(address newSphereXEngine) external;

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

  function getHooksAdministrator(address hooks) external view returns (address);

  function getHooksInstanceDeploymentNonce(address administrator) external view returns (uint256);

  function getHooksInstancesForAdministrator(
    address administrator
  ) external view returns (address[] memory);

  function getHooksInstancesForAdministrator(
    address administrator,
    uint256 start,
    uint256 end
  ) external view returns (address[] memory);

  function getHooksInstancesCountForAdministrator(
    address administrator
  ) external view returns (uint256);

  function getHooksInstancesForBorrower(address borrower) external view returns (address[] memory);

  function getHooksInstancesCountForBorrower(address borrower) external view returns (uint256);

  function onHooksAdministratorTransferred(
    address previousAdministrator,
    address newAdministrator
  ) external;

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
