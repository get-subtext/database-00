import { find, isNil } from 'lodash-es';
import { parse } from 'yaml';
import type { GetIssueResponse, GitHubIssueReader } from './GitHubIssueReader.types';
import { ReadOutput, ReadOutputCodeEnum } from './GitHubIssueReader.types';

export class GitHubIssueReaderImpl implements GitHubIssueReader {
  public constructor(
    private readonly apiUrlBase: string,
    private readonly token: string,
    private readonly separator: string,
    private readonly label: string
  ) {}

  public async read(issueNumber: number): Promise<ReadOutput> {
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

  private async getIssue(issueNumber: number) {
    try {
      const issue = <GetIssueResponse>await this.get(`/issues/${issueNumber}`);
      return issue;
    } catch (cause) {
      throw new Error(`Error fetching issue '${issueNumber}'`, { cause });
    }
  }

  private async get(urlPath: string) {
    const url = `${this.apiUrlBase}${urlPath}`;
    const headers = { Authorization: `token ${this.token}`, Accept: 'application/vnd.github.v3+json' };
    const response = await fetch(url, { headers });
    const json = await response.json();
    return json;
  }

  private getRawData(issueBody: string) {
    const separatorIndex = issueBody.indexOf(this.separator);
    if (separatorIndex === -1) return null;

    const rawData = issueBody.slice(separatorIndex + 3).trim();
    return rawData;
  }

  private parseIssueText(issueText: string): Record<string, any> | null {
    const separatorIndex = issueText.indexOf(this.separator);
    if (separatorIndex === -1) return null;

    const yamlContent = issueText.slice(separatorIndex + 3).trim();
    try {
      const data = parse(yamlContent) as Record<string, any>;
      return data;
    } catch (cause) {
      throw new Error(`Could not parse yaml`, { cause });
    }
  }
}
