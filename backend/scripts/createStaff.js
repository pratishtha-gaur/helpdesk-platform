import "dotenv/config";
import connectDB from "../config/db.js";
import Staff from "../models/Staff.js";

await connectDB();

const [name, email, password, role = "staff"] = process.argv.slice(2);

if (!name || !email || !password) {
  console.log(
    'Usage: node scripts/createStaff.js "Full Name" email@mait.ac.in password [staff|admin]',
  );
  process.exit(1);
}

if (password.length < 8) {
  console.error("Password must be at least 8 characters.");
  process.exit(1);
}

try {
  await Staff.create({ name, email, password, role });
  console.log(`✅ Staff account created for ${email}`);
} catch (err) {
  console.error(
    err.code === 11000
      ? "A staff account with that email already exists."
      : err.message,
  );
  process.exit(1);
}

process.exit(0);
