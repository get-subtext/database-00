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
}
