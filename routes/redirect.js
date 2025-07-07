import { Router } from "express";
import Links from "../models/Links.js";

const router = Router();

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

export default router;