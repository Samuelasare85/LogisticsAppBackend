const { createClient } = require('redis');
const { promisify } = require('util');
/* eslint-disable no-undef */ 
const redisClient = createClient({
    legacyMode: true,
    url: process.env.REDIS_URL,
  });
  /* eslint-enable no-undef */

redisClient.connect().catch();
const getAsync = promisify(redisClient.get).bind(redisClient);
const setAsync = promisify(redisClient.set).bind(redisClient);
const delAsync = promisify(redisClient.del).bind(redisClient);

const getRedisData = async (cacheKey) => {
  const redisData = await getAsync(cacheKey);
  if (redisData) return JSON.parse(redisData);
};
const setRedisData = async (cacheKey, value) => {
  await setAsync(cacheKey, JSON.stringify(value));
};
const deleteRedisData = async (cacheKey) => {
  await delAsync(cacheKey);
};

module.exports = { getRedisData, setRedisData, deleteRedisData };