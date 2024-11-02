import AdmZip from 'adm-zip';
import { cloneDeep, get, toPairs } from 'lodash-es';
import path from 'path';
import { defaultMovie } from '../../utils/defaultMovie';
import { OriginEnum, SourceTypeEnum } from '../common/Movie.types';
import type * as T from '../movieApi/MovieApi.types';
import type { SubdlApi } from './SubdlApi';
import type { SubdlMapper } from './SubdlMapper.types';
import type { ExtractZipResponse } from './SubdlMovieReader.types';

const provider = 'Subdl';
const origin = OriginEnum.Api;
const type = SourceTypeEnum.ZipFile;

export class SubdlMovieReader implements T.MovieReader {
  public constructor(
    private readonly subdlZipUrlBase: string,
    private readonly subdlApi: SubdlApi,
    private readonly subdlMapper: SubdlMapper
  ) {}

  public async read(imdbId: string): Promise<T.ReadMovieResponse> {
    const getMovieInfoRes = await this.subdlApi.getMovieInfo(imdbId);

    if (!getMovieInfoRes.success) return { success: false, data: null, logs: [getMovieInfoRes.log] };

    const { title, releaseDate, releaseYear, subtitles } = this.subdlMapper.toSubtitlePackage(getMovieInfoRes.data);
    const movie = { ...defaultMovie(), title, releaseDate, releaseYear };
    const logs = [getMovieInfoRes.log];
    for (let i = 0; i < subtitles.length; i++) {
      const { baseUrl, author } = subtitles[i];

      // if download fails, record download log as-is
      const downloadZipFileRes = await this.subdlApi.downloadZipFile(baseUrl);
      if (!downloadZipFileRes.success) logs.push(downloadZipFileRes.log);
      if (!downloadZipFileRes.success) continue;

      // if download fails, override download log with zip extract info
      const extractZipRes = await this.extractZip(downloadZipFileRes.data);
      const log = cloneDeep(downloadZipFileRes.log);
      log.output.status = extractZipRes.success ? log.output.status : 0;
      log.output.body = extractZipRes.success ? extractZipRes.data : extractZipRes.message;
      logs.push(log);
      if (!extractZipRes.success) continue;

      const sourceUrl = `${this.subdlZipUrlBase}${baseUrl}`;
      const subtitleFilePairs = toPairs(extractZipRes.data);
      const zipFileName = path.basename(baseUrl);
      for (let i = 0; i < subtitleFilePairs.length; i++) {
        const [subtitleFileName, text] = subtitleFilePairs[i];
        movie.subtitlePackages.push({ provider, author, origin, source: { type, sourceUrl, zipFileName, subtitleFileName }, text });
      }
    }

    return { success: true, data: movie, logs };
  }

  private async extractZip(arrayBuffer: ArrayBuffer): Promise<ExtractZipResponse> {
    const data: Record<string, string> = {};
    try {
      const zip = new AdmZip(Buffer.from(arrayBuffer));
      const entries = zip.getEntries();
      for (let i = 0; i < entries.length; i++) {
        const entry = entries[i];
        data[entry.entryName] = entry.getData().toString();
      }

      return { success: true, data, message: null };
    } catch (error) {
      const message = `Extract zip failed: ${get(error, 'message', '<unknown>')}`;
      return { success: false, data: null, message };
    }
  }
}
