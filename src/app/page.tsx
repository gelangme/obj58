import initTranslations from "../i18n";

export default async function Home({ params }: { params: { locale: string } }) {
  const { t } = await initTranslations(params.locale, ["main"]);

  return <h1>{t("home")}</h1>;
}
