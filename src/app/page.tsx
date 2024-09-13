"use client";

import { Carousel, Divider, Image, Typography } from "antd";
import { useTranslation } from "react-i18next";
import { useMediaQuery } from "react-responsive";

export default function Home() {
  const isMobile = useMediaQuery({ maxWidth: 768 });
  const { t } = useTranslation(["home"]);

  return (
    <>
      <Typography>
        <Typography.Title level={2}>{t("home-title")}</Typography.Title>
        <Typography.Paragraph style={isMobile ? { fontSize: "18px" } : {}}>
          {t("home-description")}
        </Typography.Paragraph>
        <Divider />
        <Typography.Title level={2}>{t("tutorial")}</Typography.Title>
        <Typography.Title level={5}>1) {t("tutorial-1")}</Typography.Title>
        <div
          className={`flex ${
            isMobile ? "justify-center" : "ml-2 justify-start"
          } items-center`}
        >
          <Image
            width={isMobile ? undefined : "500px"}
            src="/tutorial/1.png"
          ></Image>
        </div>
        <Typography.Title level={5}>2) {t("tutorial-2")}</Typography.Title>
        <div
          className={`flex ${
            isMobile ? "justify-center" : " ml-2 justify-start"
          } items-center`}
        >
          <Image
            width={isMobile ? undefined : "500px"}
            src="/tutorial/2.png"
          ></Image>
        </div>
        <Typography.Title level={5}>3) {t("tutorial-3")}</Typography.Title>
        <div
          className={`flex ${
            isMobile ? "justify-center" : " ml-2 justify-start"
          } items-center`}
        >
          <Image
            width={isMobile ? undefined : "500px"}
            src="/tutorial/3.png"
          ></Image>
        </div>
        <Typography.Title level={5}>4) {t("tutorial-4")}</Typography.Title>
        <Typography.Paragraph style={isMobile ? { fontSize: "18px" } : {}}>
          {t("tutorial-4-1")}
          <ul>
            <li>{t("tutorial-4-2")}</li>
            <li>{t("tutorial-4-3")}</li>
          </ul>
        </Typography.Paragraph>
        <Typography.Title level={5}>5) {t("tutorial-5")}</Typography.Title>
        <Divider />
        <Typography.Paragraph style={isMobile ? { fontSize: "18px" } : {}}>
          {t("feedback")}
        </Typography.Paragraph>
        <Divider />
        <Typography.Paragraph style={isMobile ? { fontSize: "18px" } : {}}>
          {t("support-us")}
        </Typography.Paragraph>
      </Typography>
    </>
  );
}
