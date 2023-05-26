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
import { Server } from 'socket.io';
import Device from "./models/DeviceModel.js";

// your code that uses the socketio module

const app = express();
const server = http.createServer(app);
const io = new Server(server, {
  cors:{
    origin:"http://localhost:3000",
    
  }
});

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



app.use(notFound);
app.use(errorHandler);



io.on('connection', async (socket) => {
  const deviceId = socket.handshake.query.deviceId;
  const device = await Device.findOne({_id: deviceId});

  if (device) {
    console.log(`Device connected: ${deviceId}`);
    console.log(device);

    // Update the status field of the device to true
    await Device.updateOne({ _id: deviceId }, { $set: { status: true } });
  } else {
    console.log(`Device not found: ${deviceId}`);
  }

  socket.on('disconnect', async () => {
    console.log(`Device disconnected: ${deviceId}`);
    await Device.updateOne({ _id: deviceId }, { $set: { status: false } });
  });
});






server.listen(PORT, () =>
  console.log(`server listen on http://localhost:${PORT}`)
);
