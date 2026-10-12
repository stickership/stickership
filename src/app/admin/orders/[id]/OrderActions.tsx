"use client";

import { useRouter } from "next/navigation";
import { useState, useTransition } from "react";
import { updateOrderStatus } from "../../actions";
import { btn, btnGhost, card, input } from "../../_components/ui";

const COURIERS = ["Delhivery", "India Post", "Shiprocket", "Blue Dart", "DTDC", "Ekart", "Xpressbees"];

export function OrderActions({ id, status, courier, trackingNo }: { id: string; status: string; courier: string | null; trackingNo: string | null }) {
  const router = useRouter();
  const [c, setC] = useState(courier ?? "");
  const [t, setT] = useState(trackingNo ?? "");
  const [error, setError] = useState("");
  const [pending, start] = useTransition();

  const go = (next: "shipped" | "delivered" | "cancelled", confirmText?: string) => {
    if (confirmText && !confirm(confirmText)) return;
    start(async () => {
      const res = await updateOrderStatus({ id, status: next, courier: c, tracking_no: t });
      if (!res.ok) return setError(res.error);
      setError("");
      router.refresh();
    });
  };

  return (
    <section className={card}>
      <h2 className="mb-3 font-heading text-lg font-bold">Fulfilment</h2>
      {status === "paid" && (
        <div className="flex flex-col gap-3">
          <div className="grid gap-3 md:grid-cols-2">
            <input list="couriers" value={c} onChange={(e) => setC(e.target.value)} placeholder="Courier" className={input} />
            <datalist id="couriers">
              {COURIERS.map((x) => (
                <option key={x} value={x} />
              ))}
            </datalist>
            <input value={t} onChange={(e) => setT(e.target.value)} placeholder="Tracking number" className={input} />
          </div>
          <div className="flex gap-2">
            <button disabled={pending} onClick={() => go("shipped")} className={btn}>
              Mark shipped
            </button>
            <button disabled={pending} onClick={() => go("cancelled", "Cancel this paid order? Refund the customer in Cashfree separately.")} className={`${btnGhost} text-red-600`}>
              Cancel order
            </button>
          </div>
        </div>
      )}
      {status === "shipped" && (
        <div className="flex flex-col gap-3 text-sm">
          <p>
            Shipped via <b>{courier}</b> · tracking <b className="font-mono">{trackingNo}</b>
          </p>
          <button disabled={pending} onClick={() => go("delivered")} className={`${btn} w-fit`}>
            Mark delivered
          </button>
        </div>
      )}
      {status === "pending" && (
        <div className="flex flex-col gap-3 text-sm">
          <p className="text-black/60">Waiting for payment. Cancel if the customer abandoned checkout.</p>
          <button disabled={pending} onClick={() => go("cancelled", "Cancel this unpaid order?")} className={`${btnGhost} w-fit text-red-600`}>
            Cancel order
          </button>
        </div>
      )}
      {["delivered", "failed", "cancelled"].includes(status) && <p className="text-sm text-black/60">No further actions.</p>}
      {error && <p className="mt-3 rounded-lg bg-red-50 px-3 py-2 text-sm text-red-700">{error}</p>}
    </section>
  );
}
