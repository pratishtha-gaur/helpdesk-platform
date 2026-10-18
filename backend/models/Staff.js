import mongoose from "mongoose";
import bcrypt from "bcryptjs";

const staffSchema = new mongoose.Schema(
  {
    name: { type: String, required: true, trim: true },
    email: {
      type: String,
      required: true,
      unique: true,
      lowercase: true,
      trim: true,
    },
    // select: false means the hash is NEVER returned in queries unless
    // we explicitly ask for it (only the login check does).
    password: { type: String, required: true, minlength: 8, select: false },
    role: { type: String, enum: ["staff", "admin"], default: "staff" },
    // Lets you cut off someone's access instantly without deleting them.
    isActive: { type: Boolean, default: true },
  },
  { timestamps: true },
);

// Automatically hash the password before saving (only if it changed).
staffSchema.pre("save", async function () {
  if (!this.isModified("password")) return;
  this.password = await bcrypt.hash(this.password, 12);
});

staffSchema.methods.comparePassword = function (plain) {
  return bcrypt.compare(plain, this.password);
};

export default mongoose.model("Staff", staffSchema);
