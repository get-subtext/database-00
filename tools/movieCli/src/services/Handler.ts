import type { GitHubIssueService } from '@get-subtext/automation.github';
import type { MovieReader } from '@get-subtext/movies.api';
import { countBy, get, isNil } from 'lodash-es';
import { ReadOutputCodeEnum } from 'packages.automation/github/src/services/GitHubIssueService.types';
import type { ProcessIssueInput } from './Handler.types';
import type { Logger } from './Logger';

export class Handler {
  public constructor(
    private readonly botLabel: string,
    private readonly gitHubIssueService: GitHubIssueService,
    private readonly movieReader: MovieReader,
    private readonly logger: Logger
  ) {}

  public async processIssue({ issueNumber }: ProcessIssueInput) {
    this.logger.infoBlank();
    this.logger.infoIssueStarting(issueNumber);

    const readRes = await this.gitHubIssueService.read(issueNumber);
    switch (readRes.code) {
      case ReadOutputCodeEnum.NotAutomated:
        this.logger.infoIssueNotProcessing(this.botLabel);
        break;
      case ReadOutputCodeEnum.Automated:
        const type = get(readRes.data, 'type');
        if (isNil(type)) {
          this.logger.errorIssueNoType();
        } else {
          await this.doProcessIssue(issueNumber, type, readRes.data);
        }

        break;
      case ReadOutputCodeEnum.AutomatedNoData:
        this.logger.errorIssueNoData();
        break;
      case ReadOutputCodeEnum.AutomatedYamlError:
        this.logger.errorIssueInvalidYaml();
        break;
    }

    this.logger.infoBlank();
  }

  private async doProcessIssue(issueNumber: number, type: string, data: any) {
    switch (type) {
      case 'REQUEST_MOVIE':
        await this.requestMovie(data);
        break;
      default:
        this.logger.warnIssueInvalidType(type);
        break;
    }
  }

  public async requestMovie(input: any) {
    const imdbId = input.imdbId;
    const { success, data, logs } = await this.movieReader.read(imdbId);

    const apiStats = countBy(logs, (l) => (l.output.status >= 200 && l.output.status <= 299 ? 'passed' : 'failed'));
    if (success) {
      this.logger.infoRequestMovieFound(imdbId, data.title, data.subtitlePackages.length, apiStats.passed, apiStats.failed);
    } else {
      this.logger.infoRequestMovieNotFound(imdbId, apiStats.passed, apiStats.failed);
    }
  }
}
