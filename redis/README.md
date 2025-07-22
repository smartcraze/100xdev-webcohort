# 🔥 Redis Project Ideas

A curated list of beginner to advanced project ideas using Redis.

---

## 🟢 Beginner Projects

### 1. 🔐 OTP Auth System
- Store OTPs with expiry using `SET key value EX 60`
- Verify user login with time-limited OTPs
- Redis Features: `SET`, `GET`, `EXPIRE`

### 2. 📊 Page View Counter
- Count visits on different pages or posts
- Redis Features: `INCR`, `GET`

### 3. 📃 Simple Todo App
- Store todos in a `List` or `Hash`
- CRUD operations using Redis CLI or web UI
- Redis Features: `RPUSH`, `LPOP`, `HSET`, `HGETALL`

---

## 🟡 Intermediate Projects

### 4. 🎯 Leaderboard App
- Track user scores using `Sorted Sets`
- Show top N players
- Redis Features: `ZADD`, `ZRANGE`, `ZREVRANGE`

### 5. 💬 Pub/Sub Chat App
- Real-time messaging with Redis Pub/Sub
- Create public or private channels
- Redis Features: `PUBLISH`, `SUBSCRIBE`

### 6. 🕒 Rate Limiter for API
- Limit requests per user/IP per minute
- Return 429 if limit exceeded
- Redis Features: `INCR`, `EXPIRE`, `TTL`

### 7. 📥 Background Job Queue
- Queue tasks using `RPUSH`, `LPOP`
- Workers consume tasks and process them
- Redis Features: `LISTS`, `BLPOP`
    
---

## 🔴 Advanced Projects

### 8. 🔃 Reliable Event Processor with Streams
- Use Redis Streams as a durable message queue
- Track progress with consumer groups
- Redis Features: `XADD`, `XREAD`, `XGROUP`, `XACK`

### 9. 🛡️ Real-Time Session Manager
- Store and track user sessions with TTL
- Auto-expire inactive sessions
- Redis Features: `SET`, `EXPIRE`, `KEYS`, `DEL`

### 10. 📡 Notification System
- Publish events to users via Pub/Sub
- Optionally persist via Redis Streams
- Redis Features: `PUBLISH`, `XADD`, `XREAD`

---

## 🔧 Bonus Utilities

- 🔎 Key Explorer CLI Tool
- 📈 Redis Stats Dashboard (show memory usage, keys, etc.)
- 🧪 Redis Playground (test TTL, expiration, etc.)

---

## 💡 Tech Stack Suggestions
- Language: Node.js / Bun / Python / Go
- Frontend (optional): React / Next.js
- Redis GUI (optional): [RedisInsight](https://redis.com/redis-enterprise/redis-insight/)

---

> 👨‍🔬 Tip: Combine multiple Redis data types in one project for deeper learning!
