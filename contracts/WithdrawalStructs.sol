// SPDX-License-Identifier: MIT
pragma solidity ^0.8.20;

struct AccountWithdrawalStatus {
  uint104 scaledAmount;
  uint128 normalizedAmountWithdrawn;
}

struct WithdrawalBatch {
  uint104 scaledTotalAmount;
  uint104 scaledAmountBurned;
  uint128 normalizedAmountPaid;
}
