"use client";
import { IconButton } from "@mui/material";
import Light from "@mui/icons-material/LightMode";
import Dark from "@mui/icons-material/Nightlight";
import { useAtom } from "jotai";
import { themeAtom } from "@/store/themeAtom";

export default function GlobalThemeToggle() {
  const [theme, setTheme] = useAtom(themeAtom);

  const toggleTheme = () => {
    const newTheme = theme === "light" ? "dark" : "light";
    setTheme(newTheme);
    if (typeof window !== "undefined") {
      localStorage.setItem("theme", newTheme);
    }
  };

  return (
    <IconButton onClick={toggleTheme} color="inherit">
      {theme === "light" ? <Dark /> : <Light />}
    </IconButton>
  );
}
