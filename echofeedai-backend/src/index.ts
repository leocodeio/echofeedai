import express from "express";
import bodyParser from "body-parser";
import cors from "cors";
import cookieParser from "cookie-parser";

import dotenv from "dotenv";
dotenv.config();

import initiatorRouter from "./routes/v1/initiator";
import participantRouter from "./routes/v1/participant";
import modelRouter from "./routes/v1/model";
import nmRouter from "./routes/v1/nm";

const app = express();

const corsOptions = {
  origin: process.env.USER_FRONTEND_URL || "http://localhost:5173",
  credentials: true,
  methods: ["GET", "POST", "PUT", "DELETE", "OPTIONS"],
  allowedHeaders: ["Content-Type", "Authorization", "x-api-key", "Cookie"],
};

app.use(cors(corsOptions));
app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: true }));
app.use(cookieParser());

app.use("/initiator/v1", initiatorRouter);
app.use("/participant/v1", participantRouter);
app.use("/model/v1", modelRouter);
app.use("/nm/v1", nmRouter);

app.get("/", (req, res) => {
  res.send("Hello World!");
});

const PORT = process.env.PORT || 5000;
app.listen(PORT, () => {
  console.log(`Server is running on http://localhost:${PORT}`);
});
