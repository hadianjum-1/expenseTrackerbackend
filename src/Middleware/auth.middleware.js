import jwt from "jsonwebtoken";

const isDev = process.env.ENVIROMENT === "DEV" || process.env.NODE_ENV === "development";

const clearAuthCookie = (res) => {
  res.clearCookie("Authcontrol", {
    httpOnly: true,
    secure: !isDev,
    sameSite: isDev ? "lax" : "none",
    path: "/",
  });
};

const authMiddleware = async (req, res, next) => {
  try {
    const token = req.cookies?.Authcontrol;
    if (!token) {
      clearAuthCookie(res);
      return res.status(401).json({ message: "Unauthorized. Please log in." });
    }

    const payload = jwt.verify(token, process.env.SECRET_KEY);
    req.user = payload;
    next();
  } catch (err) {
    clearAuthCookie(res);
    return res.status(401).json({ message: "Session expired. Please log in again." });
  }
};

export default authMiddleware;
