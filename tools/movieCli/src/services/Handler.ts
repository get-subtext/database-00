import type { GitHubIssueReader } from '@get-subtext/automation.github';
import type { ProcessIssueInput } from './Handler.types';
import type { Logger } from './Logger';

export class Handler {
  public constructor(
    private readonly gitHubIssueReader: GitHubIssueReader,
    private readonly logger: Logger
  ) {}

  public async processIssue({ issueNumber }: ProcessIssueInput) {
    this.logger.infoBlank();
    this.logger.infoStarting();
    this.logger.infoProcessingIssue(issueNumber);

    const data = await this.gitHubIssueReader.read(issueNumber);
    console.log(data);

    this.logger.infoBlank();
  }
}
