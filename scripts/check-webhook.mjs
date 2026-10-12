import { createHmac } from "node:crypto";
import assert from "node:assert/strict";
import { register } from "node:module";

register("data:text/javascript,export async function resolve(s,c,n){return s==='server-only'?{url:'data:text/javascript,',shortCircuit:true}:n(s,c)}");
const { verifyWebhook } = await import("../src/lib/cashfree.ts");

const secret = "test-secret";
const body = JSON.stringify({ data: { order: { order_id: "abc" } } });
const ts = String(Date.now());
const sig = createHmac("sha256", secret).update(ts + body).digest("base64");

assert.equal(verifyWebhook(body, ts, sig, secret), true, "valid signature accepted");
assert.equal(verifyWebhook(body + " ", ts, sig, secret), false, "tampered body rejected");
assert.equal(verifyWebhook(body, String(Number(ts) + 1), sig, secret), false, "tampered timestamp rejected");
assert.equal(verifyWebhook(body, String(Date.now() - 10 * 60_000), sig, secret), false, "stale timestamp rejected");
assert.equal(verifyWebhook(body, null, sig, secret), false, "missing header rejected");
console.log("webhook signature checks passed");
