import {
  Box,
  Button,
  Card,
  Checkbox,
  ClickAwayListener,
  Dialog,
  DialogContent,
  DialogContentText,
  DialogTitle,
  ListItemButton,
  MenuItem,
  Popper,
  Select,
  Stack,
  Typography,
} from "@mui/material";
import React, { useState } from "react";
import CircleIcon from "@mui/icons-material/Circle";
import { axiosPut } from "../utils/axios";
import MoreVertIcon from "@mui/icons-material/MoreVert";
import { useTheme } from "@emotion/react";
import TaskPopup from "../dialogBox/taskPopup";
import { DragDropContext, Droppable, Draggable } from "react-beautiful-dnd";
import DeleteBlog from "../dialogBox/deletePopup";

const Body = (props) => {
  const { subcontents, activeList, fetchTaskItems, onEdit } = props;
  const [isScratch, setIsScratch] = useState(false);
  const [scratchData, setScratchData] = useState({});

  function taskScratch(todo) {
    setIsScratch(true);
    setScratchData({ ...todo });
  }

  const onDragEnd = async (result) => {
    const { source, destination } = result;
    if (!destination) return;

    const sourceColumn = subcontents[source.droppableId];
    const destColumn = subcontents[destination.droppableId];

    const sourceItems = [
      ...activeList?.filter(
        (item) => String(item.status.matchingId) === String(sourceColumn._id)
      ),
    ];
    const destItems = [
      ...activeList?.filter(
        (item) => String(item.status.matchingId) === String(destColumn._id)
      ),
    ];

    const [movedItem] = sourceItems.splice(source.index, 1);
    destItems.splice(destination.index, 0, movedItem);

    movedItem.status = {
      ...(movedItem?.status ?? {}),
      value: destColumn?.taskTitle ?? "",
      matchingId: destColumn?._id ?? "",
    };
    try {
      await axiosPut(`http://localhost:7001/todo/taskList/${movedItem?._id}`, {
        status: movedItem?.status,
      });
      fetchTaskItems();
    } catch (error) {}
  };

  return (
    <Box
      sx={{
        display: "flex",
        columnGap: 4.2,
        width: "100%",
      }}
    >
      <DragDropContext onDragEnd={onDragEnd}>
        <Box
          component={"div"}
          sx={{
            display: "flex",
            columnGap: 4.2,
            ml: 1.5,
          }}
        >
          {subcontents?.map((ele, index) => {
            const { colorPalatte, taskTitle, _id } = ele;
            const matchedList = activeList?.filter(
              (list) => String(list?.status?.matchingId) === String(_id)
            );
            return (
              <Droppable key={_id} droppableId={String(index)}>
                {(provided) => (
                  <Box
                    ref={provided.innerRef}
                    {...provided.droppableProps}
                    sx={{
                      width: 280,
                      display: "flex",
                      flexDirection: "column",
                      gap: 2.5,
                    }}
                  >
                    <Stack direction={"row"} spacing={0.5}>
                      <CircleIcon
                        sx={{
                          color: colorPalatte,
                          fontSize: 18,
                        }}
                      />
                      <Typography
                        sx={{
                          color: "#828fa3",
                          fontWeight: 600,
                          fontSize: 13,
                          letterSpacing: 2,
                        }}
                      >
                        {taskTitle?.slice(0)?.toUpperCase() +
                          `(${matchedList?.length})`}
                      </Typography>
                    </Stack>
                    <Box
                      sx={{
                        border: !matchedList?.length
                          ? "2px dashed #828fa3"
                          : "",
                        height: !matchedList?.length
                          ? 420
                          : matchedList?.length < 4
                          ? 420
                          : "100%",
                        borderRadius: 2,
                        rowGap: 3,
                        display: "flex",
                        flexDirection: "column",
                      }}
                    >
                      {matchedList?.map((nestList, index) => (
                        <Draggable
                          key={nestList._id}
                          draggableId={nestList._id}
                          index={index}
                        >
                          {(provided) => (
                            <Card
                              ref={provided.innerRef}
                              {...provided.draggableProps}
                              {...provided.dragHandleProps}
                              sx={{
                                p: 2,
                                display: "flex",
                                flexDirection: "column",
                                rowGap: 2,
                                cursor: "grab",
                              }}
                              onClick={() => taskScratch(nestList)}
                            >
                              <Typography
                                sx={{
                                  fontSize: 16,
                                  fontWeight: "bold",
                                }}
                              >
                                {nestList?.title?.slice(0, 1)?.toUpperCase() +
                                  nestList?.title?.slice(1) ?? ""}
                              </Typography>
                              <Typography
                                sx={{
                                  fontSize: 14,
                                  color: "lightslategray",
                                  fontWeight: 600,
                                }}
                              >{`${
                                nestList?.subTask?.filter(
                                  (task) => task?.isScratch
                                )?.length
                              } of ${
                                nestList?.subTask?.length
                              } subtasks`}</Typography>
                            </Card>
                          )}
                        </Draggable>
                      ))}
                      {provided.placeholder}
                    </Box>
                  </Box>
                )}
              </Droppable>
            );
          })}
          <Box
            sx={{
              textAlign: "center",
              width: 250,
              height: "100vh",
              borderRadius: 2,
              display: "flex",
              justifyContent: "center",
              alignItems: "center",
              color: "lightslategray",
              mt: 3.5,
              background:
                "linear-gradient(to bottom, lightgray 0%, lightgray 5%, rgba(255, 255, 255, 0) 100%)",
              ":hover": {
                cursor: "pointer",
                color: "#635FC7",
              },
            }}
            onClick={() => onEdit(true)}
          >
            <Typography
              sx={{
                fontSize: 23,
                fontWeight: "bold",
              }}
            >
              + New Column
            </Typography>
          </Box>
        </Box>
      </DragDropContext>

      {isScratch && (
        <ScratchDialog
          data={scratchData}
          open={true}
          setIsScratch={setIsScratch}
          dropDown={subcontents?.map(({ taskTitle }) => taskTitle)}
          fetchTaskItems={fetchTaskItems}
          subcontents={subcontents}
          setScratchData={setScratchData}
        />
      )}
    </Box>
  );
};

export default Body;

function ScratchDialog(props) {
  const {
    data,
    open,
    setIsScratch,
    dropDown,
    fetchTaskItems,
    subcontents,
    setScratchData,
  } = props;

  const [eventPopper, setEventPopper] = useState(false);
  const [anchorEl, setAnchorEl] = useState(null);
  const theme = useTheme();
  const [editTask, setEditTask] = useState({});
  const [isDeleteTask, setIsDeleteTask] = useState(false);

  async function changeTaskInfo(e, info) {
    const fil = subcontents?.find((ele) => {
      if (ele?.taskTitle === e.target.value) {
        return ele;
      }
    });

    const configData = {
      ...info,
      status: {
        value: e.target.value,
        matchingId: fil?._id,
      },
    };
    updateTask(configData, configData?._id, true);
  }

  async function updateTask(config, id, bool) {
    try {
      await axiosPut(`http://localhost:7001/todo/taskList/${id}`, config);
      fetchTaskItems();
      if (bool) {
        setIsScratch(false);
      }
    } catch (err) {}
  }

  function checkedFunc(index) {
    const checkBoxBool = data?.subTask?.map((ele, ind) => {
      if (ind === index) {
        return {
          ...ele,
          isScratch: !ele?.isScratch,
        };
      }
      return { ...ele };
    });
    updateTask({ ...data, subTask: checkBoxBool }, data?._id, false);
    setScratchData({ ...data, subTask: checkBoxBool });
  }

  const actionPopper = (event) => {
    setEventPopper(!eventPopper);
    setAnchorEl(anchorEl ? null : event.currentTarget);
  };

  const editBoard = () => {
    setEditTask({
      open: true,
    });
    setEventPopper((prev) => !prev);
  };

  return (
    <>
      <Dialog
        open={open}
        onClose={() => setIsScratch(false)}
        aria-labelledby="responsive-dialog-title"
        sx={{
          px: 3,
          py: 5,
          height: isDeleteTask ? 0 : "100%",
        }}
        fullWidth
      >
        <DialogTitle
          id="responsive-dialog-title"
          sx={{
            display: "flex",
            justifyContent: "space-between",
            pb: 0.5,
          }}
        >
          <Typography
            sx={{
              fontSize: 17,
              fontWeight: 600,
            }}
          >
            {data?.title?.slice(0, 1)?.toUpperCase() + data?.title?.slice(1) ??
              ""}
          </Typography>
          <Box>
            <ListItemButton
              sx={{
                p: 0,
                borderRadius: 3.5,
              }}
            >
              <MoreVertIcon
                sx={{
                  fontSize: 35,
                  textAlign: "center",
                  color: "lightslategray",
                  cursor: "pointer",
                }}
                onClick={actionPopper}
              />
            </ListItemButton>
          </Box>
          {eventPopper && (
            <ClickAwayListener onClickAway={() => setEventPopper(false)}>
              <Popper
                open={eventPopper}
                anchorEl={anchorEl}
                placement="bottom-end"
                disablePortal={false}
                sx={{
                  zIndex: theme.zIndex ? theme.zIndex.modal : 1400,
                }}
              >
                <Box
                  sx={{
                    border: 0,
                    p: 1,
                    bgcolor: "background.paper",
                    boxShadow: 3,
                    borderRadius: 1,
                    display: "flex",
                    flexDirection: "column",
                    mt: 1.5,
                  }}
                >
                  <Button
                    sx={{ textAlign: "left", color: "lightslategray" }}
                    onClick={editBoard}
                  >
                    <Typography>Edit Board</Typography>
                  </Button>
                  <Button
                    sx={{ textAlign: "left", color: "red" }}
                    onClick={() => {
                      setIsDeleteTask(true);
                      setEventPopper(false);
                    }}
                  >
                    <Typography>Delete Board</Typography>
                  </Button>
                </Box>
              </Popper>
            </ClickAwayListener>
          )}
        </DialogTitle>
        <DialogContent
          sx={{
            py: 1,
            display: "flex",
            gap: 2,
            flexDirection: "column",
          }}
        >
          <DialogContentText
            sx={{
              fontSize: 13,
            }}
          >
            {data?.description ?? "No description"}
          </DialogContentText>
          <DialogContentText
            sx={{
              py: 1,
              display: "flex",
              flexDirection: "column",
              gap: 1,
            }}
          >
            <Typography
              sx={{
                fontSize: 14,
                fontWeight: 600,
              }}
            >{`Subtasks (${
              data?.subTask?.filter((task) => task?.isScratch)?.length
            } of ${data?.subTask?.length})`}</Typography>
            <Box
              sx={{
                display: "flex",
                flexDirection: "column",
                gap: 1.4,
              }}
            >
              {data?.subTask?.map(({ message, isScratch }, index) => (
                <Box
                  sx={{
                    display: "flex",
                    gap: 2,
                    borderRadius: 2,
                    bgcolor: "#f4f7fd",
                    cursor: "pointer",
                  }}
                  onClick={() => checkedFunc(index)}
                >
                  <Checkbox checked={isScratch} />
                  <Typography
                    sx={{
                      fontSize: 14,
                      fontWeight: 900,
                      mt: 1.3,
                      textDecoration: isScratch && "line-through",
                    }}
                  >
                    {message ?? ""}
                  </Typography>
                </Box>
              ))}
            </Box>
          </DialogContentText>
          <DialogContentText>
            <Typography
              sx={{ fontSize: 14, color: "lightslategray", fontWeight: 600 }}
            >
              Current Status
            </Typography>
            <Select
              labelId="demo-simple-select-label"
              id="demo-simple-select"
              value={data?.status?.value}
              name="status"
              sx={{
                padding: "0px 8px",
                fontSize: "14px",
                mb: 1.2,
                height: 40,
              }}
              fullWidth
              onChange={(e) => changeTaskInfo(e, data)}
            >
              {dropDown?.map((down) => (
                <MenuItem value={down}>{down}</MenuItem>
              ))}
            </Select>
          </DialogContentText>
        </DialogContent>
        {editTask?.open && (
          <TaskPopup
            open={editTask?.open}
            onClose={setEditTask}
            setIsScratch={setIsScratch}
            isEdit={true}
            status={subcontents}
            editData={data}
            fetchItems={fetchTaskItems}
          />
        )}
      </Dialog>
      {isDeleteTask && (
        <DeleteBlog
          id={data?._id}
          title={data?.title}
          setClose={setIsDeleteTask}
          open={isDeleteTask}
          getData={fetchTaskItems}
          setIsScratch={setIsScratch}
          setAnchorEl={setAnchorEl}
        />
      )}
    </>
  );
}
