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
  let { q, key, cx, num, start } = req.body;
  if (!q || !key || !cx) {
    return res.status(400).json({ error: "Missing q, key, or cx" });
  }
  if (!num) num = 10;
  if (!start) start = 1;
  const sources = [
    "site:linkedin.com/in",
    "site:techinasia.com/profile",
    "site:id.bold.pro/my"
  ];
  let sourceIdx = 0;
  let lastError = null;
  while (sourceIdx < sources.length) {
    try {
      let finalQ = q + " " + sources[sourceIdx];
      const response = await axios.get("https://www.googleapis.com/customsearch/v1", {
        params: { q: finalQ, key, cx, num, start },
      });
      return res.json(response.data);
    } catch (err) {
      lastError = err;
      // If error is not 400, break and return
      if (!err.response || err.response.status !== 400) {
        console.log(err);
        return res.status(500).json({ error: err.message });
      }
      sourceIdx++;
      start = 1;
      num = 10;
    }
  }
  // If all sources failed with 400
  return res.status(400).json({ error: lastError?.message || "Bad Request", detail: lastError });
});

const PORT = process.env.PORT || 3000;
app.listen(PORT, () => {
  console.log(`API server running on port ${PORT}`);
});
