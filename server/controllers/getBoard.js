const TaskList = require("../models/taskModel");
const Board = require("../models/todoModal");

const getBoard = async (req, res, next) => {
  try {
    const data = await Board.find({});
    return res.status(200).json({
      message: data,
    });
  } catch (err) {
    return res.status(400).json({
      message: err?.message,
    });
  }
};

const getTaskList = async (req, res, next) => {
  try {
    const data = await TaskList.find({});
    return res.status(200).json({
      message: data,
    });
  } catch (err) {
    return res.status(400).json({
      message: err?.message,
    });
  }
};

module.exports = {
  getBoard,
  getTaskList,
};
