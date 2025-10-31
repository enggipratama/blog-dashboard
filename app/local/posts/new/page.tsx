"use client";
import { useState, useEffect, startTransition, useRef } from "react";
import { useRouter } from "next/navigation";
import { Box, TextField, Button, Typography, IconButton } from "@mui/material";
import { Brightness4, Brightness7 } from "@mui/icons-material";
import ReactMarkdown from "react-markdown";
import { useAtom } from "jotai";
import { themeAtom } from "@/store/themeAtom";
import { postsAtom, LocalPost } from "@/store/postsAtom";
import { toast, ToastContainer } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";

export default function NewPostPage() {
  const router = useRouter();
  const [posts, setPosts] = useAtom(postsAtom);
  const [theme, setTheme] = useAtom(themeAtom);

  const [title, setTitle] = useState("");
  const [body, setBody] = useState("");

  const themeRef = useRef(theme);

  const toggleTheme = () => {
    const newTheme = theme === "light" ? "dark" : "light";
    setTheme(newTheme);
    localStorage.setItem("theme", newTheme);
  };

  useEffect(() => {
    const savedPosts = localStorage.getItem("localPosts");
    if (savedPosts) {
      try {
        const parsed: LocalPost[] = JSON.parse(savedPosts);
        setPosts(parsed);
      } catch (err) {
        console.error("Invalid posts format", err);
      }
    }
  }, [setPosts]);

  useEffect(() => {
    const timeout = setTimeout(() => {
      const draftPost: LocalPost = {
        id: Date.now(),
        title,
        body,
        createdAt: new Date().toISOString(),
      };
      localStorage.setItem("draftPost", JSON.stringify(draftPost));
    }, 500);
    return () => clearTimeout(timeout);
  }, [title, body]);

  useEffect(() => {
    const draft = localStorage.getItem("draftPost");
    if (!draft) return;

    try {
      const saved = JSON.parse(draft);
      startTransition(() => {
        if (saved.title) setTitle(saved.title);
        if (saved.body) setBody(saved.body);
      });
      toast.info("💾 Draft restored successfully!", {
        position: "bottom-right",
        autoClose: 2000,
        theme: themeRef.current,
        style: { fontSize: "14px", textAlign: "center" },
      });
    } catch (err) {
      console.error("Invalid draft format", err);
    }
  }, []);

  const handleSubmit = () => {
    if (!title.trim() || title.length < 5) {
      toast.error("Title must be at least 5 characters", {
        position: "top-center",
        theme,
        style: { fontSize: "14px", textAlign: "center" },
      });
      return;
    }
    if (!/^[A-Za-z]/.test(title)) {
      toast.error("Title must start with an alphabetical character", {
        position: "top-center",
        theme,
        style: { fontSize: "14px", textAlign: "center" },
      });
      return;
    }
    if (!body.trim() || body.length < 20) {
      toast.error("Content must be at least 20 characters", {
        position: "top-center",
        theme,
        style: { fontSize: "14px", textAlign: "center" },
      });
      return;
    }

    const newPost: LocalPost = {
      id: Date.now(),
      title: title.trim(),
      body: body.trim(),
      createdAt: new Date().toISOString(),
    };

    const updatedPosts = [...posts, newPost];
    setPosts(updatedPosts);
    localStorage.setItem("localPosts", JSON.stringify(updatedPosts));
    localStorage.removeItem("draftPost");

    toast.success("✅ Post saved successfully!", {
      position: "top-center",
      autoClose: 1500,
      theme,
      style: { fontSize: "14px", textAlign: "center" },
    });

    setTimeout(() => router.push("/local/posts"), 1800);
  };

  const handleCancel = () => {
    localStorage.removeItem("draftPost");
    router.push("/local/posts");
  };

  return (
    <Box sx={{ mt: 4, px: 2 }}>
      <Box
        sx={{
          display: "flex",
          justifyContent: "space-between",
          alignItems: "center",
          mb: 3,
        }}
      >
        <Typography variant="h4" sx={{ flex: 1, textAlign: "center" }}>
          Create New Post
        </Typography>
        <IconButton onClick={toggleTheme} color="inherit">
          {theme === "light" ? <Brightness4 /> : <Brightness7 />}
        </IconButton>
      </Box>

      <Box
        sx={{
          display: "flex",
          flexDirection: { xs: "column", md: "row" },
          gap: 1,
          mb: 10,
        }}
      >
        <Box sx={{ flex: 1 }}>
          <TextField
            label="Title"
            helperText="Title must be at least 5 characters and start with an alphabetical character"
            fullWidth
            value={title}
            onChange={(e) => setTitle(e.target.value)}
            sx={{ mb: 1 }}
          />
          <TextField
            label="Content (Markdown)"
            helperText="Content must be at least 20 characters"
            multiline
            rows={12}
            fullWidth
            value={body}
            onChange={(e) => setBody(e.target.value)}
          />

          <Box sx={{ mt: 1, mb: 1, display: "flex", gap: 2 }}>
            <Button variant="contained" onClick={handleSubmit}>
              Submit
            </Button>
            <Button variant="outlined" color="warning" onClick={handleCancel}>
              Cancel
            </Button>
          </Box>
        </Box>

        <Box
          sx={{
            flex: 1,
            border: "1px solid #ccc",
            p: 2,
            borderRadius: 1,
            backgroundColor: theme === "dark" ? "dark" : "light",
          }}
        >
          <Typography variant="h6" gutterBottom>
            Live Preview
          </Typography>
          <Box
            sx={{
              minHeight: 300,
              overflowY: "auto",
              color: theme === "dark" ? "dark" : "light",
              wordBreak: "break-word",
              overflowWrap: "anywhere",
              whiteSpace: "pre-wrap",
            }}
          >
            {body ? (
              <ReactMarkdown>{body}</ReactMarkdown>
            ) : (
              <Typography color="text.secondary">
                Start typing markdown to preview...
              </Typography>
            )}
          </Box>
        </Box>
      </Box>

      <ToastContainer
        position="top-left"
        autoClose={2000}
        hideProgressBar={false}
        newestOnTop
        closeOnClick
        rtl={false}
        pauseOnFocusLoss
        draggable
        pauseOnHover
        theme={theme}
        toastStyle={{ fontSize: "14px", textAlign: "center" }}
      />
    </Box>
  );
}
