import murmurhash from 'murmurhash';

export const generateHashFromText = (text: string): string => {
  const hash = murmurhash.v3(text);
  return hash.toString(16);
  // const hash = createHash('sha256');
  // hash.update(fileContent);
  // return hash.digest('hex');
};
