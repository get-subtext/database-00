import type { GitHubIssueReader } from './services/GitHubIssueReader.types';
import { GitHubIssueReaderImpl } from './services/GitHubIssueReaderImpl';

export type { GitHubIssueReader } from './services/GitHubIssueReader.types';

export interface GitHubIssueReaderOptions {
  apiUrlBase: string;
  apiToken: string;
  dataSeparator: string;
  botLabel: string;
}

export const createGitHubIssueReader = ({ apiUrlBase, apiToken, dataSeparator, botLabel }: GitHubIssueReaderOptions): GitHubIssueReader => {
  return new GitHubIssueReaderImpl(apiUrlBase, apiToken, dataSeparator, botLabel);
};
