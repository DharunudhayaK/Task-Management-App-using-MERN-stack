import {
  Box,
  Button,
  Dialog,
  DialogContent,
  DialogContentText,
  DialogTitle,
  MenuItem,
  Select,
  Stack,
  TextField,
  Typography,
} from "@mui/material";
import React, { useEffect, useState } from "react";
import { v4 as uuidv4 } from "uuid";
import CloseIcon from "@mui/icons-material/Close";
import { axiosPost, axiosPut } from "../utils/axios";
import { toast } from "react-toastify";

const TaskPopup = ({
  onClose,
  open,
  status,
  id,
  fetchItems,
  setIsScratch,
  isEdit,
  editData,
}) => {
  const [subTitle, setSubTitle] = React.useState({
    [uuidv4()]: { message: "", isScratch: false },
  });
  const [taskInfos, setTaskInfos] = useState({});

  const closeSubTextfield = (key) => {
    const updatedSubTitle = { ...subTitle };
    delete updatedSubTitle[key];
    setSubTitle(updatedSubTitle);
  };

  const handleSubtitle = (e, key) => {
    setSubTitle((prevState) => ({
      ...prevState,
      [key]: {
        ...prevState[key],
        message: e.target.value,
      },
    }));
  };

  useEffect(() => {
    if (isEdit && editData) {
      setTaskInfos({
        title: editData?.title || "",
        description: editData?.description || "",
        status: editData?.status?.value || "",
      });

      if (editData?.subTask?.length) {
        const subTaskMap = editData.subTask.reduce((acc, sub, idx) => {
          acc[uuidv4()] = {
            message: sub?.message,
            isScratch: sub?.isScratch,
            _id: sub?._id,
          };
          return acc;
        }, {});
        setSubTitle(subTaskMap);
      }
    }
  }, [isEdit, editData]);

  const addNewColumn = () => {
    const newKey = uuidv4();
    setSubTitle((prevState) => ({
      ...prevState,
      [newKey]: {
        message: "",
        isScratch: false,
      },
    }));
  };

  const handleTaskInfo = (e) => {
    const { value, name } = e.target;
    setTaskInfos((prevState) => ({
      ...(prevState ?? {}),
      [name]: value,
    }));
  };

  const createNewTask = async () => {
    const subTask = Object.entries(subTitle ?? {})?.map(([key, value]) => {
      return value;
    });
    const configData = {
      ...taskInfos,
      subTask,
      parentId: id,
    };
    try {
      const postedData = await axiosPost(
        "http://localhost:7001/todo/taskList",
        configData
      );
      toast.success(postedData?.data?.message, {
        autoClose: 1000,
      });
      fetchItems();
      onClose((prev) => ({
        ...(prev ?? {}),
        open: false,
      }));
      if (isEdit) {
        setIsScratch(false);
      }
    } catch (err) {}
  };

  const handleSelectInfo = (e) => {
    const { value, name } = e.target;
    const findId = status.find(({ taskTitle, _id }) => {
      if (taskTitle === value) {
        return _id;
      }
    })?._id;
    setTaskInfos((prevState) => ({
      ...(prevState ?? {}),
      status: {
        value,
        matchingId: findId,
      },
    }));
  };

  const updateTask = async () => {
    const data = [];
    for (const obj of Object.values(subTitle)) {
      data.push({
        ...obj,
      });
    }
    const config = {
      ...editData,
      description: taskInfos?.description,
      title: taskInfos?.title,
      subTask: data,
      status: taskInfos?.status,
    };
    try {
      await axiosPut(
        `http://localhost:7001/todo/taskList/${config?._id}`,
        config
      );
      fetchItems();
      onClose((prev) => ({
        ...(prev ?? {}),
        open: false,
      }));
      if (isEdit) {
        setIsScratch(false);
      }
    } catch (err) {}
  };

  return (
    <Dialog
      open={open}
      onClose={() => {
        onClose((prev) => ({
          ...(prev ?? {}),
          open: false,
        }));
        if (isEdit) {
          setIsScratch(false);
        }
      }}
      aria-labelledby="responsive-dialog-title"
      sx={{
        px: 3,
        py: 2,
      }}
      fullWidth
    >
      <DialogTitle
        id="responsive-dialog-title"
        sx={{
          fontSize: 16,
          fontWeight: 600,
        }}
      >
        {isEdit ? "Edit task" : "Add New Task"}
      </DialogTitle>
      <DialogContent
        sx={{
          py: 1,
        }}
      >
        <DialogContentText>
          <Typography
            sx={{
              fontSize: 14,
            }}
          >
            Title
          </Typography>
          <TextField
            id="outlined-basic"
            variant="outlined"
            name="title"
            fullWidth
            inputProps={{
              style: {
                padding: "8px 8px",
                fontSize: "14px",
                alignItems: "center",
              },
            }}
            value={taskInfos?.title}
            onChange={handleTaskInfo}
          />
        </DialogContentText>
        <DialogContentText>
          <Typography
            sx={{
              fontSize: 14,
            }}
          >
            Description
          </Typography>
          <TextField
            id="outlined-basic"
            variant="outlined"
            fullWidth
            multiline
            rows={3}
            name="description"
            value={taskInfos?.description}
            onChange={handleTaskInfo}
          />
        </DialogContentText>
        <DialogContentText
          sx={{
            py: 1,
          }}
        >
          <Typography
            sx={{
              fontSize: 14,
            }}
          >
            Subtasks
          </Typography>
          {Object.entries(subTitle).map(([key, value]) => (
            <Box component={"div"} sx={{ display: "flex", gap: 0.2 }} key={key}>
              <TextField
                id={`outlined-basic-${key}`}
                value={value?.message}
                variant="outlined"
                name="subtask"
                fullWidth
                sx={{
                  py: 1,
                }}
                inputProps={{
                  style: {
                    padding: "10px 8px",
                    fontSize: "14px",
                    alignItems: "center",
                  },
                }}
                onChange={(e) => handleSubtitle(e, key)}
              />
              {Object.keys(subTitle)?.length > 1 && (
                <CloseIcon
                  sx={{
                    fontSize: 25,
                    color: "lightslategray",
                    cursor: "pointer",
                    fontWeight: 600,
                    mt: 2,
                  }}
                  onClick={() => closeSubTextfield(key)}
                />
              )}
            </Box>
          ))}
        </DialogContentText>
        <Button
          autoFocus
          onClick={addNewColumn}
          fullWidth
          variant="outlined"
          sx={{
            p: 0.6,
            borderRadius: 20,
            boxShadow: "none",
            background: "#f0effa",
            ":hover": {
              bgcolor: "#f0effa",
              border: "none",
            },
            fontWeight: 600,
            fontSize: 14,
            textTransform: "none",
            border: "none",
            color: "#635fc7",
            mx: "auto",
            mb: 1.5,
          }}
        >
          + Add New Subtask
        </Button>
        <Stack direction={"column"} gap={1}>
          <Typography
            sx={{
              fontSize: 14,
              color: "lightslategray",
            }}
          >
            Status
          </Typography>
          <Select
            labelId="demo-simple-select-label"
            id="demo-simple-select"
            value={taskInfos?.status}
            name="status"
            sx={{
              padding: "0px 8px",
              fontSize: "14px",
              mb: 1.2,
              height: 40,
            }}
            fullWidth
            onChange={(e) => handleSelectInfo(e)}
          >
            {status?.map(({ taskTitle }) => (
              <MenuItem value={taskTitle}>{taskTitle}</MenuItem>
            ))}
          </Select>
        </Stack>
        <Button
          autoFocus
          fullWidth
          variant="contained"
          sx={{
            p: 0.6,
            borderRadius: 20,
            boxShadow: "none",
            background: "#635FC7",
            ":hover": {
              bgcolor: "#635FC7",
            },
            fontWeight: 600,
            fontSize: 14,
            textTransform: "none",
            mx: "auto",
            mb: 1.5,
          }}
          onClick={isEdit ? updateTask : createNewTask}
        >
          {isEdit ? "Update changes" : "Create New Board"}
        </Button>
      </DialogContent>
    </Dialog>
  );
};

export default TaskPopup;
