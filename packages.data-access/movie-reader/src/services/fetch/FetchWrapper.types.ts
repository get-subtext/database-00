export interface GetTextInput {
  url: string;
  headers?: Record<string, string>;
}

export interface GetTextOutputOk {
  success: true;
  status: number;
  body: string;
}

export interface GetTextOutputFail {
  success: false;
  status: number;
  body: string;
}

export type GetTextOutput = GetTextOutputOk | GetTextOutputFail;

export interface GetJsonInput {
  url: string;
  headers?: Record<string, string>;
}

export interface GetJsonOutputOk {
  success: boolean;
  status: number;
  body: any;
}

export interface GetJsonOutputFail {
  success: boolean;
  status: number;
  body: string;
}

export type GetJsonOutput = GetJsonOutputOk | GetJsonOutputFail;

export interface GetFileInput {
  url: string;
  headers?: Record<string, string>;
}

export interface GetFileOutputOk {
  success: true;
  status: number;
  body: ArrayBuffer;
}

export interface GetFileOutputFail {
  success: false;
  status: number;
  body: string;
}

export type GetFileOutput = GetFileOutputOk | GetFileOutputFail;

export interface PostJsonInput {
  url: string;
  headers?: Record<string, string>;
  body?: any;
}

export interface PostJsonOutputOk {
  success: true;
  status: number;
  body: any;
}

export interface PostJsonOutputFail {
  success: false;
  status: number;
  body: string;
}

export type PostJsonOutput = PostJsonOutputOk | PostJsonOutputFail;

export enum DataTypeEnum {
  Json = 'Json',
  Text = 'Text',
}

export interface FetchWrapper {
  getText: (input: GetTextInput) => Promise<GetTextOutput>;
  getJson: (input: GetJsonInput) => Promise<GetJsonOutput>;
  getFile: (input: GetFileInput) => Promise<GetFileOutput>;
  postJson: (input: PostJsonInput) => Promise<PostJsonOutput>;
}
