

struct LenderStatus {
  bool isBlockedFromDeposits;
  address lastProvider;
  bool canRefresh;
  uint32 lastApprovalTimestamp;
}