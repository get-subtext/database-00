import { FetchLog } from '../common/FetchLog.types';

export interface CreateLogInput {
  input: {
    url: string;
    method?: string;
    body?: any | null;
    headers?: Record<string, string>;
  };
  output: {
    status: number;
    body?: any | null;
  };
}

export const createLog = ({ input, output }: CreateLogInput): FetchLog => ({
  input: {
    url: input.url,
    method: input.method ?? 'GET',
    body: input.body ?? null,
    headers: input.headers ?? {},
  },
  output: {
    status: output.status,
    body: output.body ?? null,
  },
});
