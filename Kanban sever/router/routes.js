const express = require("express");
const { getBoard, getTaskList } = require("../controllers/getBoard");
const { postBoard, createTaskList } = require("../controllers/createBoard");
const { deleteBoard, deleteTask } = require("../controllers/deleteBoard");
const { updateTask, updateBoard } = require("../controllers/updateBoard");
const router = express.Router();

// board routes
router.route("/boardList").get(getBoard).post(postBoard);
router.route("/updateBoard/:id").put(updateBoard).delete(deleteBoard);

// task routes
router.route("/taskList").post(createTaskList).get(getTaskList);
router.route("/taskList/:id").put(updateTask).delete(deleteTask);

module.exports = router;
