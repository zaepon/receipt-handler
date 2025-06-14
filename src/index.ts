import express from "express";
import winston from "winston";
import helmet from "helmet";
import "dotenv/config";
import expressWinston from "express-winston";
import receiptRouter from "./routes/receipt";
const app = express();
const port = 3456;

app.use(express.json());
app.use(helmet());
app.use(
  expressWinston.logger({
    transports: [new winston.transports.Console()],
    format: winston.format.combine(
      winston.format.colorize(),
      winston.format.json()
    ),
    meta: true,
    msg: "HTTP {{req.method}} {{req.url}}",
    expressFormat: true,
    colorize: false,
    ignoreRoute: function (req, res) {
      return false;
    },
  })
);

app.use("/receipt", receiptRouter);
app.get("/alive", (req, res) => {
  res.send("alive");
});

app.listen(port, () => {
  console.log(`App listening on port ${port}`);
});
