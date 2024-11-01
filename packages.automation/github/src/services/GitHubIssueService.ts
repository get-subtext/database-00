import { find, isNil } from 'lodash-es';
import { parse } from 'yaml';
import type * as T from './GitHubIssueService.types';
import { ReadOutputCodeEnum } from './GitHubIssueService.types';

export class GitHubIssueService implements T.GitHubIssueService {
  public constructor(
    private readonly apiUrlBase: string,
    private readonly token: string,
    private readonly separator: string,
    private readonly label: string
  ) {}

  public async read(issueNumber: number): Promise<T.ReadOutput> {
    try {
      return await this.doRead(issueNumber);
    } catch (cause) {
      throw new Error(`[Github] Error reading issue '${issueNumber}'`, { cause });
    }
  }

  public async close(issueNumber: number, comment: string, labels: string[]) {
    try {
      await this.doClose(issueNumber, comment, labels);
    } catch (cause) {
      throw new Error(`[Github] Error closing issue '${issueNumber}'`, { cause });
    }
  }

  private async doRead(issueNumber: number): Promise<T.ReadOutput> {
    const issue = await this.getIssue(issueNumber);

    const label = find(issue.labels, (l) => l.name === this.label);
    if (isNil(label)) return { code: ReadOutputCodeEnum.NotAutomated };

    const rawData = this.getRawData(issue.body);
    if (isNil(rawData)) return { code: ReadOutputCodeEnum.AutomatedNoData };

    try {
      const data = parse(rawData);
      return { code: ReadOutputCodeEnum.Automated, data };
    } catch {
      return { code: ReadOutputCodeEnum.AutomatedYamlError, yaml: rawData };
    }
  }

  private async doClose(issueNumber: number, comment: string, labels: string[]) {
    await this.patch(`/issues/${issueNumber}`, { state: 'closed' });
    await this.post(`/issues/${issueNumber}/labels`, { labels });
    await this.post(`/issues/${issueNumber}/comments`, { body: comment });
  }

  private async getIssue(issueNumber: number) {
    try {
      const issue = <T.GetIssueResponse>await this.get(`/issues/${issueNumber}`);
      return issue;
    } catch (cause) {
      throw new Error(`Error fetching issue '${issueNumber}'`, { cause });
    }
  }

  private async get(urlPath: string) {
    const url = `${this.apiUrlBase}${urlPath}`;
    const headers = this.getHeaders();
    const response = await fetch(url, { headers });
    const json = await response.json();
    return json;
  }

  private async patch(urlPath: string, body: any) {
    const url = `${this.apiUrlBase}${urlPath}`;
    const headers = this.getHeaders();
    const response = await fetch(url, { method: 'PATCH', headers, body: JSON.stringify(body) });
    const json = await response.json();
    return json;
  }

  private async post(urlPath: string, body: any) {
    const url = `${this.apiUrlBase}${urlPath}`;
    const headers = this.getHeaders();
    const response = await fetch(url, { method: 'POST', headers, body: JSON.stringify(body) });
    const json = await response.json();
    return json;
  }

  private getHeaders() {
    const headers = { Authorization: `token ${this.token}`, Accept: 'application/vnd.github.v3+json' };
    return headers;
  }

  private getRawData(issueBody: string) {
    const separatorIndex = issueBody.indexOf(this.separator);
    if (separatorIndex === -1) return null;

    const rawData = issueBody.slice(separatorIndex + 3).trim();
    return rawData;
  }
}
