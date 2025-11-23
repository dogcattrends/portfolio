type StructuredDataProps = {
  data: Record<string, unknown>;
  id?: string;
};

export function StructuredData({ data, id }: StructuredDataProps): JSX.Element {
  return (
    <script
      id={id}
      type="application/ld+json"
      suppressHydrationWarning
      dangerouslySetInnerHTML={{ __html: JSON.stringify(data) }}
    />
  );
}
