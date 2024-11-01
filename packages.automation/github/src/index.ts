import { GitHubIssueService as GitHubIssueServiceImpl } from './services/GitHubIssueService';
import type { GitHubIssueService } from './services/GitHubIssueService.types';

export { ReadOutputCodeEnum as ReadOutputTypeEnum } from './services/GitHubIssueService.types';
export type {
  GetIssueResponse,
  GitHubIssueService,
  ReadOutput,
  ReadOutputAutomated,
  ReadOutputAutomatedNoData,
  ReadOutputAutomatedYamlError,
  ReadOutputNotAutomated,
} from './services/GitHubIssueService.types';

export interface GitHubIssueReaderOptions {
  apiUrlBase: string;
  apiToken: string;
  dataSeparator: string;
  botLabel: string;
}

export const createGitHubIssueService = ({ apiUrlBase, apiToken, dataSeparator, botLabel }: GitHubIssueReaderOptions): GitHubIssueService => {
  return new GitHubIssueServiceImpl(apiUrlBase, apiToken, dataSeparator, botLabel);
};
