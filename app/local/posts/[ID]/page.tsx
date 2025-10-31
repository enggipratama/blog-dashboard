"use client";
import { useState, useEffect, startTransition } from "react";
import { useRouter, useParams } from "next/navigation";
import {
  Box,
  Typography,
  Button,
  Dialog,
  DialogTitle,
  DialogContent,
  DialogActions,
  CircularProgress,
  Stack,
} from "@mui/material";
import ReactMarkdown from "react-markdown";
import { useAtom } from "jotai";
import { postsAtom, LocalPost } from "@/store/postsAtom";

export default function PostDetailPage() {
  const router = useRouter();
  const { ID } = useParams();

  const [posts, setPosts] = useAtom(postsAtom);
  const [post, setPost] = useState<LocalPost | null>(null);
  const [loading, setLoading] = useState(true);
  const [openDelete, setOpenDelete] = useState(false);
  const [fadeOut, setFadeOut] = useState(false);

  useEffect(() => {
    const savedPosts = localStorage.getItem("localPosts");
    let parsed: LocalPost[] = [];

    if (savedPosts) {
      try {
        parsed = JSON.parse(savedPosts);
        setPosts(parsed);
      } catch (err) {
        console.error("Invalid posts format in localStorage", err);
      }
    }

    const found = parsed.find((p) => p.id.toString() === ID);
    if (!found) {
      router.replace("/local/posts");
      return;
    }

    startTransition(() => {
      setPost(found);
      setLoading(false);
    });
  }, [ID, router, setPosts]);

  const handleDelete = () => {
    if (!post) return;

    const updatedPosts = posts.filter((p) => p.id !== post.id);
    setPosts(updatedPosts);
    localStorage.setItem("localPosts", JSON.stringify(updatedPosts));

    setFadeOut(true);
    setOpenDelete(false);

    setTimeout(() => router.replace("/local/posts"), 500);
  };

  if (loading) {
    return (
      <Box sx={{ mt: 4, display: "flex", justifyContent: "center" }}>
        <CircularProgress />
      </Box>
    );
  }

  if (!post) return null;

  return (
    <Box
      sx={{
        mt: 4,
        p: 2,
        transition: "opacity 0.5s ease",
        opacity: fadeOut ? 0 : 1,
      }}
    >
      <Typography variant="h4" gutterBottom>
        {post.title}
      </Typography>
      <Typography variant="subtitle2" gutterBottom>
        Created at: {new Date(post.createdAt).toLocaleString()}
      </Typography>
      <Box
        sx={{
          border: "1px solid #ccc",
          borderRadius: 1,
          p: 2,
          mb: 2,
          minHeight: 200,
        }}
      >
        <ReactMarkdown>{post.body}</ReactMarkdown>
      </Box>

      <Stack direction="row" spacing={2}>
        <Button
          variant="outlined"
          color="primary"
          onClick={() => router.push("/local/posts")}
        >
          Back
        </Button>

        <Button
          variant="outlined"
          color="error"
          onClick={() => setOpenDelete(true)}
        >
          Delete Post
        </Button>
      </Stack>

      <Dialog open={openDelete} onClose={() => setOpenDelete(false)}>
        <DialogTitle>Confirm Delete</DialogTitle>
        <DialogContent>
          Are you sure you want to delete this post?
        </DialogContent>
        <DialogActions>
          <Button onClick={() => setOpenDelete(false)}>Cancel</Button>
          <Button onClick={handleDelete} color="error">
            Delete
          </Button>
        </DialogActions>
      </Dialog>
    </Box>
  );
}
