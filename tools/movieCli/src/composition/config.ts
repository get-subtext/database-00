import path from 'path';
import { environment } from '../config/environment';
import { rootDir } from '../rootDir';
import type { Config } from './config.types';

export const config: Config = {
  database: {
    dir: path.resolve(rootDir, '..', '..', '__data__'),
  },
  gitHub: {
    token: environment.REPO_TOKEN,
    apiUrlBase: `https://api.gitHub.com/repos/${environment.REPO_OWNER}/${environment.REPO_NAME}`,
    uiUrlBase: `https://gitHub.com/${environment.REPO_OWNER}/${environment.REPO_NAME}`,
  },
  omdb: {
    apiKey: environment.OMDB_API_KEY,
    apiUrlBase: 'https://www.omdbapi.com',
  },
  openSubtitles: {
    apiKey: environment.OPEN_SUBTITLES_API_KEY,
    apiUrlBase: 'https://api.opensubtitles.com/api/v1',
  },
  subdl: {
    apiKey: environment.SUBDL_API_KEY,
    apiUrlBase: 'https://api.subdl.com/api/v1/subtitles',
    zipUrlBase: 'https://dl.subdl.com',
  },
};
