enum ExpenseCategory {
  DAILY_GOODS = "Päivittäistavarat",
  ALCOHOL = "Alkoholi",
  HEALTH = "Terveys",
  TRAVEL = "Matkustus",
  SUBSCRIPTIONS = "Tilaukset",
  SAVINGS = "Säästöt",
  HOUSING = "Asuminen",
  LEISURE = "Vapaa-aika",
  HOME = "Koti",
  OTHER = "Muu",
}

const categoriesByStoreName: Record<string, ExpenseCategory> = {
  "k-market": ExpenseCategory.DAILY_GOODS,
  "s-market": ExpenseCategory.DAILY_GOODS,
  "k-supermarket": ExpenseCategory.DAILY_GOODS,
  sokos: ExpenseCategory.DAILY_GOODS,
  prisma: ExpenseCategory.DAILY_GOODS,
  alko: ExpenseCategory.ALCOHOL,
  citymarket: ExpenseCategory.DAILY_GOODS,
  lidl: ExpenseCategory.DAILY_GOODS,
  tokmanni: ExpenseCategory.DAILY_GOODS,
  apteekki: ExpenseCategory.HEALTH,
  hsl: ExpenseCategory.TRAVEL,
  "baestyle oy": ExpenseCategory.HEALTH,
  hetzner: ExpenseCategory.SUBSCRIPTIONS,
  "yliopiston apt": ExpenseCategory.HEALTH,
  nordnet: ExpenseCategory.SAVINGS,
  dott: ExpenseCategory.TRAVEL,
  "helen oy": ExpenseCategory.HOUSING,
  veikkaus: ExpenseCategory.LEISURE,
  "suomalainen kirja": ExpenseCategory.LEISURE,
  "clas ohlson": ExpenseCategory.HOME,
  dna: ExpenseCategory.HOUSING,
  hesburger: ExpenseCategory.DAILY_GOODS,
  "k-rauta": ExpenseCategory.HOME,
  rusta: ExpenseCategory.HOME,
  verkkokauppa: ExpenseCategory.LEISURE,
};

export const receiverToCategory = (receiverName: string) => {
  const storeName = receiverName.toLowerCase();

  // Check if some category partially match the given store name
  for (const [key, value] of Object.entries(categoriesByStoreName)) {
    if (storeName.includes(key)) {
      return value;
    }
  }

  return ExpenseCategory.OTHER;
};
