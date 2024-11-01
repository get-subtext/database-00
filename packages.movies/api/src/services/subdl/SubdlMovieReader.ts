import AdmZip from 'adm-zip';
import { cloneDeep, get, toPairs } from 'lodash-es';
import path from 'path';
import { OriginEnum, SourceTypeEnum } from '../common/Movie.types';
import type * as T from '../movieApi/MovieApi.types';
import { defaultMovie } from '../utils/defaultMovie';
import type { SubdlApi } from './SubdlApi';

export class SubdlMovieReader implements T.MovieReader {
  public constructor(
    private readonly subdlZipUrlBase: string,
    private readonly subdlApi: SubdlApi
  ) {}

  public async read(imdbId: string): Promise<T.ReadOutput> {
    const getMovieInfoRes = await this.subdlApi.getMovieInfo(imdbId);
    if (getMovieInfoRes.success) {
      const output: T.ReadOutput = { success: true, data: defaultMovie(), logs: [] };
      const data = getMovieInfoRes.data;

      // Assuming results is an array for TV episodes?
      // Let's iterate and get the data, with first element taking priority.
      for (let i = 0; i < data.results.length; i++) {
        const result = data.results[i];
        output.data.title = output.data.title === 'Unknown' ? result.name : 'Unknown';
        output.data.releaseDate = output.data.releaseDate ?? result.release_date ?? null;
        output.data.releaseYear = output.data.releaseYear ?? result.year ?? null;
      }

      for (let i = 0; i < data.subtitles.length; i++) {
        const subtitle = data.subtitles[i];

        const getZipFileRes = await this.subdlApi.getZipFile(subtitle.url);

        const sourceUrl = `${this.subdlZipUrlBase}${subtitle.url}`;
        if (getZipFileRes.success) {
          const extractZipRes = await this.extractZip(getZipFileRes.data);
          if (extractZipRes.success) {
            console.log(extractZipRes.data);
            const subtitleFilePairs = toPairs(extractZipRes.data);
            const zipFileName = path.basename(subtitle.url);
            for (let i = 0; i < subtitleFilePairs.length; i++) {
              const [subtitleFileName, text] = subtitleFilePairs[i];
              output.data.subtitlePackages.push({
                provider: 'Subdl',
                author: subtitle.author ?? null,
                origin: OriginEnum.Api,
                source: { type: SourceTypeEnum.ZipFile, sourceUrl, zipFileName, subtitleFileName },
                text,
              });
            }

            // Simulate a fetch log when the zip extract fails
            const log = cloneDeep(getZipFileRes.log);
            log.output.body = extractZipRes.data;
            output.logs.push(log);
          } else {
            // Simulate a fetch log when the zip extract fails
            const log = cloneDeep(getZipFileRes.log);
            log.output.status = 0;
            log.output.body = extractZipRes.message;
            output.logs.push(log);
          }
        } else {
          output.logs.push(getZipFileRes.log);
        }
      }

      return output;
    } else {
      return { success: false, data: null, logs: [getMovieInfoRes.log] };
    }
  }

  private async extractZip(arrayBuffer: ArrayBuffer): Promise<T.ExtractZipOutput> {
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
      const message = `[Extract zip failed] ${get(error, 'message', '<unknown>')}`;
      return { success: false, data, message };
    }
  }
}
