import { compact, isNil, map } from 'lodash-es';
import type * as T from './OpenSubtitlesMapper.types';

export class OpenSubtitlesMapper implements T.OpenSubtitlesMapper {
  public constructor() {}

  public toMoviePage(moviePage: T.OsApiSubtitlesPage): T.OsMappedMoviePage {
    const movie = map(moviePage.data, (d) => this.toMovie(d));
    return { totalPages: moviePage.total_pages, movie: compact(movie) };
  }

  private toMovie(movie: T.OsApiMovie): T.OsMappedMovie | null {
    if (movie.type !== 'subtitle' || movie.attributes.language !== 'en') return null;

    return {
      title: movie.attributes.feature_details.title ?? null,
      releaseYear: movie.attributes.feature_details.year ?? null,
      posterUrl: this.getPosterLink(movie.attributes.related_links),
      author: movie.attributes.uploader.name ?? null,
      files: map(movie.attributes.files, (f) => ({ id: f.file_id, name: f.file_name })),
    };
  }

  private getPosterLink(relatedLinks: T.OsApiRelatedLink[]) {
    for (let j = 0; j < relatedLinks.length; j++) {
      const relatedLink = relatedLinks[j];
      if (!isNil(relatedLink.img_url)) return relatedLink.img_url;
    }

    return null;
  }
}
