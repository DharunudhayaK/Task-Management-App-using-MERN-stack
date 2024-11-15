const TaskList = require("../models/taskModel");
const Board = require("../models/todoModal");

const deleteBoard = async (req, res) => {
  const { id } = req.params;
  try {
    await Board.deleteOne({ _id: id });
    return res.status(200).json({
      message: "Data removed from the collection",
    });
  } catch (err) {
    return res.status(400).json({
      message: err?.message,
    });
  }
};

const deleteTask = async (req, res) => {
  const { id } = req.params;
  try {
    await TaskList.deleteOne({ _id: id });
    return res.status(200).json({
      message: "Data removed from the collection",
    });
  } catch (err) {
    return res.status(400).json({
      message: err?.message,
    });
  }
};

module.exports = {
  deleteBoard,
  deleteTask,
};
