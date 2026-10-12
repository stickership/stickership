import { requireAdmin } from "@/lib/admin";

const cell = (v: string) => `"${v.replace(/"/g, '""').replace(/^[=+\-@]/, "'$&")}"`;

export async function GET() {
  const { supabase } = await requireAdmin();
  const rows: string[] = ["email,subscribed_at"];
  for (let from = 0; ; from += 1000) {
    const { data, error } = await supabase.from("subscribers").select("email, created_at").order("created_at").range(from, from + 999);
    if (error) return new Response("export failed", { status: 500 });
    rows.push(...data.map((s) => `${cell(s.email)},${s.created_at}`));
    if (data.length < 1000) break;
  }
  return new Response(rows.join("\n"), {
    headers: {
      "content-type": "text/csv; charset=utf-8",
      "content-disposition": `attachment; filename="stickership-subscribers-${new Date().toISOString().slice(0, 10)}.csv"`,
    },
  });
}
