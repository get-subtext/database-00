// Note, this is just bare bones, to use internally in this repo.
// There is a lot more data available on the response.
export interface GetIssueResponse {
  number: number;
  title: string;
  labels: [{ name: string }];
  body: string;
}

export interface GitHubIssueReader {
  read: (issueNumber: number) => Promise<any>;
}
