export const card = "rounded-3xl border-2 border-ink bg-white p-5";
export const input = "field h-10 text-sm";
export const btn = "btn h-10 px-4 text-sm";
export const btnGhost = "inline-flex h-10 items-center justify-center rounded-full border-2 border-ink bg-white px-4 text-sm font-bold disabled:opacity-50";

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
      <h1 className="font-display text-4xl leading-none md:text-5xl">{children}</h1>
      {action}
    </div>
  );
}

export const when = (d: string) => new Date(d).toLocaleString("en-IN", { dateStyle: "medium", timeStyle: "short" });
