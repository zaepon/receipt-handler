import { google } from "googleapis";
import { randomUUID } from "crypto";
import { receiverToCategory } from "./category";

if (!process.env.GOOGLE_CREDENTIALS) {
  throw new Error("GOOGLE_CREDENTIALS environment variable is not set");
}

const credentials = JSON.parse(process.env.GOOGLE_CREDENTIALS);
const auth = new google.auth.GoogleAuth({
  credentials: credentials,
  scopes: ["https://www.googleapis.com/auth/spreadsheets"],
});

export async function appendExpenseRowToSheet(record: Record<string, string>) {
  const client = auth;
  const sheets = google.sheets({ version: "v4", auth: client });

  const spreadsheetId = "1N5G9IGRKguO6_g2yOC4dsBIh0cMK2tlNIej06euHYgU"; // TODO store in env
  const range = `${getCurrentMonthNameInFinnish()}!J22:M100`;

  const res = await sheets.spreadsheets.values.get({
    auth: client,
    spreadsheetId,
    range,
  });

  const rows = res.data.values || [];
  const firstEmptyRow = 22 + rows.length;

  const referenceNumber = resolveReferenceNumber(record["viitenumero"]);

  const entryExists = expenseExistsInSheet(rows, record, referenceNumber);
  if (entryExists) {
    console.log("Expense already exists in the sheet, skipping append.");
    return;
  }

  const recordValues = [
    record["saaja"] + ":" + referenceNumber,
    record["päivämäärä"],
    receiverToCategory(record["saaja"]),
    record["määrä"],
  ];

  await sheets.spreadsheets.values.update({
    auth: client,
    spreadsheetId,
    range: `${getCurrentMonthNameInFinnish()}!J${firstEmptyRow}:M${firstEmptyRow}`,
    valueInputOption: "USER_ENTERED",
    requestBody: {
      values: [recordValues],
    },
  });
}

const getCurrentMonthNameInFinnish = () => {
  const date = new Date();
  const monthNames = [
    "Tammikuu",
    "Helmikuu",
    "Maaliskuu",
    "Huhtikuu",
    "Toukokuu",
    "Kesäkuu",
    "Heinäkuu",
    "Elokuu",
    "Syyskuu",
    "Lokakuu",
    "Marraskuu",
    "Joulukuu",
  ];
  return monthNames[date.getMonth()];
};

const expenseExistsInSheet = (
  data: string[][],
  record: Record<string, string>,
  referenceNumber: string
): boolean => {
  const expenseKey = `${record["saaja"]}:${referenceNumber}`;
  const duplicateRow = data.findIndex(
    (row) => row[0] && row[0].includes(expenseKey)
  );

  if (duplicateRow !== -1) {
    return true;
  }

  return false;
};

const resolveReferenceNumber = (referenceNumber: string | undefined): string => {
  const normalized = referenceNumber?.trim();
  if (
    !normalized ||
    normalized.toLowerCase() === "undefined" ||
    normalized.toLowerCase() === "null"
  ) {
    return `generated-${randomUUID()}`;
  }

  return normalized;
};
