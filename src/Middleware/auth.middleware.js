import jwt from "jsonwebtoken";

const getCookieOptions = (req) => {
  const origin = req.headers.origin || "";
  const isSecureContext = origin.startsWith("https://") || req.secure || req.headers["x-forwarded-proto"] === "https";
  return {
    httpOnly: true,
    secure: !!isSecureContext,
    sameSite: isSecureContext ? "none" : "lax",
    path: "/",
  };
};

const authMiddleware = async (req, res, next) => {
  try {
    const token = req.cookies?.Authcontrol;
    if (!token) {
      res.clearCookie("Authcontrol", getCookieOptions(req));
      return res.status(401).json({ message: "Unauthorized. Please log in." });
    }

    const payload = jwt.verify(token, process.env.SECRET_KEY);
    req.user = payload;
    next();
  } catch (err) {
    res.clearCookie("Authcontrol", getCookieOptions(req));
    return res.status(401).json({ message: "Session expired. Please log in again." });
  }
};

export default authMiddleware;
