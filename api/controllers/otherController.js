import expressAsyncHandler from "express-async-handler";

export const logout = (cookieName, otherCookie = null) =>
  expressAsyncHandler(async (req, res) => {
    try {
      res.clearCookie(cookieName);
      if (otherCookie) res.clearCookie(otherCookie);
      res.status(200).json({
        message: "Successfully logged out",
      });
    } catch (error) {
      throw new Error(error?.message || "Internal server error");
    }
  });
