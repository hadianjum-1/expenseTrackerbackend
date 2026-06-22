import { model, Schema } from "mongoose";

const CategorySchema = new Schema(
  {
    name: {
      type: String,
      required: true,
      trim: true,
    },
    icon: {
      type: String,
      default: "🏷️",
    },
    color: {
      type: String,
      default: "#6366f1",
    },
    userId: {
      type: Schema.Types.ObjectId,
      ref: "User",
      required: true,
    },
  },
  { timestamps: true }
);

const CategoryModel = model("Category", CategorySchema);
export default CategoryModel;
