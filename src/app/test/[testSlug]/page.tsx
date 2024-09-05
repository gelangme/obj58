export async function generateStaticParams() {
  return [{ testSlug: "1" }];
}

export default async function FilePage({
  params,
}: {
  params: { testSlug: string };
}) {
  return <div>{params.testSlug}</div>;
}
