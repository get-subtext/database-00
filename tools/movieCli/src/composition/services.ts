import { last, split } from 'lodash-es';
import { rootDir } from '../rootDir';
import { Handler } from '../services/Handler';
import { Logger } from '../services/Logger';
import { getPkgMeta } from '../utils/getPkgMeta';

const pkgMeta = getPkgMeta(rootDir);
const logPrefix = last(split(pkgMeta.name, '/'));

export const createHandler = (verbose: boolean) => {
  const logger = new Logger(logPrefix!, verbose);
  return new Handler(logger);
};
