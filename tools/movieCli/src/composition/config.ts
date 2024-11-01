import { environment } from '../config/environment';
import type { Config } from './config.types';

export const config: Config = {
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
};
