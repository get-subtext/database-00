import { createGitHubIssueReader } from '@get-subtext/automation.github';
import { createMovieReader } from '@get-subtext/movies.api';
import { last, split } from 'lodash-es';
import { rootDir } from '../rootDir';
import { Handler } from '../services/Handler';
import { Logger } from '../services/Logger';
import { getPkgMeta } from '../utils/getPkgMeta';
import { config } from './config';

const pkgMeta = getPkgMeta(rootDir);
const logPrefix = last(split(pkgMeta.name, '/'));
const botLabel = 'subtext-bot';

export const createHandler = (verbose: boolean) => {
  const logger = new Logger(logPrefix!, verbose);
  const gitHubIssueReader = createGitHubIssueReader({
    apiUrlBase: config.gitHub.apiUrlBase,
    apiToken: config.gitHub.token,
    dataSeparator: '===',
    botLabel,
  });

  const movieReader = createMovieReader({});
  return new Handler(botLabel, gitHubIssueReader, movieReader, logger);
};
