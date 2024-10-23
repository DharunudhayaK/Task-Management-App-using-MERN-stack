const TaskList = require("../models/taskModel");
const Board = require("../models/todoModal");

{
  /* -------------------- here main board create ----------------------------- */
}
const postBoard = async (req, res, next) => {
  console.log(req.body);
  try {
    await Board.create(req.body);
    return res.status(200).json({
      message: "Data has been posted",
    });
  } catch (err) {
    return res.status(400).json({
      message: err?.message,
    });
  }
};

const createTaskList = async (req, res, next) => {
  try {
    await TaskList.create(req.body);
    return res.status(200).json({
      message: "Task has been posted",
    });
  } catch (err) {
    return res.status(400).json({
      message: err?.message,
    });
  }
};

module.exports = {
  postBoard,
  createTaskList,
};
