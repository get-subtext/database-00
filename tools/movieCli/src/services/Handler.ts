import type { GitHubIssueReader } from '@get-subtext/automation.github';
import type { MovieReader } from '@get-subtext/movies.api';
import type { ProcessIssueInput } from './Handler.types';
import type { Logger } from './Logger';

export class Handler {
  public constructor(
    private readonly gitHubIssueReader: GitHubIssueReader,
    private readonly movieReader: MovieReader,
    private readonly logger: Logger
  ) {}

  public async processIssue({ issueNumber }: ProcessIssueInput) {
    this.logger.infoBlank();
    this.logger.infoStarting();
    this.logger.infoProcessingIssue(issueNumber);

    const data = await this.gitHubIssueReader.read(issueNumber);
    await this.processAddMovie(data);

    this.logger.infoBlank();
  }

  public async processAddMovie(data: any) {
    const imdbId = data.imdbId;
    const movie = await this.movieReader.read(imdbId);
    console.log(movie);
  }
}
