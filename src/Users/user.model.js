import { model, Schema } from "mongoose";
import bcrypt from "bcrypt";

const UserSchema = new Schema(
  {
    Name: {
      type: String,
      required: true,
      lowercase: true,
      trim: true,
    },
    Email: {
      type: String,
      required: true,
      trim: true,
      unique: true,
      lowercase: true,
    },
    Phone: {
      type: String,
      required: true,
      trim: true,
    },
    password: {
      type: String,
      required: true,
      trim: true,
    },
      otp: {
    type: String,
    default: null,
  },
  isVerified: {
  type: Boolean,
  default: false,
},
    Status: {
      type: Boolean,
      default: false,
    },
    Role: {
      type: String,
      default: "user",
      enum: ["user"],
    },
    avatar: {
      type: String,
      default: "",
    },
  },
  { timestamps: true }
);

UserSchema.pre("save", async function () {
  if (!this.isModified("password")) return;

  this.password = await bcrypt.hash(this.password, 10);
});

UserSchema.methods.comparePassword = async function (password) {
  return await bcrypt.compare(password, this.password);
};

const Usermodel = model("User", UserSchema);

export default Usermodel;
