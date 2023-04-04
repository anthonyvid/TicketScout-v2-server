import express from "express";
import * as Sentry from "@sentry/node";
import bodyParser from "body-parser";
import mongoose from "mongoose";
import cors from "cors";
import dotenv from "dotenv";
import helmet from "helmet";
import morgan from "morgan";
import path from "path";
import { fileURLToPath } from "url";
import authRoutes from "./routes/auth.js";
import organizationRoutes from "./routes/organization.js";
import ticketRoutes from "./routes/ticket.js";
import userRoutes from "./routes/user.js";
import ErrorHandler from "./middleware/ErrorHandler.js";
import { initDatabase } from "./utils/db.js";

Sentry.init({
	dsn: process.env.SENTRY_DSN,
});

/* CONFIGURATIONS */
const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);
dotenv.config();
const app = express();
app.use(Sentry.Handlers.requestHandler());
app.use(express.json());
app.use(helmet());
app.use(helmet.crossOriginResourcePolicy({ policy: "cross-origin" }));
app.use(morgan("common"));
app.use(bodyParser.json({ limit: "30mb", extended: true }));
app.use(bodyParser.urlencoded({ limit: "30mb", extended: true }));
app.use(cors());
app.use("/assets", express.static(path.join(__dirname, "public/assets"))); // for prod can use s3

// Connect to mongoDB
initDatabase();

/* ROUTES */
app.use("/api/auth", authRoutes);
app.use("/api/organizations", organizationRoutes);
app.use("/api/users", userRoutes);
app.use("/api/tickets", ticketRoutes);
// app.use("/api/:store", ticketRoutes);
// app.use("/api/:store", customerRoutes);

app.use(Sentry.Handlers.errorHandler());
app.use(ErrorHandler);

const PORT = process.env.PORT || 6001;
app.listen(PORT);
