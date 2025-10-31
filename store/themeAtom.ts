import { atom } from "jotai";

export const themeAtom = atom<"light" | "dark">("light");

themeAtom.onMount = (set) => {
  if (typeof window !== "undefined") {
    const saved = localStorage.getItem("theme");
    if (saved === "dark" || saved === "light") {
      set(saved);
    }
  }
};
