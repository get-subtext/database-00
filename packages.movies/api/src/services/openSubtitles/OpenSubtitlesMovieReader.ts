import { isNil, map } from 'lodash-es';
import type { FetchLog } from '../common/FetchLog.types';
import type { Movie } from '../common/Movie.types';
import { OriginEnum, SourceTypeEnum } from '../common/Movie.types';
import type * as T from '../movieApi/MovieApi.types';
import { defaultMovie } from '../utils/defaultMovie';
import { mergeMovies } from '../utils/mergeMovies';
import { OpenSubtitlesApi } from './OpenSubtitlesApi';
import type { GetMovieInfoOutputData, SearchOutputDataDataAttributes, SearchOutputDataDataAttributesRelatedLink } from './OpenSubtitlesApi.types';

export class OpenSubtitlesMovieReader implements T.MovieReader {
  public constructor(private readonly openSubtitlesApi: OpenSubtitlesApi) {}

  public async read(imdbId: string): Promise<T.ReadOutput> {
    const movieInfoListRes = await this.getMovieInfoList(imdbId);
    if (movieInfoListRes.success) {
      const output: T.ReadOutput = { success: true, data: defaultMovie(), logs: [...movieInfoListRes.logs] };
      for (let i = 0; i < movieInfoListRes.data.length; i++) {
        const movieInfo = movieInfoListRes.data[i];
        for (let i = 0; i < movieInfo.data.length; i++) {
          const row = movieInfo.data[i];
          if (row.type !== 'subtitle') continue;
          if (row.attributes.language !== 'en') continue;

          const processMovieInfoRowRes = await this.processMovieInfoRow(row.attributes);
          output.logs.push(...processMovieInfoRowRes.logs);
          output.data = mergeMovies([output.data, processMovieInfoRowRes.data]);
        }
      }

      return output;
    } else {
      return { success: false, data: null, logs: [...movieInfoListRes.logs] };
    }
  }

  private async getMovieInfoList(imdbId: string) {
    type TOutput = { success: boolean; data: GetMovieInfoOutputData[]; logs: FetchLog[] };
    const output: TOutput = { success: true, data: [], logs: [] };

    const getMovieInfoFirst = await this.openSubtitlesApi.getMovieInfo(imdbId, 1);
    output.logs.push(getMovieInfoFirst.log);

    if (getMovieInfoFirst.success) {
      output.data.push(getMovieInfoFirst.data);

      const totalPages = getMovieInfoFirst.data.total_pages ?? 1;
      const pageRequests = [];
      for (let i = 2; i <= totalPages; i++) {
        pageRequests.push(this.openSubtitlesApi.getMovieInfo(imdbId, i));
      }

      const getMovieInfoRestRes = await Promise.all(pageRequests);
      for (let i = 0; i < getMovieInfoRestRes.length; i++) {
        output.logs.push(getMovieInfoRestRes[i].log);
        if (getMovieInfoRestRes[i].success) output.data.push(getMovieInfoRestRes[i].data!);
      }
    }

    return output;
  }

  private async processMovieInfoRow(attributes: SearchOutputDataDataAttributes) {
    type TOutput = { success: boolean; data: Movie; logs: FetchLog[] };
    const output: TOutput = { success: true, data: defaultMovie(), logs: [] };

    output.data.title = attributes.feature_details.title ?? null;
    output.data.releaseYear = attributes.feature_details.year ?? null;
    output.data.posterUrl = this.getPosterLink(attributes.related_links);

    const getDownloadInfoPromises = map(attributes.files, (file) => this.openSubtitlesApi.getDownloadInfo(file.file_id));
    const getDownloadInfoResults = await Promise.all(getDownloadInfoPromises);

    const getFilePromises = map(getDownloadInfoResults, (getDownloadInfoRes) => {
      return getDownloadInfoRes.success ? this.openSubtitlesApi.getFile(getDownloadInfoRes.data.link) : Promise.resolve(null);
    });

    const getFileResults = await Promise.all(getFilePromises);

    const author = attributes.uploader.name ?? null;
    for (let i = 0; i < attributes.files.length; i++) {
      const getDownloadInfoRes = getDownloadInfoResults[i];
      output.logs.push(getDownloadInfoRes.log);

      const getFileRes = getFileResults[i];
      if (getDownloadInfoRes.success && getFileRes !== null) {
        output.logs.push(getFileRes.log);
        if (getFileRes.success) {
          const file = attributes.files[i];
          const subtitleFileName = file.file_name;
          const sourceUrl = getDownloadInfoRes.data.link;
          output.data.subtitlePackages.push({
            provider: 'OpenSubtitles',
            author,
            origin: OriginEnum.Api,
            source: { type: SourceTypeEnum.StandaloneFile, sourceUrl, subtitleFileName },
            text: getFileRes.data,
          });
        }
      }
    }

    return output;
  }

  private getPosterLink(relatedLinks: SearchOutputDataDataAttributesRelatedLink[]) {
    for (let j = 0; j < relatedLinks.length; j++) {
      const relatedLink = relatedLinks[j];
      if (!isNil(relatedLink.img_url)) return relatedLink.img_url;
    }

    return null;
  }
}
