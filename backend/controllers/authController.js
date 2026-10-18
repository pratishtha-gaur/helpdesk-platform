import jwt from "jsonwebtoken";
import Staff from "../models/Staff.js";

export async function login(req, res) {
  try {
    const { email, password } = req.body;

    if (
      typeof email !== "string" ||
      typeof password !== "string" ||
      !email ||
      !password
    ) {
      return res
        .status(400)
        .json({ error: "Email and password are required." });
    }

    const staff = await Staff.findOne({
      email: email.toLowerCase().trim(),
    }).select("+password");
    const valid =
      staff && staff.isActive && (await staff.comparePassword(password));

    // Same message whether the email or the password was wrong, so
    // attackers can't use this to discover which emails exist.
    if (!valid) {
      return res.status(401).json({ error: "Invalid email or password." });
    }

    const token = jwt.sign(
      { id: staff._id, role: staff.role },
      process.env.JWT_SECRET,
      {
        expiresIn: "8h",
      },
    );

    return res.status(200).json({
      token,
      staff: {
        id: staff._id,
        name: staff.name,
        email: staff.email,
        role: staff.role,
      },
    });
  } catch (error) {
    console.error("Login error:", error.message);
    return res.status(500).json({ error: "Login failed. Please try again." });
  }
}

export function me(req, res) {
  const { _id, name, email, role } = req.staff;
  return res.status(200).json({ staff: { id: _id, name, email, role } });
}
