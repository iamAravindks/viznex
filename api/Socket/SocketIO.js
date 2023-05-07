import { Server } from "socket.io";
import config from "../config.js";
import Device from "../models/DeviceModel.js";
import mongoose from "mongoose";

export const startSocket = (server) => {
  const io = new Server(server, {
    cors: true,
  });

  io.on("connection", async (socket) => {
    console.log(`Device ${socket.id} connected to socket route`);

    // Join the room with the device ID
    const id = socket.handshake.query.id;
    socket.join(id);

    socket.on("statusUpdate", async (deviceId) => {
      const device = await Device.findById(
        new mongoose.Types.ObjectId(deviceId)
      );
      device.status = true;
      await device.save();

      // Emit the status update only to the corresponding room
      io.to(id).emit("statusUpdate", device.status);
    });

    socket.on("checkStatus", async (deviceId) => {
      const device = await Device.findById(
        new mongoose.Types.ObjectId(deviceId)
      );
      io.to(id).emit("checkStatus", device.status);
    });

    socket.on("disconnect", async () => {
      const device = await Device.findById(
        new mongoose.Types.ObjectId(deviceId)
      );
      device.status = false;
      await device.save();

      // Emit the status update only to the corresponding room
      io.to(deviceId).emit("statusUpdate", device.status);
    });
  });
};
