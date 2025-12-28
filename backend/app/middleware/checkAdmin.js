import jwt from "jsonwebtoken";

export function verifyAdmin(req) {
  const authHeader = req.headers.get("authorization");
  if (!authHeader) return { error: "No token provided", status: 401 };

  const token = authHeader.split(" ")[1];
  if (!token) return { error: "Invalid token", status: 401 };

  try {
    const decoded = jwt.verify(token, process.env.JWT_SECRET);
    if (decoded.role !== "admin") {
      return { error: "Access denied. Admin only.", status: 403 };
    }
    return { userId: decoded.id };
  } catch (error) {
    return { error: "Unauthorized", status: 401 };
  }
}
