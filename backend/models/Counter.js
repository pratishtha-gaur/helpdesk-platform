import mongoose from "mongoose";

// A tiny collection that just stores "the last number used" for each
// sequence we need (right now, just tickets). One document, one field.
const counterSchema = new mongoose.Schema({
  name: { type: String, required: true, unique: true }, // e.g. "ticket"
  value: { type: Number, default: 0 },
});

const Counter = mongoose.model("Counter", counterSchema);

/**
 * Atomically increments and returns the next number for a given sequence.
 *
 * "Atomic" means: even if two requests call this at the EXACT same
 * millisecond, MongoDB guarantees each gets a different number —
 * no duplicates, no race conditions. This is done using
 * findOneAndUpdate with $inc (increment), which MongoDB executes
 * as a single, uninterruptible database operation.
 */
export async function getNextSequence(name) {
  const counter = await Counter.findOneAndUpdate(
    { name },
    { $inc: { value: 1 } }, // increase "value" by 1
    { new: true, upsert: true } // upsert = create it if it doesn't exist yet
  );
  return counter.value;
}
