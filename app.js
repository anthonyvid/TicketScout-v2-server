import express from "express";
import * as Sentry from "@sentry/node";
import bodyParser from "body-parser";
import cors from "cors";
import dotenv from "dotenv";
import helmet from "helmet";
import morgan from "morgan";
import path from "path";
import { fileURLToPath } from "url";
import authRoutes from "./routes/auth.js";
import organizationRoutes from "./routes/organization.js";
import ticketRoutes from "./routes/ticket.js";
import paymentRoutes from "./routes/payment.js";
import customerRoutes from "./routes/customer.js";
import searchRoutes from "./routes/search.js";
import userRoutes from "./routes/user.js";
import ErrorHandler from "./middleware/ErrorHandler.js";
import { initDatabase } from "./utils/db.js";
import { handleSortFilter } from "./middleware/SortFilterHandler.js";
import http from "http";
import { initSocketIo } from "./socket.js";

Sentry.init({
	dsn: process.env.SENTRY_DSN,
});

/* CONFIGURATIONS */
const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);
dotenv.config();
const app = express();
const server = http.createServer(app);
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

// Initialize WebSockets
initSocketIo(server);

app.use(handleSortFilter);

/* ROUTES */
app.use("/api/auth", authRoutes);
app.use("/api/organizations", organizationRoutes);
app.use("/api/users", userRoutes);
app.use("/api/tickets", ticketRoutes);
app.use("/api/customers", customerRoutes);
app.use("/api/payments", paymentRoutes);
app.use("/api/search", searchRoutes);

app.use(Sentry.Handlers.errorHandler());
app.use(ErrorHandler);

const PORT = process.env.PORT || 6001;
const WS_PORT = process.env.WS_PORT || 7001;

server.listen(WS_PORT);
app.listen(PORT);
