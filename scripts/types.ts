export type FormattedCommand = {
  executable: string;
  args: string[];
};

export type ExecArgs = {
  unixCommand: string;
  winCommand: string;
  options?: {
    dontParseArgs?: boolean; // for example: disables parsing args "some_arg1" and "some_arg2" in "yarn some_script some_arg1 some_arg2"
  };
};
