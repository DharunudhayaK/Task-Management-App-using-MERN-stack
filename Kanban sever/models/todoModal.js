const mongoose = require("mongoose");
const { Schema } = mongoose;

// Board Schema
const boardSchema = new Schema(
  {
    title: {
      type: String,
      required: [true, "Board title is required"],
    },
    columns: [
      {
        taskTitle: {
          type: String,
          required: true,
        },
        colorPalatte: { type: String, required: true },
      },
    ],
  },
  {
    timestamps: true,
  }
);

const Board = mongoose.model("sample", boardSchema);

module.exports = Board;
