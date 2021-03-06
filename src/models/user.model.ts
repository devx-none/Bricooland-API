import mongoose from "mongoose";
import bcrypt from "bcrypt";
import config from "config";
import { Roles } from "../../config/constant";


export interface UserInput {
  // id: mongoose.Types.ObjectId;
  email: string;
  password: string;
  role: Roles;
  handyman: mongoose.Types.ObjectId | null;
  customer: mongoose.Types.ObjectId | null;
  
}

export interface UserDocument extends UserInput, mongoose.Document {
  createdAt: Date;
  updatedAt: Date;
  comparePassword(candidatePassword: string): Promise<Boolean>;
}

const userSchema = new mongoose.Schema(
  {
    id: { type: String },
    email: { type: String, required: true, unique: true },
    password: { type: String, required: true },
    role: {
      type: String,
      enum: ["customer", "handyman"],
      default: "customer",
    },
    customer: { type: mongoose.Schema.Types.ObjectId, ref: "Customer" },
    handyman: { type: mongoose.Schema.Types.ObjectId, ref: "Handyman" },
  },

  {
    timestamps: true,
  }
);

// userSchema.pre("save", async function (next) {
//   let user = this as UserDocument;

//   if (!user.isModified("password")) {
//     return next();
//   }

//   const salt = await bcrypt.genSalt(config.get<number>("saltWorkFactor"));

//   const hash = await bcrypt.hashSync(user.password, salt);

//   user.password = hash;

//   return next();
// });

userSchema.methods.comparePassword = async function (
  candidatePassword: string
): Promise<boolean> {
  const user = this as UserDocument;

  return bcrypt.compare(candidatePassword, user.password).catch((e) => false);
};

const UserModel = mongoose.model<UserDocument>("User", userSchema);

export default UserModel;
