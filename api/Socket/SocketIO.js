import { Server } from "socket.io";
import config from "../config.js";
import Device from "../models/DeviceModel.js";
import mongoose from "mongoose";

export const startSocket = async (server) => {
  try {
    const io = new Server(server, {
      cors: true,
    });

    io.of("/api/device/socket").on("connection", async (socket) => {
      console.log(`Device ${socket.id} connected to socket route`);

      // Join the room with the device ID
      const id = socket.handshake.query.id;
      socket.join(id);

      // for devices only
      socket.on("statusUpdate", async (deviceId) => {
        const device = await Device.findById(
          new mongoose.Types.ObjectId(deviceId)
        );
        device.status = true;
        await device.save();

        // Emit the status update only to the corresponding room
        io.to(id).emit("statusUpdate", device.status);
      });

      // for everyone
      socket.on("checkStatus", async (deviceId) => {
        console.log(deviceId);
        const device = await Device.findById(
          new mongoose.Types.ObjectId(deviceId)
        );
        io.to(id).emit("checkStatus", device.status);
      });

      socket.on("disconnect", async () => {
        const device =
          (await Device.findByIdAndUpdate(new mongoose.Types.ObjectId(id)),
          {
            $set: {
              status: false,
            },
          });
      });
    });
  } catch (error) {
    console.log(error);
    throw new Error(error.message ? error.message : "Internal server error");
  }
};
