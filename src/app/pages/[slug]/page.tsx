import { notFound } from "next/navigation";
import { Shell } from "@/components/Shell";
import { pages } from "@/data/pages";

export const generateStaticParams = () => Object.keys(pages).map((slug) => ({ slug }));

export async function generateMetadata({ params }: PageProps<"/pages/[slug]">) {
  const page = pages[(await params).slug];
  return { title: `${page?.title ?? "Page"} | stickership` };
}

async function Content({ params }: PageProps<"/pages/[slug]">) {
  const page = pages[(await params).slug];
  if (!page) notFound();
  return (
    <>
      <article className="mx-auto max-w-[720px] py-16">
        <h1 className="font-heading text-4xl font-bold tracking-[-1px]">{page.title}</h1>
        <div className="mt-6 flex flex-col gap-4 text-[16px] leading-[1.7] text-black/80">
          {page.body.map((p) => (
            <p key={p}>{p}</p>
          ))}
        </div>
      </article>
    </>
  );
}

export default function Page(props: PageProps<"/pages/[slug]">) {
  return (
    <Shell>
      <Content {...props} />
    </Shell>
  );
}
