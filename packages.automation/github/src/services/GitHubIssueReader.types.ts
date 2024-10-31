// Note, this is just bare bones, to use internally in this repo.
// There is a lot more data available on the response.
export interface GetIssueResponse {
  number: number;
  title: string;
  labels: [{ name: string }];
  body: string;
}

export enum ReadOutputCodeEnum {
  NotAutomated = 'NotAutomated',
  Automated = 'Automated',
  AutomatedNoData = 'AutomatedNoData',
  AutomatedYamlError = 'AutomatedYamlError',
}

export interface ReadOutputNotAutomated {
  code: ReadOutputCodeEnum.NotAutomated;
}

export interface ReadOutputAutomated {
  code: ReadOutputCodeEnum.Automated;
  data: any;
}

export interface ReadOutputAutomatedNoData {
  code: ReadOutputCodeEnum.AutomatedNoData;
}

export interface ReadOutputAutomatedYamlError {
  code: ReadOutputCodeEnum.AutomatedYamlError;
  yaml: string;
}

export type ReadOutput = ReadOutputNotAutomated | ReadOutputAutomated | ReadOutputAutomatedNoData | ReadOutputAutomatedYamlError;

export interface GitHubIssueReader {
  read: (issueNumber: number) => Promise<ReadOutput>;
}
