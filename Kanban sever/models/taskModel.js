const mongoose = require("mongoose");
const { Schema } = mongoose;

// Define the subTask schema
const subTaskSchema = new Schema({
  message: {
    type: String,
    required: true,
  },
  isScratch: {
    type: Boolean,
    default: false,
  },
});

// Define the status schema
const statusSchema = new Schema({
  value: { type: String },
  matchingId: { type: String },
});

// Define the main task schema
const taskSchema = new Schema(
  {
    title: {
      type: String,
      required: [true, "Task title is required"],
      minlength: [1, "Task title must be at least 1 character long"],
    },
    description: {
      type: String,
    },
    subTask: {
      type: [subTaskSchema],
      validate: {
        validator: function (v) {
          return v.length > 0;
        },
        message: "Subtask array cannot be empty",
      },
    },
    parentId: { type: String },
    status: {
      type: statusSchema,
    },
  },
  {
    timestamps: true,
  }
);

// Create the model
const TaskList = mongoose.model("taskList", taskSchema);

module.exports = TaskList;
