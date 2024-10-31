import { find, isNil } from 'lodash-es';
import { parse } from 'yaml';
import { GetIssueResponse } from './GitHubIssueReader.types';

export class GitHubIssueReader {
  public constructor(
    private readonly apiUrlBase: string,
    private readonly token: string,
    private readonly separator: string,
    private readonly label: string
  ) {}

  public async read(issueNumber: number) {
    const issue = <GetIssueResponse>await this.get(`/issues/${issueNumber}`);
    const label = find(issue.labels, (l) => l.name === this.label);
    if (isNil(label)) return null;

    try {
      const data = this.parseIssueText(issue.body);
      return data;
    } catch (cause) {
      throw new Error(`GitHubIssueReader: read '${issueNumber}' failed`, { cause });
    }
  }

  private async get(urlPath: string) {
    const url = `${this.apiUrlBase}${urlPath}`;
    const headers = { Authorization: `token ${this.token}`, Accept: 'application/vnd.github.v3+json' };
    const response = await fetch(url, { headers });
    const json = await response.json();
    return json;
  }

  private parseIssueText(issueText: string): Record<string, any> {
    const separatorIndex = issueText.indexOf(this.separator);
    if (separatorIndex === -1) throw new Error(`No separator found`);

    const yamlContent = issueText.slice(separatorIndex + 3).trim();
    try {
      const data = parse(yamlContent) as Record<string, any>;
      return data;
    } catch (cause) {
      throw new Error(`Could not parse yaml`, { cause });
    }
  }
}
