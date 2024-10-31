export interface GitHubConfig {
  token: string;
  apiUrlBase: string;
  uiUrlBase: string;
}

export interface Config {
  gitHub: GitHubConfig;
}
