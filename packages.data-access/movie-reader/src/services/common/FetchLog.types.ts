export interface FetchInput {
  url: string;
  method: string;
  headers: Record<string, string>;
  body: any;
}

export interface FetchOutput {
  status: number;
  body: any | null;
}

export interface FetchLog {
  input: FetchInput;
  output: FetchOutput;
}
