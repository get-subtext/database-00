export interface ExtractZipResponseOk {
  success: true;
  data: Record<string, string>;
  message: null;
}

export interface ExtractZipResponseFail {
  success: false;
  data: null;
  message: string;
}

export type ExtractZipResponse = ExtractZipResponseOk | ExtractZipResponseFail;
