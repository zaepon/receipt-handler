import { google } from "googleapis";
import { receiverToCategory } from "./category";

const auth = new google.auth.GoogleAuth({
  keyFile: "credentials.json",
  scopes: ["https://www.googleapis.com/auth/spreadsheets"],
});

export async function appendExpenseRowToSheet(record: Record<string, string>) {
  const client = auth;
  const sheets = google.sheets({ version: "v4", auth: client });

  const spreadsheetId = "1N5G9IGRKguO6_g2yOC4dsBIh0cMK2tlNIej06euHYgU"; // TODO store in env
  const range = "Kesäkuu!J22:M60";

  const res = await sheets.spreadsheets.values.get({
    auth: client,
    spreadsheetId,
    range,
  });

  const rows = res.data.values || [];
  const firstEmptyRow = 22 + rows.length;

  const recordValues = [
    record["saaja"],
    record["paivamaara"],
    receiverToCategory(record["saaja"]),
    record["maara"],
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
