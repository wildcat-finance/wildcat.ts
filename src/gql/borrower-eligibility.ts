type BorrowerAccountEligibilityData = {
  registry: {
    archController: {
      id: string;
    };
  };
  principal: {
    registrations: Array<{
      archController: {
        id: string;
      };
      isRegistered: boolean;
    }>;
  };
};

export const hasRegisteredBorrowerAccountPrincipal = (
  accounts: readonly BorrowerAccountEligibilityData[]
): boolean =>
  accounts.some(({ registry, principal }) =>
    principal.registrations.some(
      ({ archController, isRegistered }) =>
        isRegistered && archController.id.toLowerCase() === registry.archController.id.toLowerCase()
    )
  );
