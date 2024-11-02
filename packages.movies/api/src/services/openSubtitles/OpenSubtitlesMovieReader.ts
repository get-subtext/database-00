import { join, map, range } from 'lodash-es';
import { defaultMovie } from '../../utils/defaultMovie';
import { generateHashFromText } from '../../utils/generateHash';
import { mergeMovies } from '../../utils/mergeMovies';
import { toLines } from '../../utils/parseSrt';
import type { FetchLog } from '../common/FetchLog.types';
import type { Movie } from '../common/Movie.types';
import { OriginEnum, SourceTypeEnum } from '../common/Movie.types';
import type * as T from '../movieReader/MovieReader.types';
import type { OpenSubtitlesApi } from './OpenSubtitlesApi';
import type { OpenSubtitlesMapper, OsMappedMovie } from './OpenSubtitlesMapper.types';

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
    type TOutput = { data: OsMappedMovie[]; logs: FetchLog[] };
    const output: TOutput = { data: [], logs: [] };

    const getMoviePageFirstRes = await this.openSubtitlesApi.getMoviePage(imdbId, 1);
    output.logs.push(getMoviePageFirstRes.log);

    if (getMoviePageFirstRes.success) {
      const moviePage = this.openSubtitlesMapper.toMoviePage(getMoviePageFirstRes.data);
      output.data.push(...moviePage.movie);

      const totalPages = moviePage.totalPages ?? 1;
      const remainingPages = range(2, totalPages + 1);
      const getMoviePagePromises = map(remainingPages, (page) => this.openSubtitlesApi.getMoviePage(imdbId, page));
      const getMoviePageResults = await Promise.all(getMoviePagePromises);

      for (let j = 0; j < getMoviePageResults.length; j++) {
        const getMoviePageRes = getMoviePageResults[j];
        output.logs.push(getMoviePageRes.log);
        if (getMoviePageRes.success) {
          const moviePage = this.openSubtitlesMapper.toMoviePage(getMoviePageRes.data);
          output.data.push(...moviePage.movie);
        }
      }
    }

    return output;
  }

  private async toMovie({ title, releaseYear, posterUrl, author, files }: OsMappedMovie) {
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
          const subtitles = join(toLines(getFileRes.data), '\n');
          const subtitlePackageId = generateHashFromText(subtitles);
          output.data.subtitlePackages.push({ subtitlePackageId, provider, author, origin, source: { type, sourceUrl, subtitleFileName }, subtitles });
        }
      }
    }

    return output;
  }
}
