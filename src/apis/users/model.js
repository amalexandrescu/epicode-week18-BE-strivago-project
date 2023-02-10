import mongoose, { model } from "mongoose";

const { Schema } = mongoose;

const usersSchema = new Schema(
  {
    name: { type: String, required: true },
    surname: { type: String, required: true },
    email: { type: String, required: true },
    password: { type: String, required: true },
    //if I want to implement google OAuth, then the password won't be required
    //because google doesn't share the password with us when performing OAuth
    role: { type: String, enum: ["host", "guest"], default: "guest" },
  },
  {
    timestamps: true,
  }
);

export default model("User", usersSchema);
