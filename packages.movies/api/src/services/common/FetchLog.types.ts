export interface FetchInput {
  url: string;
  method: string;
  headers: Record<string, string>;
  body: any;
}

export interface FetchOutput {
  status: number;
  text: string;
}

export interface FetchLog {
  input: FetchInput;
  output: FetchOutput;
}
