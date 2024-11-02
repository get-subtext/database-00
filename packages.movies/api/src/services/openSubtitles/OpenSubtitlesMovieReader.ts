import { map, range } from 'lodash-es';
import { defaultMovie } from '../../utils/defaultMovie';
import { mergeMovies } from '../../utils/mergeMovies';
import type { FetchLog } from '../common/FetchLog.types';
import type { Movie } from '../common/Movie.types';
import { OriginEnum, SourceTypeEnum } from '../common/Movie.types';
import type * as T from '../movieReader/MovieReader.types';
import { OpenSubtitlesApi } from './OpenSubtitlesApi';
import type { OpenSubtitlesMapper } from './OpenSubtitlesMapper.types';

const provider = 'OpenSubtitles';
const origin = OriginEnum.Api;
const type = SourceTypeEnum.StandaloneFile;

export class OpenSubtitlesMovieReader implements T.MovieReader {
  public constructor(
    private readonly openSubtitlesApi: OpenSubtitlesApi,
    private readonly openSubtitlesMapper: OpenSubtitlesMapper
  ) {}

  public async read(imdbId: string): Promise<T.ReadMovieResponse> {
    const output: T.ReadMovieResponse = { success: true, data: defaultMovie(), logs: [] };

    const getSubtitlePackageListRes = await this.getSubtitlePackageList(imdbId);
    output.logs.push(...getSubtitlePackageListRes.logs);
    for (let i = 0; i < getSubtitlePackageListRes.data.length; i++) {
      const subtitlePackage = getSubtitlePackageListRes.data[i];
      const toMovieRes = await this.toMovie(subtitlePackage);
      output.logs.push(...toMovieRes.logs);
      output.data = mergeMovies([output.data, toMovieRes.data]);
    }

    return output;
  }

  private async getSubtitlePackageList(imdbId: string) {
    type TOutput = { data: Movie[]; logs: FetchLog[] };
    const output: TOutput = { data: [], logs: [] };

    const subtitlesFirstPage = await this.openSubtitlesApi.getMoviePage(imdbId, 1);
    output.logs.push(subtitlesFirstPage.log);

    if (subtitlesFirstPage.success) {
      const subtitlePackagePage = this.openSubtitlesMapper.toMoviePage(subtitlesFirstPage.data);
      output.data.push(...subtitlePackagePage.movie);

      const totalPages = subtitlePackagePage.totalPages ?? 1;
      const remainingPages = range(2, totalPages + 1);
      const getSubtitlesPromises = map(remainingPages, (page) => this.openSubtitlesApi.getMoviePage(imdbId, page));
      const getSubtitlesResults = await Promise.all(getSubtitlesPromises);

      for (let j = 0; j < getSubtitlesResults.length; j++) {
        const getSubtitlesRes = getSubtitlesResults[j];
        output.logs.push(getSubtitlesRes.log);
        if (getSubtitlesRes.success) {
          const subtitlePackagePage = this.openSubtitlesMapper.toMoviePage(getSubtitlesRes.data);
          output.data.push(...subtitlePackagePage.movie);
        }
      }
    }

    return output;
  }

  private async toMovie({ title, releaseYear, posterUrl, author, files }: Movie) {
    type TOutput = { data: Movie; logs: FetchLog[] };
    const output: TOutput = { data: defaultMovie(), logs: [] };

    output.data.title = title ?? output.data.title;
    output.data.releaseYear = releaseYear;
    output.data.posterUrl = posterUrl;

    const getDownloadInfoPromises = map(files, (file) => this.openSubtitlesApi.getDownloadMeta(file.id));
    const getDownloadInfoResults = await Promise.all(getDownloadInfoPromises);

    const getFilePromises = map(getDownloadInfoResults, (getDownloadInfoRes) => {
      return getDownloadInfoRes.success ? this.openSubtitlesApi.downloadTextFile(getDownloadInfoRes.data.link) : Promise.resolve(null);
    });

    const getFileResults = await Promise.all(getFilePromises);
    for (let i = 0; i < files.length; i++) {
      const file = files[i];
      const getDownloadInfoRes = getDownloadInfoResults[i];
      output.logs.push(getDownloadInfoRes.log);

      const getFileRes = getFileResults[i];
      if (getDownloadInfoRes.success && getFileRes !== null) {
        output.logs.push(getFileRes.log);
        if (getFileRes.success) {
          const subtitleFileName = file.name;
          const sourceUrl = getDownloadInfoRes.data.link;
          const text = getFileRes.data;
          output.data.subtitlePackages.push({ provider, author, origin, source: { type, sourceUrl, subtitleFileName }, text });
        }
      }
    }

    return output;
  }
}
