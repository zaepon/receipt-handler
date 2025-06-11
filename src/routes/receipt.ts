import express, { Request, Response } from "express";
import multer from "multer";
import { scanReceipt } from "../lib/scan";
import { appendExpenseRowToSheet } from "../lib/sheet";

const router = express.Router();
const receiptUpload = multer({ storage: multer.memoryStorage() });

router.use((req, res, next) => {
  // TODO IMPLEMENT AUTHENTICATION GUARD
  next();
});

router.post(
  "/",
  receiptUpload.single("receipt"),
  async (req: Request, res: Response): Promise<void> => {
    if (!req.file) {
      res.status(400).send("Invalid request");
      return;
    }

    console.log("Received receipt:", req.body);

    try {
      const scannedText = await scanReceipt(req.file.buffer);

      await appendExpenseRowToSheet(scannedText);
    } catch (error) {
      console.error("error", error);
      res.status(500).send("Error processing PDF");
      return;
    }

    res.status(200).json({
      message: "Receipt received successfully",
    });
  }
);

export default router;
