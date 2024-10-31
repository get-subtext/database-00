import type { Movie } from './Common.types';
import { OriginEnum, SourceTypeEnum } from './Common.types';
import type { MovieReader } from './MovieApi.types';

export class MovieReaderImpl implements MovieReader {
  public async read(imdbId: string) {
    // From https://www.omdbapi.com/?i=tt0062622&apikey=<API_KEY>
    const movie: Movie = {
      imdbId: 'tt0062622',
      sourceUrls: ['https://www.omdbapi.com/?i=tt0062622&apikey=<API_KEY>', 'https://some/subtitle/file.srt'],
      title: '2001: A Space Odyssey',
      posterUrl: 'https://m.media-amazon.com/images/M/MV5BNjU0NDFkMTQtZWY5OS00MmZhLTg3Y2QtZmJhMzMzMWYyYjc2XkEyXkFqcGc@._V1_SX300.jpg',
      releaseDate: '1968-05-12T00:00:00.000Z',
      releaseYear: 1968,
      rated: 'G',
      genres: ['Adventure', 'Sci-Fi'],
      directors: ['Stanley Kubrick'],
      writers: ['Stanley Kubrick', 'Arthur C. Clarke'],
      actors: ['Keir Dullea', 'Gary Lockwood', 'William Sylvester'],
      runTimeMins: 149,
      plot: 'When a mysterious artifact is uncovered on the Moon, a spacecraft manned by two humans and one supercomputer is sent to Jupiter to find its origins.',
      subtitlePackages: [
        {
          provider: 'HardCoded',
          author: 'some-author',
          origin: OriginEnum.Manual,
          source: {
            type: SourceTypeEnum.StandaloneFile,
            sourceUrl: 'https://some/subtitle/file.srt',
            subtitleFileName: 'file.srt',
          },
          text: 'Open the pod bay doors, Hal.',
        },
      ],
    };

    return movie;
  }
}
