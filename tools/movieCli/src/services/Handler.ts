import type { GitHubIssueService } from '@get-subtext/automation.github';
import type { MovieReader } from '@get-subtext/movies.api';
import type { MovieWriter } from '@get-subtext/movies.database';
import { countBy, get, isNil, join } from 'lodash-es';
import { ReadOutputCodeEnum } from 'packages.automation/github/src/services/GitHubIssueService.types';
import type { ProcessIssueInput } from './Handler.types';
import type { Logger } from './Logger';

export class Handler {
  public constructor(
    private readonly botLabel: string,
    private readonly gitHubIssueService: GitHubIssueService,
    private readonly movieReader: MovieReader,
    private readonly movieWriter: MovieWriter,
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
        await this.requestMovie(issueNumber, data);
        break;
      default:
        this.logger.warnIssueInvalidType(type);
        break;
    }
  }

  public async requestMovie(issueNumber: number, input: any) {
    const imdbId = input.imdbId;
    const { success, data, logs } = await this.movieReader.read(imdbId);

    const issueComments: string[] = [];
    const apiStats = countBy(logs, (l) => (l.output.status >= 200 && l.output.status <= 299 ? 'passed' : 'failed'));
    if (success) {
      this.logger.infoRequestMovieFound(imdbId, data.title, data.subtitlePackages.length, apiStats.passed, apiStats.failed);
      issueComments.push(`:clapper: **${data.title}**`);
      const filePaths = await this.movieWriter.writeMovie(data);
      for (let i = 0; i < filePaths.length; i++) {
        this.logger.infoRequestMovieFileWrite(filePaths[i]);
      }
    } else {
      this.logger.infoRequestMovieNotFound(imdbId, apiStats.passed, apiStats.failed);
      issueComments.push(`:clapper: **Unknown Movie**`);
    }

    const subtitleCount = data?.subtitlePackages.length ?? 0;
    const packageP11n = subtitleCount === 1 ? 'package' : 'packages';
    const passedCallP11n = apiStats.passed === 1 ? 'call' : 'calls';
    const failedCallP11n = apiStats.failed === 1 ? 'call' : 'calls';
    issueComments.push(`- ${subtitleCount} valid subtitle ${packageP11n} found`);
    issueComments.push(``);
    issueComments.push(`:clipboard: **API Stats**`);
    issueComments.push(`- ${apiStats.passed} API ${passedCallP11n} passed`);
    issueComments.push(`- ${apiStats.failed} API ${failedCallP11n} failed`);
    await this.gitHubIssueService.close(issueNumber, join(issueComments, '\n'), []);
  }
}
