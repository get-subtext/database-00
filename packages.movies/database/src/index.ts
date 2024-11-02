import { FileManager } from './services/fileManager/FileManager';
import { MovieWriter as MovieWriterImpl } from './services/movieWriter/MovieWriter';
import type { MovieWriter } from './services/movieWriter/MovieWriter.types';

export type { MovieWriter } from './services/movieWriter/MovieWriter.types';

export interface MovieWriterOptions {
  dir: string;
}

export const createMovieWriter = ({ dir }: MovieWriterOptions): MovieWriter => {
  const fileManager = new FileManager(dir);
  return new MovieWriterImpl(fileManager);
};
