import { isNil } from 'lodash-es';
import { FetchLog } from '../common/FetchLog.types';
import { Movie, OriginEnum, SourceTypeEnum } from '../common/Movie.types';
import { MovieReader, ReadOutput } from '../movieApi/MovieApi.types';
import { defaultMovie } from '../utils/defaultMovie';
import { mergeMovie } from '../utils/mergeMovie';
import { OpenSubtitlesApi } from './OpenSubtitlesApi';
import { GetMovieInfoOutputData, GetMovieInfoOutputDataData, SearchOutputDataDataAttributesRelatedLink } from './OpenSubtitlesApi.types';

export class OpenSubtitlesMovieReader implements MovieReader {
  public constructor(private readonly openSubtitlesApi: OpenSubtitlesApi) {}

  public async read(imdbId: string) {
    const output: ReadOutput = { success: false, data: null, logs: [] };

    const movieInfoListRes = await this.getMovieInfoList(imdbId);
    output.logs.push(...movieInfoListRes.logs);

    if (movieInfoListRes.success) {
      for (let i = 0; i < movieInfoListRes.data.length; i++) {
        const movieInfo = movieInfoListRes.data[i];
        for (let i = 0; i < movieInfo.data.length; i++) {
          const row = movieInfo.data[i];
          if (row.type !== 'subtitle') continue;
          if (row.attributes.language !== 'en') continue;

          const processMovieInfoRowRes = await this.processMovieInfoRow(row);
          output.logs.push(...processMovieInfoRowRes.logs);
          output.data = mergeMovie(output.data, processMovieInfoRowRes.data);
        }
      }
    }

    return output;
  }

  private async getMovieInfoList(imdbId: string) {
    type TOutput = { success: boolean; data: GetMovieInfoOutputData[]; logs: FetchLog[] };
    const output: TOutput = { success: true, data: [], logs: [] };

    // Note, pagination doesn't seem to work, so break after the first page.
    // If the issue gets fixed, set `maxPages` to something reasonable to allow pagination.
    const maxPages = 1;
    let page = 0;
    while (true) {
      page++;
      const searchRes = await this.openSubtitlesApi.getMovieInfo(imdbId, page);
      output.logs.push(...searchRes.logs);
      if (searchRes.success) output.data.push(searchRes.data);
      if (!searchRes.success) break;
      if (searchRes.data!.page > searchRes.data!.total_pages) break;
      if (page >= maxPages) break;
    }

    return output;
  }

  private async processMovieInfoRow(movieInfoRow: GetMovieInfoOutputDataData) {
    type TOutput = { success: boolean; data: Movie; logs: FetchLog[] };
    const output: TOutput = { success: true, data: defaultMovie(), logs: [] };

    output.data.title = movieInfoRow.attributes.feature_details.title ?? null;
    output.data.releaseYear = movieInfoRow.attributes.feature_details.year ?? null;
    output.data.posterUrl = this.getPosterLink(movieInfoRow.attributes.related_links);

    const author = movieInfoRow.attributes.uploader.name ?? null;
    for (let i = 0; i < movieInfoRow.attributes.files.length; i++) {
      const file = movieInfoRow.attributes.files[i];
      const getDownloadInfoRes = await this.openSubtitlesApi.getDownloadInfo(file.file_id);
      output.logs.push(...getDownloadInfoRes.logs);

      if (getDownloadInfoRes.success) {
        const url = getDownloadInfoRes.data!.link;
        const getFileRes = await this.openSubtitlesApi.getFile(url);
        output.logs.push(...getFileRes.logs);

        if (getFileRes.success) {
          output.data.subtitlePackages.push({
            provider: 'OpenSubtitles',
            author,
            origin: OriginEnum.Api,
            source: { type: SourceTypeEnum.StandaloneFile, sourceUrl: url, subtitleFileName: file.file_name },
            text: getFileRes.data!,
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
