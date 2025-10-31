"use client";
import { useState } from "react";
import {
  Container,
  Grid,
  Card,
  CardContent,
  Typography,
  Button,
  IconButton,
  Box,
  Select,
  MenuItem,
  FormControl,
  InputLabel,
  SelectChangeEvent,
} from "@mui/material";
import { useRouter } from "next/navigation";
import { Brightness4, Brightness7 } from "@mui/icons-material";
import { useAtom } from "jotai";
import { themeAtom } from "@/store/themeAtom";

interface LocalPost {
  id: number;
  title: string;
  body: string;
  createdAt: string;
}

export default function LocalPostsPage() {
  const router = useRouter();
  const [theme, setTheme] = useAtom(themeAtom);
  const toggleTheme = () => {
    const newTheme = theme === "light" ? "dark" : "light";
    setTheme(newTheme);
    localStorage.setItem("theme", newTheme);
  };

  const [posts] = useState<LocalPost[]>(() => {
    if (typeof window !== "undefined") {
      const savedPosts = localStorage.getItem("localPosts");
      return savedPosts ? JSON.parse(savedPosts) : [];
    }
    return [];
  });

  const [page, setPage] = useState(1);
  const [limit, setLimit] = useState(5);

  const totalPages = Math.ceil(posts.length / limit);
  const paginatedPosts = posts.slice((page - 1) * limit, page * limit);

  const handleLimitChange = (event: SelectChangeEvent<number>) => {
    setLimit(Number(event.target.value));
    setPage(1);
  };

  const handlePrev = () => setPage((prev) => Math.max(prev - 1, 1));
  const handleNext = () => setPage((prev) => Math.min(prev + 1, totalPages));

  return (
    <Container sx={{ mt: 4, mb: 10 }}>
      <Box
        sx={{
          display: "flex",
          justifyContent: "space-between",
          alignItems: "center",
          flexWrap: "wrap",
          mb: 3,
          gap: 1,
        }}
      >
        <Typography
          variant="h4"
          sx={{
            flex: 1,
            textAlign: "center",
            wordBreak: "break-word",
            overflowWrap: "anywhere",
          }}
        >
          Posts
        </Typography>

        <IconButton onClick={toggleTheme} color="inherit">
          {theme === "light" ? <Brightness4 /> : <Brightness7 />}
        </IconButton>
      </Box>

      <Box
        sx={{
          display: "flex",
          justifyContent: "space-between",
          mb: 2,
          flexWrap: "wrap",
          gap: 1,
        }}
      >
        <Button
          variant="contained"
          onClick={() => router.push("/local/posts/new")}
          sx={{ flexShrink: 0 }}
        >
          Add New Post
        </Button>

        <FormControl size="small" sx={{ minWidth: 100 }}>
          <InputLabel id="limit-label">Per Page</InputLabel>
          <Select
            labelId="limit-label"
            value={limit}
            label="Per Page"
            onChange={handleLimitChange}
          >
            <MenuItem value={5}>5</MenuItem>
            <MenuItem value={10}>10</MenuItem>
            <MenuItem value={20}>20</MenuItem>
          </Select>
        </FormControl>
      </Box>

      {paginatedPosts.length > 0 ? (
        <Grid container spacing={2}>
          {paginatedPosts.map((post) => (
            <Grid size={{xs: 12, sm:6}} key={post.id}>
              <Card
                sx={{
                  height: "100%",
                  overflow: "hidden",
                  wordBreak: "break-word",
                  overflowWrap: "anywhere",
                  whiteSpace: "pre-wrap",
                }}
              >
                <CardContent>
                  <Typography
                    variant="h6"
                    sx={{
                      mb: 1,
                      wordBreak: "break-word",
                      overflowWrap: "anywhere",
                    }}
                  >
                    {post.title}
                  </Typography>

                  <Typography
                    variant="subtitle2"
                    sx={{
                      color: "text.secondary",
                      mb: 1,
                      wordBreak: "break-word",
                    }}
                  >
                    Created: {new Date(post.createdAt).toLocaleString()}
                  </Typography>

                  <Typography
                    sx={{
                      wordBreak: "break-word",
                      overflowWrap: "anywhere",
                      whiteSpace: "normal",
                      overflow: "hidden",
                      textOverflow: "ellipsis",
                      display: "-webkit-box",
                      WebkitLineClamp: 3,
                      WebkitBoxOrient: "vertical",
                      mb: 1,
                    }}
                  >
                    {post.body.slice(0, 200)}...
                  </Typography>

                  <Button
                    sx={{ mt: 1 }}
                    size="small"
                    variant="outlined"
                    onClick={() => router.push(`/local/posts/${post.id}`)}
                  >
                    Detail
                  </Button>
                </CardContent>
              </Card>
            </Grid>
          ))}
        </Grid>
      ) : (
        <Typography textAlign="center">No posts are available</Typography>
      )}

      {/* Pagination */}
      {totalPages > 1 && (
        <Box sx={{ display: "flex", justifyContent: "center", mt: 2, gap: 2 }}>
          <Button
            variant="contained"
            onClick={handlePrev}
            disabled={page === 1}
          >
            Prev
          </Button>
          <Typography sx={{ alignSelf: "center" }}>
            Page {page} of {totalPages}
          </Typography>
          <Button
            variant="contained"
            onClick={handleNext}
            disabled={page === totalPages}
          >
            Next
          </Button>
        </Box>
      )}
    </Container>
  );
}
