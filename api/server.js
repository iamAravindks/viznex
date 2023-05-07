import express from "express";
import cors from "cors";
import http from "http";
import morgan from "morgan";
import cookieParser from "cookie-parser";

import connectDB from "./config/db.js";
import { errorHandler, notFound } from "./middlewares/middlewares.js";
import adminRouter from "./routes/adminRouter.js";
import operatorRouter from "./routes/operatorRouter.js";
import deviceRouter from "./routes/deviceRouter.js";
import customerRouter from "./routes/customerRouter.js";
import groupRouter from "./routes/groupRouter.js";
import { startSocket } from "./Socket/SocketIO.js";

const app = express();
const server = http.createServer(app);

app.use(morgan("dev"));
const corsOptions = {
  origin: true,
  credentials: true,
};

app.use(cors(corsOptions));

app.use(cookieParser());
app.use(express.json());
app.use(
  express.urlencoded({
    extended: true,
  })
);
const PORT = process.env.PORT || 5000;
connectDB();

app.get("/", (req, res) => res.send("CONGRATS ,YOU SUMMONED VIZNX"));
app.use("/api/admin", adminRouter);
app.use("/api/operator", operatorRouter);
app.use("/api/operator", groupRouter);
app.use("/api/customer", customerRouter);
app.use("/api/device", deviceRouter);

// Connect to the socket route
startSocket(server);

app.use(notFound);
app.use(errorHandler);

server.listen(PORT, () =>
  console.log(`server listen on http://localhost:${PORT}`)
);
