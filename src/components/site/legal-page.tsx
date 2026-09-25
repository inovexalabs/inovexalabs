import { PageHeader } from "@/components/site/page-header";
import { Section } from "@/components/site/section";
import { Markdown } from "@/components/content/markdown";
import { getLegalDoc } from "@/lib/queries/legal";
import { formatDate } from "@/lib/utils";

export async function LegalPage({ docKey }: { docKey: "privacy" | "terms" | "cookies" }) {
  const doc = await getLegalDoc(docKey);

  return (
    <>
      <PageHeader
        trail={[
          { name: "Home", path: "/" },
          { name: doc.title, path: `/${docKey}` },
        ]}
        eyebrow="Legal"
        title={doc.title}
        lede="Written to describe how this site and this company actually behave, in plain language."
        meta={
          <span className="mono-label text-ash-deep">
            Last reviewed {formatDate(doc.updated)}
          </span>
        }
      />

      <Section>
        <div className="max-w-3xl">
          <Markdown content={doc.body} />
        </div>
      </Section>
    </>
  );
}
