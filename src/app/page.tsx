"use client";

import { Divider, Image, Typography } from "antd";
import { useMediaQuery } from "react-responsive";

export default function Home() {
  //{ params }: { params: { locale: string } }
  // const { t } = await initTranslations("en", ["main"]);

  const isMobile = useMediaQuery({ maxWidth: 768 });

  return (
    <Typography>
      <Typography.Title level={2}>How to learn German?</Typography.Title>
      <Typography.Paragraph style={isMobile ? { fontSize: "18px" } : {}}>
        The beginning of language learning is boring, and learning makes way
        more fun when you already can ready and watch materials in the new
        language, without distracting yourself on translation. We are selecting
        useful and interesting texts, songs and letting you to avoid this
        annoying initial threshold
      </Typography.Paragraph>
      <Divider />
      <Typography.Title level={2}>Tutorial</Typography.Title>
      <Typography.Title level={5}>1) Select the text</Typography.Title>
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
      <Typography.Title level={5}>
        2) Select your own lang for translations
      </Typography.Title>
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
      <Typography.Title level={5}>
        3) Add Unknown words to dictionary
      </Typography.Title>
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
      <Typography.Title level={5}>4) Learn unknown words</Typography.Title>
      <Typography.Paragraph style={isMobile ? { fontSize: "18px" } : {}}>
        On the dictionary page you can view all the words you added to the
        dictionary, to learn the words we recommend you to:
        <ul>
          <li>
            Download the words from dictionary as a pdf, print and make a paper
            cards
          </li>
          <li>
            Download the words form dictionary as a CSV file and import it to
            AnkiDroid (app for flash cards)
          </li>
        </ul>
      </Typography.Paragraph>
      <Typography.Title level={5}>5) Continue learning</Typography.Title>
      <Divider />
      <Typography.Paragraph style={isMobile ? { fontSize: "18px" } : {}}>
        Give feedback or propose your idea or text!
      </Typography.Paragraph>
      <Divider />
      <Typography.Paragraph style={isMobile ? { fontSize: "18px" } : {}}>
        Support us
      </Typography.Paragraph>
    </Typography>
  );
}
