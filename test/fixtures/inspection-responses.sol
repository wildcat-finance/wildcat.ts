// SPDX-License-Identifier: MIT
pragma solidity >=0.7.0 <0.9.0;

// Controlled return data for local inspection regression tests.
contract InspectionResponseFixture {
  struct Response {
    bool configured;
    bool shouldRevert;
    bytes data;
  }

  mapping(bytes4 => Response) private responses;
  mapping(bytes32 => Response) private callResponses;

  function setResponse(bytes4 selector, bool shouldRevert, bytes calldata data) external {
    responses[selector] = Response(true, shouldRevert, data);
  }

  function setCallResponse(bytes calldata callData, bool shouldRevert, bytes calldata data) external {
    callResponses[keccak256(callData)] = Response(true, shouldRevert, data);
  }

  fallback() external {
    Response memory response = callResponses[keccak256(msg.data)];
    if (!response.configured) response = responses[msg.sig];
    bytes memory data = response.data;
    if (response.shouldRevert) {
      assembly {
        revert(add(data, 32), mload(data))
      }
    }
    assembly {
      return(add(data, 32), mload(data))
    }
  }
}
