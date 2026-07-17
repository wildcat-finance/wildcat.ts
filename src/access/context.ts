import { HooksTemplateRegistrationMetadata } from "../domain";

export type HooksAccountContext = {
  signerAddress?: string;
  isRegisteredBorrower?: boolean;
};

export type HooksLensReadContext = HooksAccountContext & {
  hooksFactory: string;
  isRegisteredHooksFactory: boolean;
  registration?: HooksTemplateRegistrationMetadata;
};
