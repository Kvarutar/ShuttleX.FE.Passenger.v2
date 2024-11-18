export type LockedErrorBody = {
  lockOutEndTime: string;
  lockOutReason: string;
};

export type IncorrectFieldsErrorBody = {
  field: string | null;
  message: string;
};
