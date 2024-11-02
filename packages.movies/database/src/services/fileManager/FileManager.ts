import type * as T from './FileManager.types';

export class FileManager implements T.FileManager {
  public constructor(private readonly dir: string) {}
}
