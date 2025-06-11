import path from "path";
import { rimraf } from "rimraf";
import os from "os";
import { convertPdfToImage } from "./pdf_image_convert";
import { scanTextFromImage } from "./ocr";

const MAX_OCR_WORKERS = os.cpus().length;
if (MAX_OCR_WORKERS < 1) {
  throw new Error("No CPU cores available for OCR processing");
}

async function scanReceipt(buffer: Buffer) {
  // Convert pdf to image, store to temp directory and return the path
  const imagePath = await convertPdfToImage(buffer);

  const fields = [
    {
      name: "saaja",
    },
    {
      name: "maara",
      formatter: (value: string) => {
        // Get amount from maaraResult "format is like Maara: 12,34 EUR"
        const amountMatch = value.match(/(\d+,\d{2})/);
        const amount = amountMatch ? amountMatch[0] : "";
        return amount;
      },
    },
    {
      name: "paivamaara",
      formatter: (value: string) => {
        // Get date from date row  "format is like Kirjauspaiva: 9.6.2025"
        const dateMatch = value.match(/(\d{1,2}\.\d{1,2}\.\d{4})/);
        const date = dateMatch ? dateMatch[0] : "";
        return date;
      },
    },
  ];
  const result = await scanTextFromImage(imagePath, fields);

  // Clean up the temporary image file
  try {
    await rimraf(path.dirname(imagePath));
  } catch (e) {
    console.error("Error cleaning up temp directory:", e);
  }

  return result;
}

export { scanReceipt };
