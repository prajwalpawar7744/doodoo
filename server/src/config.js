module.exports = {
  PORT: Number(process.env.PORT) || 4000,
  CORS_ORIGIN: process.env.CORS_ORIGIN || 'http://localhost:3000',
  MIN_NAME_LEN: 1,
  MAX_NAME_LEN: 20,
};
