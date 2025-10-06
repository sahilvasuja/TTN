const redis = require("redis");


const client = redis.createClient({
  url: `redis://${process.env.REDIS_HOST || "127.0.0.1"}:${process.env.REDIS_PORT || 6379}`
});
client.on("error", (err) => console.error("Redis Client Error", err));
// client.connect();

(async () => {
  await client.connect();
  console.log("Redis connected");
})();
module.exports = client;
