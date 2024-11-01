export interface GetTextInput {
  url: string;
  headers?: Record<string, string>;
}

export interface GetTextOutput {
  success: boolean;
  status: number;
  body: string | null;
}

export interface GetJsonInput {
  url: string;
  headers?: Record<string, string>;
}

export interface GetJsonOutput {
  success: boolean;
  status: number;
  body: any | null;
}

export interface PostJsonInput {
  url: string;
  headers?: Record<string, string>;
  body?: any;
}

export interface PostJsonOutput {
  success: boolean;
  status: number;
  body: any | null;
}

export enum DataTypeEnum {
  Json = 'Json',
  Text = 'Text',
}

export interface FetchWrapperInput {
  url: string;
  method?: string;
  headers?: Record<string, string>;
  body?: any;
  dataType?: DataTypeEnum;
}

export interface FetchWrapperOutput {
  success: boolean;
  status: number;
  body: any;
}

export interface FetchWrapper {
  fetch: (input: FetchWrapperInput) => Promise<FetchWrapperOutput>;
  getText: (input: GetTextInput) => Promise<GetTextOutput>;
  getJson: (input: GetJsonInput) => Promise<GetJsonOutput>;
  postJson: (input: PostJsonInput) => Promise<PostJsonOutput>;
}
