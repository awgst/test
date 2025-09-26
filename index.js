import express from "express";
import axios from "axios";
import { visitAndExtractMarkdown } from "./visit.js";

const app = express();
app.use(express.json());

app.post("/extract", async (req, res) => {
  const { url } = req.body;
  if (!url) {
    return res.status(400).json({ error: "Missing url" });
  }
  try {
    const markdown = await visitAndExtractMarkdown(url);
    res.json({ markdown });
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

app.post("/search", async (req, res) => {
  const { q, key, cx, num, start } = req.body;
  if (!q || !key || !cx) {
    return res.status(400).json({ error: "Missing q, key, or cx" });
  }
  try {
    if (!num) {
      num = 10;
    }
    if (!start) {
      start = 1;
    }
    const response = await axios.get("https://www.googleapis.com/customsearch/v1", {
      params: { q, key, cx, num, start },
    });
    res.json(response.data);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

const PORT = process.env.PORT || 3000;
app.listen(PORT, () => {
  console.log(`API server running on port ${PORT}`);
});
