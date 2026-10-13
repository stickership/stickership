import { notFound } from "next/navigation";
import { Shell } from "@/components/Shell";
import { pages, type Block } from "@/data/pages";
import { JsonLd } from "@/components/JsonLd";

export const generateStaticParams = () => Object.keys(pages).map((slug) => ({ slug }));

export async function generateMetadata({ params }: PageProps<"/pages/[slug]">) {
  const page = pages[(await params).slug];
  const slug = (await params).slug;
  return {
    title: page?.title ?? "Page",
    description: page?.body[0]?.slice(0, 160),
    alternates: { canonical: `/pages/${slug}` },
  };
}

const EMAIL = /([\w.+-]+@[\w-]+(?:\.[\w-]+)+)/;

function Text({ children }: { children: string }) {
  return children.split(EMAIL).map((part, i) =>
    i % 2 ? (
      <a key={i} href={`mailto:${part}`} className="font-semibold text-ink underline">
        {part}
      </a>
    ) : (
      part
    ),
  );
}

function Blocks({ blocks }: { blocks: Block[] }) {
  return blocks.map((b, i) =>
    typeof b === "string" ? (
      <p key={i}>
        <Text>{b}</Text>
      </p>
    ) : (
      <ul key={i} className="flex list-disc flex-col gap-2 pl-6 marker:text-ink/40">
        {b.map((li) => (
          <li key={li}>
            <Text>{li}</Text>
          </li>
        ))}
      </ul>
    ),
  );
}

async function Content({ params }: PageProps<"/pages/[slug]">) {
  const { slug } = await params;
  const page = pages[slug];
  if (!page) notFound();
  const faq = slug === "faq" ? page.body.map((p) => [p.slice(0, p.indexOf("?") + 1), p.slice(p.indexOf("?") + 1).trim()]) : null;
  return (
    <article className="mx-auto max-w-[720px] py-16">
      <h1 className="font-display text-5xl leading-none">{page.title}</h1>
      {faq ? (
        <>
          <JsonLd
            data={{
              "@context": "https://schema.org",
              "@type": "FAQPage",
              mainEntity: faq.map(([q, a]) => ({ "@type": "Question", name: q, acceptedAnswer: { "@type": "Answer", text: a } })),
            }}
          />
          <div className="mt-8 flex flex-col gap-3">
            {faq.map(([q, a]) => (
              <section key={q} className="card p-5">
                <h2 className="text-lg font-bold">{q}</h2>
                <p className="mt-2 leading-relaxed text-ink/80">{a}</p>
              </section>
            ))}
          </div>
        </>
      ) : (
        <div className="mt-6 flex flex-col gap-4 text-[17px] leading-[1.7] text-ink/80">
          {page.updated && <p className="font-mono text-sm text-ink/50">Last updated: {page.updated}</p>}
          <Blocks blocks={page.body} />
          {page.sections?.map((s) => (
            <section key={s.heading} className="mt-4 flex flex-col gap-3">
              <h2 className="text-2xl font-bold text-ink">{s.heading}</h2>
              <Blocks blocks={s.body} />
            </section>
          ))}
        </div>
      )}
    </article>
  );
}

export default function Page(props: PageProps<"/pages/[slug]">) {
  return (
    <Shell>
      <Content {...props} />
    </Shell>
  );
}
