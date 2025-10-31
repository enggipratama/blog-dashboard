"use client";
import { BottomNavigation, BottomNavigationAction } from "@mui/material";
import HomeIcon from "@mui/icons-material/Home";
import FavoriteIcon from "@mui/icons-material/Favorite";
import { useRouter, usePathname } from "next/navigation";

export default function GlobalBottomNav() {
  const router = useRouter();
  const pathname = usePathname();

  const getNavValueFromPath = (path: string) => {
    if (path === "/") return 0;
    if (path.startsWith("/local/posts")) return 1;
    if (path === "/nearby") return 2;
    return 0;
  };

  const navValue = getNavValueFromPath(pathname);

  const handleChange = (event: React.SyntheticEvent, newValue: number) => {
    switch (newValue) {
      case 0:
        router.push("/");
        break;
      case 1:
        if (pathname === "/local/posts") {
          router.push("/local/posts/new");
        } else {
          router.push("/local/posts");
        }
        break;
    }
  };

  return (
    <BottomNavigation
      sx={{
        position: "fixed",
        bottom: 0,
        left: 0,
        right: 0,
        borderTop: "1px solid",
        borderColor: "divider",
        bgcolor: "background.paper",
        zIndex: 1200,
      }}
      showLabels
      value={navValue}
      onChange={handleChange}
    >
      <BottomNavigationAction label="Home" icon={<HomeIcon />} />
      <BottomNavigationAction label="Posts" icon={<FavoriteIcon />} />
    </BottomNavigation>
  );
}
