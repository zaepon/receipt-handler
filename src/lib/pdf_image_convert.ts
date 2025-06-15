import path from "path";
import { fromBuffer } from "pdf2pic";
import { rimraf } from "rimraf";
import { promises as fs } from "fs";
import os from "os";
import crypto from "crypto";

export async function convertPdfToImage(pdfBuffer) {
  const reqId = crypto.randomUUID();
  const tempDir = path.join(os.tmpdir(), reqId);

  try {
    await rimraf(tempDir);
  } catch (e) {
    console.error("Error cleaning up temp directory:", e);
  }

  await fs.mkdir(tempDir, { recursive: true });

  const convert = fromBuffer(pdfBuffer, {
    preserveAspectRatio: true,
    density: 300,
    format: "png",
    savePath: tempDir,
  });

  const output = await convert(1);

  //   // store to local directory also to local directory for debug
  //   const localOutputPath = path.join(process.cwd(), `${reqId}.png`);
  //   await fs.copyFile(output.path, localOutputPath);
  //   console.log("Converted PDF to image at:", localOutputPath);

  console.log("Converted PDF to image at:", output.path);
  return output.path;
}
