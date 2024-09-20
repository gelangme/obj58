// atoms.ts
import { User } from "@/common/types";
import { atom } from "jotai";
import { atomWithStorage } from "jotai/utils";

export const translationLocaleAtom = atomWithStorage<"en" | "uk" | "default">(
  "translationLocale",
  "default"
);

export const interfaceLocaleAtom = atomWithStorage<"en" | "uk" | "de">(
  "interfaceLocale",
  "en"
);

export const isDarkModeAtom = atomWithStorage<boolean>("isDarkMode", false);

export const isLoggedInAtom = atom(false);

export const userAtom = atom<undefined | User>(undefined);
