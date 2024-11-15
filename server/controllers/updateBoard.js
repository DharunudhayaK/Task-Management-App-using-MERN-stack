const TaskList = require("../models/taskModel");
const Board = require("../models/todoModal");

const updateBoard = async (req, res) => {
  const { id } = req.params;
  const updateData = req.body;

  try {
    const updatedTask = await Board.findByIdAndUpdate(id, updateData, {
      new: true,
    });
    if (!updatedTask) {
      return res.status(404).json({ message: "Board data not found" });
    }
    return res.status(200).json({ message: "Board data updated" });
  } catch (err) {
    return res.status(400).json({ message: err.message });
  }
};

const updateTask = async (req, res) => {
  const { id } = req.params;
  const updateData = req.body;

  try {
    const updatedTask = await TaskList.findByIdAndUpdate(id, updateData, {
      new: true,
    });
    if (!updatedTask) {
      return res.status(404).json({ message: "Task not found" });
    }
    return res.status(200).json({ message: "Todo task updated" });
  } catch (err) {
    return res.status(400).json({ message: err.message });
  }
};

module.exports = {
  updateBoard,
  updateTask,
};
