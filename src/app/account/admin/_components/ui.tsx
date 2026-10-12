export const card = "rounded-2xl bg-white p-5 shadow-[0_1px_2px_rgba(0,0,0,0.04)]";
export const input = "h-10 w-full rounded-lg border border-black/15 bg-white px-3 text-sm outline-none focus:border-black";
export const btn = "inline-flex h-10 items-center justify-center rounded-lg bg-black px-4 text-sm font-bold text-brand-yellow disabled:opacity-50";
export const btnGhost = "inline-flex h-10 items-center justify-center rounded-lg border border-black/15 bg-white px-4 text-sm font-semibold disabled:opacity-50";

const TONES: Record<string, string> = {
  pending: "bg-amber-100 text-amber-800",
  paid: "bg-blue-100 text-blue-800",
  shipped: "bg-violet-100 text-violet-800",
  delivered: "bg-green-100 text-green-800",
  failed: "bg-red-100 text-red-800",
  cancelled: "bg-black/10 text-black/60",
};

export function StatusPill({ status }: { status: string }) {
  return <span className={`rounded-full px-2.5 py-0.5 text-xs font-bold capitalize ${TONES[status] ?? TONES.cancelled}`}>{status}</span>;
}

export function PageTitle({ children, action }: { children: React.ReactNode; action?: React.ReactNode }) {
  return (
    <div className="mb-6 flex flex-wrap items-center justify-between gap-3">
      <h1 className="font-heading text-2xl font-bold tracking-[-0.5px] md:text-3xl">{children}</h1>
      {action}
    </div>
  );
}

export const when = (d: string) => new Date(d).toLocaleString("en-IN", { dateStyle: "medium", timeStyle: "short" });
