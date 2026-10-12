import { defineCloudflareConfig } from "@opennextjs/cloudflare";

// ponytail: in-memory incremental cache per isolate; add r2IncrementalCache + R2 bucket if cache misses get costly
export default defineCloudflareConfig();
