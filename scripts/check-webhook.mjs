import { createHmac } from "node:crypto";
import assert from "node:assert/strict";
import { register } from "node:module";

register("data:text/javascript,export async function resolve(s,c,n){return s==='server-only'?{url:'data:text/javascript,',shortCircuit:true}:n(s,c)}");
const { verifyWebhook, verifyPayment } = await import("../src/lib/razorpay.ts");

const secret = "test-secret";
const body = JSON.stringify({ event: "payment.captured" });
const sig = createHmac("sha256", secret).update(body).digest("hex");
assert.equal(verifyWebhook(body, sig, secret), true, "valid webhook accepted");
assert.equal(verifyWebhook(body + " ", sig, secret), false, "tampered webhook rejected");
assert.equal(verifyWebhook(body, null, secret), false, "missing signature rejected");

const pay = createHmac("sha256", secret).update("order_1|pay_1").digest("hex");
assert.equal(verifyPayment("order_1", "pay_1", pay, secret), true, "valid checkout signature accepted");
assert.equal(verifyPayment("order_2", "pay_1", pay, secret), false, "swapped order rejected");
console.log("razorpay signature checks passed");
