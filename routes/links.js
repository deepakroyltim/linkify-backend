import { Router } from "express";
import { nanoid } from "nanoid";
import QRCode from "qrcode";
import Links from "../models/Links.js";
import { validateUrl, validateUserId } from "../middleware/validation.js";

const router = Router();
const baseUrl = process.env.BASE_URL || "http://localhost:5175";

router.get("/", (req, res) => {
  res.json({ message: "Links API is running" });
});

// URL Shortener endpoints
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



// QR Code endpoints
router.post("/generateqr", validateUrl, async (req, res) => {
  const { originalUrl, userId } = req.body;

  const existing = await Links.findOne({ originalUrl, type: "qrCode", userId });
  if (existing) {
    return res.status(400).json({
      message: `QR Code already generated. ${
        userId ? "Please check your dashboard." : "Please try with other url."
      }`,
      code: existing.shortCode,
    });
  }

  try {
    const qrDataUrl = await QRCode.toDataURL(originalUrl, {
      width: 512,
      margin: 2,
      color: {
        dark: "#2E86AB",
        light: "#FDF6EC",
      },
    });
    
    await Links.create({
      originalUrl: originalUrl,
      shortCode: qrDataUrl,
      userId: userId || null,
      clicks: 0,
      type: "qrCode",
    });

    res.json({ rawCode: qrDataUrl });
  } catch (error) {
    console.log(error.message);
    res.status(500).json({ 
      error: "Server Error", 
      message: error.message 
    });
  }
});

// Get user's links (both short URLs and QR codes)
router.get("/user/:userId", validateUserId, async (req, res) => {
  const { userId } = req.params;

  try {
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