import { cleanEnv, str } from 'envalid';

export const environment = cleanEnv(process.env, {
  // GitHub Config
  REPO_TOKEN: str({}),
  REPO_OWNER: str({}),
  REPO_NAME: str({}),
  // OMDB Config
  OMDB_API_KEY: str({}),
  // Open Subtitles Config
  OPEN_SUBTITLES_API_KEY: str({}),
});
