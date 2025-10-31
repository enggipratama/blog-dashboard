import { atom } from "jotai";

export interface LocalPost {
  id: number;
  title: string;
  body: string;
  createdAt: string;
}

export const postsAtom = atom<LocalPost[]>([]);
