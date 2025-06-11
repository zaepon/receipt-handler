import os from "os";
import { promises as fs } from "fs";
import { createWorker, createScheduler } from "tesseract.js";

let scheduler: Tesseract.Scheduler | null = null;

const MAX_OCR_WORKERS = os.cpus().length;
if (MAX_OCR_WORKERS < 1) {
  throw new Error("No CPU cores available for OCR processing");
}

async function getScheduler() {
  if (!scheduler) {
    scheduler = createScheduler();

    const workerPromises = Array.from({ length: MAX_OCR_WORKERS }).map(
      async () => {
        const worker = await createWorker("eng");
        scheduler.addWorker(worker);
      }
    );

    await Promise.all(workerPromises);

    console.log(
      `Tesseract scheduler initialized with ${MAX_OCR_WORKERS} workers.`
    );
  }
  return scheduler;
}

export async function scanTextFromImage(
  imageFilePath: string,
  fields: { name: string; formatter?: (func: any) => string }[]
) {
  const imgBuffer = await fs.readFile(imageFilePath);

  const scheduler = await getScheduler();
  const ret = await scheduler.addJob("recognize", imgBuffer);

  const lines = ret.data.text.split("\n").filter((line) => line.trim() !== "");
  const result: Record<string, string> = {};

  for (const field of fields) {
    const fieldName = field.name;
    const index = lines.findIndex((line) =>
      line.toLowerCase().includes(fieldName.toLowerCase())
    );

    const fieldValue = index !== -1 ? lines[index + 1] : null;
    if (fieldValue) {
      result[fieldName] = field.formatter
        ? field.formatter(fieldValue.trim())
        : fieldValue.trim();
    }
  }

  return result;
}
