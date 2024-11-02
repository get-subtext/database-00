export enum OriginEnum {
  Manual = 'Manual',
  Api = 'Api',
}

export enum SourceTypeEnum {
  ZipFile = 'ZipFile',
  StandaloneFile = 'StandaloneFile',
}

export interface SubtitlePackage {
  subtitlePackageId: string;
  provider: string;
  author: string | null;
  origin: OriginEnum;
  source: ZipFileSource | StandaloneFileSource;
  subtitles: string;
}

interface ZipFileSource {
  type: SourceTypeEnum.ZipFile;
  sourceUrl: string;
  zipFileName: string;
  subtitleFileName: string;
}

interface StandaloneFileSource {
  type: SourceTypeEnum.StandaloneFile;
  sourceUrl: string;
  subtitleFileName: string;
}

export interface Movie {
  imdbId: string;
  title: string;
  posterUrl: string | null;
  releaseDate: string | null;
  releaseYear: number | null;
  rated: string | null;
  genres: string[];
  directors: string[];
  writers: string[];
  actors: string[];
  runTimeMins: number | null;
  plot: string | null;
  subtitlePackages: SubtitlePackage[];
}
