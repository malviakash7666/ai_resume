import jwt from "jsonwebtoken";

export const verifyToken = (req, res, next) => {
  try {
    // 👇 cookies se token uthao
    const token = req.cookies.accessToken;

    if (!token) {
      return res.status(401).json({
        success: false,
        message: "Token missing"
      });
    }

    const decoded = jwt.verify(token, process.env.JWT_SECRET);

    req.user = decoded; // user info req me set kar do
    next();

  } catch (error) {
    return res.status(401).json({
      success: false,
      message: "Invalid token"
    });
  }
};