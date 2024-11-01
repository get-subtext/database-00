export interface GitHubConfig {
  token: string;
  apiUrlBase: string;
  uiUrlBase: string;
}

export interface OmdbConfig {
  apiKey: string;
  apiUrlBase: string;
}

export interface OpenSubtitlesConfig {
  apiKey: string;
  apiUrlBase: string;
}

export interface SubdlConfig {
  apiKey: string;
  apiUrlBase: string;
  zipUrlBase: string;
}

export interface Config {
  gitHub: GitHubConfig;
  omdb: OmdbConfig;
  openSubtitles: OpenSubtitlesConfig;
  subdl: SubdlConfig;
}
