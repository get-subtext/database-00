import type { GitHubIssueReader } from './services/GitHubIssueReader.types';
import { GitHubIssueReaderImpl } from './services/GitHubIssueReaderImpl';

export { ReadOutputCodeEnum as ReadOutputTypeEnum } from './services/GitHubIssueReader.types';
export type {
  GetIssueResponse,
  GitHubIssueReader,
  ReadOutput,
  ReadOutputAutomated,
  ReadOutputAutomatedNoData,
  ReadOutputAutomatedYamlError,
  ReadOutputNotAutomated,
} from './services/GitHubIssueReader.types';

export interface GitHubIssueReaderOptions {
  apiUrlBase: string;
  apiToken: string;
  dataSeparator: string;
  botLabel: string;
}

export const createGitHubIssueReader = ({ apiUrlBase, apiToken, dataSeparator, botLabel }: GitHubIssueReaderOptions): GitHubIssueReader => {
  return new GitHubIssueReaderImpl(apiUrlBase, apiToken, dataSeparator, botLabel);
};
