export interface GitHubConfig {
  token: string;
  apiUrlBase: string;
  uiUrlBase: string;
}

export interface OmdbConfig {
  apiKey: string;
  apiUrlBase: string;
}

export interface Config {
  gitHub: GitHubConfig;
  omdb: OmdbConfig;
}
