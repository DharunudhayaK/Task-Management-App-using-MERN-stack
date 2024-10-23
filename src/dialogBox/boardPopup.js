import * as React from "react";
import { v4 as uuidv4 } from "uuid";
import Button from "@mui/material/Button";
import TextField from "@mui/material/TextField";
import Dialog from "@mui/material/Dialog";
import DialogActions from "@mui/material/DialogActions";
import DialogContent from "@mui/material/DialogContent";
import DialogContentText from "@mui/material/DialogContentText";
import DialogTitle from "@mui/material/DialogTitle";
import { Box, Typography } from "@mui/material";
import CloseIcon from "@mui/icons-material/Close";
import { axiosPost, axiosPut } from "../utils/axios";
import { toast } from "react-toastify";

export default function BoardPopup(props) {
  const { open, onClose, fetchTodoData, activeBoard, setAnchorEl, activeList } =
    props;
  const [title, setTitle] = React.useState("");
  const [subTitle, setSubTitle] = React.useState({
    [uuidv4()]: { value: "" },
  });

  React.useEffect(() => {
    if (
      Boolean(Object.keys(activeBoard ?? {})?.length) &&
      Boolean(activeBoard?.isEdit)
    ) {
      setTitle(activeBoard?.title);
      setSubTitle(() => {
        const data = activeBoard?.columnData.map((ele) => {
          return {
            ...ele,
            value: ele?.taskTitle,
          };
        });
        return data;
      });
    }
  }, [activeBoard]);

  const closeSubTextfield = (key) => {
    const updatedSubTitle = { ...subTitle };
    delete updatedSubTitle[key];
    setSubTitle(updatedSubTitle);
  };

  const handleBoardTitle = (e) => {
    setTitle(e.target.value);
  };

  const handleSubtitle = (e, key) => {
    setSubTitle((prevState) => ({
      ...prevState,
      [key]: {
        ...(prevState[key] ?? {}),
        value: e.target.value,
      },
    }));
  };

  const addNewColumn = () => {
    const newKey = uuidv4();
    setSubTitle((prevState) => ({
      ...(prevState ?? {}),
      [newKey]: {
        value: "",
      },
    }));
  };

  const handleAddBoard = async () => {
    const structuredSubContent = Object.entries(subTitle).map(
      ([key, value]) => {
        return {
          colorPalatte: randomHexColorCode(),
          taskTitle: value.value,
        };
      }
    );
    try {
      const postingResponse = await axiosPost(
        "http://localhost:7001/todo/boardList",
        {
          title: title,
          columns: structuredSubContent,
        }
      );
      toast.success(postingResponse?.data?.message, {
        autoClose: 500,
      });
      fetchTodoData();
      onClose((prev) => ({
        ...(prev ?? {}),
        open: false,
      }));
    } catch (err) {
      console.log(err);
    }
  };

  const updateBoard = async () => {
    const data = [];
    Object.entries(subTitle ?? {}).forEach(([key, values]) => {
      data.push({
        colorPalatte: values?.colorPalatte || randomHexColorCode(),
        taskTitle: values?.value,
        _id: values?._id,
      });
    });

    try {
      await axiosPut(
        `http://localhost:7001/todo/updateBoard/${activeBoard?.id}`,
        {
          title,
          columns: data,
        }
      );

      fetchTodoData();
      onClose((prev) => ({
        ...(prev ?? {}),
        open: false,
      }));
      setAnchorEl(null);
    } catch (err) {
      console.error("Error updating board:", err);
    }

    try {
      await Promise.all(
        activeList?.map(async (ele) => {
          const findValue = data.find(
            (item) => item?._id === ele?.status?.matchingId
          );
          if (findValue) {
            const config = {
              ...ele,
              status: {
                ...ele?.status,
                value: findValue?.taskTitle,
              },
            };

            await axiosPut(
              `http://localhost:7001/todo/taskList/${config?._id}`,
              config
            );
          }
        })
      );
    } catch (err) {
      console.error("Error updating task list:", err);
    }
  };

  const randomHexColorCode = () => {
    let n = (Math.random() * 0xfffff * 1000000).toString(16);
    return "#" + n?.slice(0, 6);
  };

  return (
    <Dialog
      open={open}
      onClose={() => {
        onClose((prev) => ({
          ...(prev ?? {}),
          open: false,
        }));
        if (activeBoard?.isEdit) {
          setAnchorEl(null);
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
        {activeBoard?.isEdit ? "Edit Board" : "Add New Board"}
      </DialogTitle>
      <DialogContent
        sx={{
          py: 1,
        }}
      >
        <DialogContentText>
          <Typography sx={{ fontSize: 14 }}>Name</Typography>
          <TextField
            id="outlined-basic"
            variant="outlined"
            fullWidth
            onChange={handleBoardTitle}
            inputProps={{
              style: {
                padding: "10px 8px",
                fontSize: "14px",
                alignItems: "center",
              },
            }}
            value={title}
          />
        </DialogContentText>
        <DialogContentText
          sx={{
            py: 1,
          }}
        >
          <Typography sx={{ fontSize: 14 }}>Columns</Typography>
          {Boolean(Object.keys(subTitle)?.length) &&
            Object.entries(subTitle ?? {})?.map(([key, value]) => {
              return (
                <Box
                  component={"div"}
                  sx={{ display: "flex", gap: 0.2 }}
                  key={key}
                >
                  <TextField
                    id={`outlined-basic-${key}`}
                    value={value?.value ?? ""}
                    variant="outlined"
                    fullWidth
                    sx={{
                      py: 1,
                    }}
                    onChange={(e) => handleSubtitle(e, key)}
                    inputProps={{
                      style: {
                        padding: "10px 8px",
                        fontSize: "14px",
                        alignItems: "center",
                      },
                    }}
                  />
                  {Object.keys(subTitle).length > 1 && (
                    <CloseIcon
                      sx={{
                        fontSize: 35,
                        color: "lightslategray",
                        cursor: "pointer",
                        fontWeight: 600,
                        mt: 2,
                      }}
                      onClick={() => closeSubTextfield(key)}
                    />
                  )}
                </Box>
              );
            })}
        </DialogContentText>
      </DialogContent>
      <DialogActions
        sx={{
          display: "flex",
          flexDirection: "column",
          rowGap: 2,
          px: 3,
          py: 4,
          pt: 0,
        }}
      >
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
          }}
        >
          + Add New Column
        </Button>
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
          }}
          onClick={activeBoard?.isEdit ? updateBoard : handleAddBoard}
        >
          {!activeBoard?.isEdit ? "Create New Board" : "Update changes"}
        </Button>
      </DialogActions>
    </Dialog>
  );
}
