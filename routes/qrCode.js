import { Router } from "express";
import Url from "../models/Links.js";
import QRCode from "qrcode";
import { validateUrl, validateUserId } from "../middleware/validation.js";

const router = Router();

router.get("/", (req, res) => {
  res.json({ message: "Server is up and running." });
});

router.post("/generateqr", validateUrl, async (req, res) => {
  const { originalUrl, userId } = req.body;

  const existing = await Url.findOne({ originalUrl, type: "qrCode", userId });
  if (existing) {
    res.status(400).json({
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
        dark: "#2E86AB", // Custom dark color (QR code dots)
        light: "#FDF6EC", // Custom light color (background)
      },
    });
    await Url.create({
      originalUrl: originalUrl,
      shortCode: qrDataUrl,
      userId: userId || null,
      clicks: 0,
      type: "qrCode",
    });

    res.json({ rawCode: qrDataUrl });
    // res.send(`<img src="${qrDataUrl}" alt="QR Code" />`);
  } catch (error) {
    console.log(error.message);
    res
      .status(500)
      .json({ error: "Server Error", message: error.message, code: error });
  }

  res.json({ URL: qrDataUrl });
});

router.get("/user/:userId/links", validateUserId, async (req, res) => {
  const { userId } = req.params;

  try {
    // Fetch links from database where userId matches
    const userLinks = await Url.find({ userId });

    res.json({
      success: true,
      links: userLinks,
    });
  } catch (error) {
    res.status(500).json({ success: false, message: "Failed to fetch links" });
  }
});

export default router;
