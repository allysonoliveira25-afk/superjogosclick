import { notFound } from "next/navigation";
import { getPageBySlug } from "@/lib/pages";

export default async function CustomPageRoute({
  params,
}: {
  params: Promise<{ slug: string }>;
}) {
  const { slug } = await params;
  const page = await getPageBySlug(slug).catch(() => null);
  if (!page) notFound();

  const paragraphs = page.content.split(/\n{2,}/).map((p) => p.trim()).filter(Boolean);

  return (
    <div className="mx-auto max-w-2xl px-3 py-8 sm:px-5">
      <div className="rounded-3xl bg-surface p-7 shadow">
        <h1 className="font-heading text-2xl font-extrabold text-brand-dark">{page.title}</h1>
        <div className="mt-4 flex flex-col gap-3 text-sm leading-relaxed text-foreground/85">
          {paragraphs.map((p, i) => (
            <p key={i} className="whitespace-pre-line">
              {p}
            </p>
          ))}
        </div>
      </div>
    </div>
  );
}
