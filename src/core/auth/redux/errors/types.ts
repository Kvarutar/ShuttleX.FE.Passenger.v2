export enum AuthNetworkErrors {
  Locked = 'locked',
  IncorrectFields = 'incorrect_fields',
}

export type LockedErrorBody = {
  lockOutEndTime: string;
  lockOutReason: string;
};

export type IncorrectFieldsErrorBody = {
  field: string | null;
  message: string;
};
