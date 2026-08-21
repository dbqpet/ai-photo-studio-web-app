import { buildHomePageSchemas } from "@/lib/seo/schema";

export default function StudioLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  const schemas = buildHomePageSchemas();

  return (
    <>
      {schemas.map((schema, index) => (
        <script
          key={`${String(schema["@type"])}-${index}`}
          type="application/ld+json"
          dangerouslySetInnerHTML={{ __html: JSON.stringify(schema) }}
        />
      ))}
      {children}
    </>
  );
}
