import "./WildcatArchController.sol";

contract CheckBorrowersRegistered {
  constructor(address archController, address[] memory borrowers) {
    WildcatArchController controller = WildcatArchController(archController);
    bool[] memory isRegistered = new bool[](borrowers.length);
    for (uint i = 0; i < borrowers.length; i++) {
      isRegistered[i] = controller.isRegisteredBorrower(borrowers[i]);
    }
    bytes memory data = abi.encode(isRegistered);
    assembly {
      return(add(data, 32), mload(data))
    }
  }
}