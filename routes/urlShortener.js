import { Router } from "express";
import { nanoid } from "nanoid";
import Links from "../models/Links.js";
import { validateUrl, validateUserId } from "../middleware/validation.js";

const router = Router();
const baseUrl = process.env.BASE_URL || "http://localhost:5175";

router.get("/", (req, res) => {
  res.send("App is running");
});

router.post("/shorten", validateUrl, async (req, res) => {
  const { originalUrl, userId } = req.body;

  const shortCode = nanoid(6);

  try {
    await Links.create({
      originalUrl,
      shortCode,
      userId: userId || null,
      clicks: 0,
      type: "shortCode",
    });
    res.json({ success: true, originalUrl, newUrl: `${baseUrl}/${shortCode}` });
  } catch (error) {
    console.error("Error creating short URL:", error);
    res.status(500).json({ error: "Server Error" });
  }
});

router.get("/:code", async (req, res) => {
  const { code } = req.params;
  try {
    const url = await Links.findOneAndUpdate(
      { shortCode: code },
      { $inc: { clicks: 1 } },
      { new: true }
    );
    if (url) {
      res.redirect(url.originalUrl);
    } else {
      res.status(404).json({ error: "Url not found" });
    }
  } catch (error) {
    console.error("Error redirecting:", error);
    res.status(500).json({ error: "Server Error" });
  }
});

router.get("/user/:userId/links", validateUserId, async (req, res) => {
  const { userId } = req.params;

  try {
    // Fetch links from database where userId matches
    const userLinks = await Links.find({ userId });

    res.json({
      success: true,
      links: userLinks,
    });
  } catch (error) {
    res.status(500).json({ success: false, message: "Failed to fetch links" });
  }
});

export default router;
