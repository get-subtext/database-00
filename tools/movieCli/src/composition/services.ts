import { createGitHubIssueService } from '@get-subtext/automation.github';
import { createMovieReader } from '@get-subtext/data-access.movie-reader';
import { createMovieWriter } from '@get-subtext/data-access.movie-writer';
import { last, split } from 'lodash-es';
import { rootDir } from '../rootDir';
import { Handler } from '../services/Handler';
import { Logger } from '../services/Logger';
import { getPkgMeta } from '../utils/getPkgMeta';
import { config } from './config';

const pkgMeta = getPkgMeta(rootDir);
const logPrefix = last(split(pkgMeta.name, '/'));
const botLabel = 'subtext-bot';
const dataSeparator = '===';

export const createHandler = (verbose: boolean) => {
  const logger = new Logger(logPrefix!, verbose);
  const gitHubIssueService = createGitHubIssueService({ apiUrlBase: config.gitHub.apiUrlBase, apiToken: config.gitHub.token, dataSeparator, botLabel });

  const movieReader = createMovieReader({
    omdb: { apiUrlBase: config.omdb.apiUrlBase, apiKey: config.omdb.apiKey },
    openSubtitles: { apiUrlBase: config.openSubtitles.apiUrlBase, apiKey: config.openSubtitles.apiKey },
    subdl: { apiUrlBase: config.subdl.apiUrlBase, zipUrlBase: config.subdl.zipUrlBase, apiKey: config.subdl.apiKey },
  });

  const movieWriter = createMovieWriter({ dir: config.database.dir });

  return new Handler(botLabel, gitHubIssueService, movieReader, movieWriter, logger);
};
