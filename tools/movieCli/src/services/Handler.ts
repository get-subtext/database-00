import type { ProcessIssueInput } from './Handler.types';
import type { Logger } from './Logger';

export class Handler {
  public constructor(private readonly logger: Logger) {}

  public processIssue({ issueNumber }: ProcessIssueInput) {
    this.logger.infoBlank();
    this.logger.infoStarting();
    this.logger.infoProcessingIssue(issueNumber);
    this.logger.infoBlank();
  }
}
