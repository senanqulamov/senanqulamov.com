export type ExperimentKey = "sql" | "race" | "rate" | "hash" | "cache" | "gh";

export const experiments: { key: ExperimentKey; title: string; text: string; inProduction: string }[] = [
  {
    key: "sql",
    title: "SQL playground",
    text: "A real SQLite database running in your browser, filled with a BidBary-style auction dataset. Write queries, read the plan, chart the result.",
    inProduction: "PostgreSQL with partial indexes on live lots, read replicas for analytics.",
  },
  {
    key: "race",
    title: "Auction race conditions",
    text: "Eight bidders hit the same lot at once. Switch the locking strategy and watch lost updates appear or disappear.",
    inProduction: "Optimistic locking with a version column, plus a single-writer queue per hot lot.",
  },
  {
    key: "rate",
    title: "Rate limiter lab",
    text: "The same traffic hits three limiters side by side. Change the load, send a burst, compare what gets through.",
    inProduction: "A token bucket in Redis with an atomic Lua script at the API gateway.",
  },
  {
    key: "hash",
    title: "Consistent hashing ring",
    text: "Two hundred keys spread over a ring of servers. Add or remove a server and count how many keys have to move.",
    inProduction: "Virtual nodes for even spread, used for cache sharding and session affinity.",
  },
  {
    key: "cache",
    title: "Cache simulator",
    text: "LRU, LFU and FIFO caches serve the same request stream. Change the traffic pattern and watch the hit ratios split.",
    inProduction: "Redis LRU for sessions, LFU for hot catalogue data, short TTLs for prices.",
  },
  {
    key: "gh",
    title: "Live GitHub data",
    text: "My public repositories, languages and recent activity, fetched live from the GitHub API as you open this.",
    inProduction: "Cached server-side with ETags to stay inside API rate limits.",
  },
];

export type SketchKey = "tungsten" | "grain" | "gravity" | "magnet";

export const sketches: { key: SketchKey; title: string; text: string; hint: string }[] = [
  {
    key: "tungsten",
    title: "Tungsten",
    text: "A light cone that follows you through the dust.",
    hint: "Move to aim the light.",
  },
  {
    key: "grain",
    title: "Grain",
    text: "Generative film noise, scratches and flicker you can tune.",
    hint: "Use the sliders to tune the reel.",
  },
  {
    key: "gravity",
    title: "Gravity bids",
    text: "Every click drops a bid. Watch the pile grow.",
    hint: "Click or tap anywhere to place a bid.",
  },
  {
    key: "magnet",
    title: "Magnetic type",
    text: "Letters made of particles that dodge the cursor.",
    hint: "Move through the letters.",
  },
];
