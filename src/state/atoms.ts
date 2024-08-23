// atoms.ts
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
