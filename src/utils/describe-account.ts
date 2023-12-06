import { AccountQuery, AccountQuery__factory } from "../typechain";
import { SignerOrProvider } from "../types";

export enum AccountKind {
  EOA = 0,
  Safe = 1,
  UnknownContract = 2
}

export type AccountDescription =
  | {
      kind: AccountKind.EOA | AccountKind.UnknownContract;
    }
  | {
      kind: AccountKind.Safe;
      owners: string[];
      threshold: number;
    };

export async function describeAccount(
  provider: SignerOrProvider,
  address: string
): Promise<AccountDescription> {
  const bytecode = AccountQuery__factory.bytecode.concat(
    address.replace(/^0x/, "").padStart(64, "0")
  );
  const result = await provider.call({ data: bytecode });

  const [{ owners, threshold, kind: _kind }] =
    AccountQuery__factory.createInterface().decodeFunctionResult("describeAccount", result) as [
      Awaited<ReturnType<AccountQuery["describeAccount"]>>
    ];
  const kind = _kind as AccountKind;
  if (kind === AccountKind.EOA || kind === AccountKind.UnknownContract) {
    return { kind };
  }
  return { kind, owners, threshold: threshold.toNumber() };
}
