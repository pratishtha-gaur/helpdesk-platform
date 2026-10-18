import jwt from "jsonwebtoken";
import Staff from "../models/Staff.js";

export async function requireStaff(req, res, next) {
  const [scheme, token] = (req.headers.authorization || "").split(" ");
  if (scheme !== "Bearer" || !token) {
    return res.status(401).json({ error: "Authentication required." });
  }

  try {
    const payload = jwt.verify(token, process.env.JWT_SECRET);

    // Re-check the database on every request, so a deactivated
    // account loses access immediately, not when its token expires.
    const staff = await Staff.findById(payload.id);
    if (!staff || !staff.isActive) {
      return res.status(401).json({ error: "Account not found or disabled." });
    }

    req.staff = staff;
    next();
  } catch {
    return res.status(401).json({ error: "Invalid or expired session." });
  }
}
