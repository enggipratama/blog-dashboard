"use client";
import { useAtom } from "jotai";
import { themeAtom } from "@/store/themeAtom";
import { ThemeProvider, createTheme, CssBaseline } from "@mui/material";
import GlobalBottomNav from "@/components/GlobalBottomNav";

export default function RootLayout({ children }: { children: React.ReactNode }) {
  const [theme] = useAtom(themeAtom);
  const muiTheme = createTheme({ palette: { mode: theme } });

  return (
    <html lang="en">
      <body>
        <ThemeProvider theme={muiTheme}>
          <CssBaseline />
          {children}
          <GlobalBottomNav />
        </ThemeProvider>
      </body>
    </html>
  );
}
