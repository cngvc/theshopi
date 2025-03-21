import crypto from 'crypto';

export const generateRandomCharacters = async (size = 20) => {
  const randomBytes = await Promise.resolve(crypto.randomBytes(size));
  const randomCharacters = randomBytes.toString('hex');
  return randomCharacters;
};

export const generateKeyPair = () => {
  const { publicKey, privateKey } = crypto.generateKeyPairSync('rsa', {
    modulusLength: 2048,
    publicKeyEncoding: { type: 'pkcs1', format: 'pem' },
    privateKeyEncoding: { type: 'pkcs8', format: 'pem' }
  });
  return {
    publicKey,
    privateKey
  };
};
