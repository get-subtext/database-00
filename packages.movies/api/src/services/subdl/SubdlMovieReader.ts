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

    const output: T.ReadMovieResponse = { success: true, data: defaultMovie(), logs: [] };
    const { title, releaseDate, releaseYear, subtitles } = this.subdlMapper.toSubtitlePackage(getMovieInfoRes.data);

    output.data.title = title;
    output.data.releaseDate = releaseDate;
    output.data.releaseYear = releaseYear;

    for (let i = 0; i < subtitles.length; i++) {
      const { baseUrl, author } = subtitles[i];

      const getZipFileRes = await this.subdlApi.downloadZipFile(baseUrl);
      if (!getZipFileRes.success) {
        output.logs.push(getZipFileRes.log);
        continue;
      }

      const extractZipRes = await this.extractZip(getZipFileRes.data);

      // Update fetch log based on result of zip extract
      const log = cloneDeep(getZipFileRes.log);
      log.output.status = extractZipRes.success ? log.output.status : 0;
      log.output.body = extractZipRes.success ? extractZipRes.data : extractZipRes.message;
      output.logs.push(log);

      if (!extractZipRes.success) continue;

      const sourceUrl = `${this.subdlZipUrlBase}${baseUrl}`;
      const subtitleFilePairs = toPairs(extractZipRes.data);
      const zipFileName = path.basename(baseUrl);
      for (let i = 0; i < subtitleFilePairs.length; i++) {
        const [subtitleFileName, text] = subtitleFilePairs[i];
        output.data.subtitlePackages.push({ provider, author, origin, source: { type, sourceUrl, zipFileName, subtitleFileName }, text });
      }
    }

    return output;
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
