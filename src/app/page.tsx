"use client"
import MainText from "@/components/MainText";
import Image from "next/image";

import text from "@/data/steuernummer.json" with { type: "json" };
import { useEffect } from "react";


export default function Home() {

  useEffect(() => {
    console.log(text)
  }, [])
  return (
      <h1>Home</h1>
  );
}
