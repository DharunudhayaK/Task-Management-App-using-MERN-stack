import { useEffect, useState } from "react";
import Box from "@mui/material/Box";
import Drawer from "@mui/material/Drawer";
import CssBaseline from "@mui/material/CssBaseline";
import AppBar from "@mui/material/AppBar";
import Toolbar from "@mui/material/Toolbar";
import List from "@mui/material/List";
import Typography from "@mui/material/Typography";
import Divider from "@mui/material/Divider";
import ListItem from "@mui/material/ListItem";
import ListItemButton from "@mui/material/ListItemButton";
import ListItemIcon from "@mui/material/ListItemIcon";
import ListItemText from "@mui/material/ListItemText";
import ViewKanbanIcon from "@mui/icons-material/ViewKanban";
import { Button, ClickAwayListener, Popper, Stack } from "@mui/material";
import MoreVertIcon from "@mui/icons-material/MoreVert";
import ViewSidebarIcon from "@mui/icons-material/ViewSidebar";
import BoardPopup from "./dialogBox/boardPopup";
import Body from "./component/body";
import TaskPopup from "./dialogBox/taskPopup";
import { axiosGet } from "./utils/axios";
import { toast, ToastContainer } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";
import { useTheme } from "@emotion/react";
import DeleteBlog from "./dialogBox/deletePopup";
import { IoEyeOffOutline } from "react-icons/io5";
import { IoIosEye } from "react-icons/io";
import ArrowDropUpIcon from "@mui/icons-material/ArrowDropUp";
import ArrowDropDownIcon from "@mui/icons-material/ArrowDropDown";

export default function App() {
  const theme = useTheme();
  const [activeBoard, setActiveBoard] = useState({});
  const [taskPopup, setTaskPopup] = useState({});
  const [boardPopup, setBoardPopup] = useState({});
  const [blogData, setBlogData] = useState({});
  const [taskData, setTaskData] = useState({});
  const [activeTask, setActiveTask] = useState({});
  const [eventPopper, setEventPopper] = useState(false);
  const [anchorEl, setAnchorEl] = useState(null);
  const [isBoardDelete, setIsBoardDelete] = useState(false);
  const [isSidebarOpen, setIsSidebarOpen] = useState(true);
  const [windowSize, setWindowSize] = useState({});
  const [tabSidebar, setTabSidebar] = useState(true);
  const [secAnchor, setSecAnchor] = useState(null);

  const fetchTodoData = async () => {
    setBlogData((prevData) => ({
      ...(prevData ?? {}),
      loader: true,
    }));
    try {
      const {
        data: { message },
      } = await axiosGet("http://localhost:7001/todo/boardList");
      setBlogData((prevData) => ({
        ...(prevData ?? {}),
        loader: false,
        data: message ?? [],
      }));
      toast.success("Fetched Success", {
        autoClose: 800,
      });
      setActiveBoard({
        index: 0,
        columnData: message[0]?.columns,
        title: message[0]?.title,
        id: message[0]?._id,
        isEdit: false,
      });
    } catch (err) {}
  };

  const fetchTaskItems = async () => {
    setTaskData((prevData) => ({
      ...(prevData ?? {}),
      loader: true,
    }));
    try {
      const {
        data: { message },
      } = await axiosGet("http://localhost:7001/todo/taskList");
      setTaskData((prevData) => ({
        ...(prevData ?? {}),
        loader: false,
        list: message ?? [],
      }));
    } catch (err) {}
  };

  useEffect(() => {
    fetchTodoData();
    fetchTaskItems();
  }, []);

  useEffect(() => {
    setActiveTask(() => {
      const filterData = taskData?.list?.map((ele) => {
        if (ele?.parentId === activeBoard?.id) {
          return { ...ele };
        }
      });
      return filterData ?? [];
    });
  }, [activeBoard, taskData]);

  const handleActiveBoard = (obj, index, title, id) => {
    setActiveBoard({
      index,
      columnData: obj?.columns,
      title,
      id,
      isEdit: false,
    });
  };

  const actionPopper = (event) => {
    setEventPopper(!eventPopper);
    setAnchorEl(anchorEl ? null : event.currentTarget);
  };

  const editBoard = (bool) => {
    setBoardPopup({
      open: true,
    });
    if (!bool) {
      setEventPopper((prev) => !prev);
    }
    setActiveBoard((prevState) => ({
      ...(prevState ?? {}),
      isEdit: true,
    }));
  };

  useEffect(() => {
    const handleResize = () => {
      setWindowSize({
        width: window.innerWidth,
        height: window.innerHeight,
      });
    };
    window.addEventListener("resize", handleResize);
    return () => {
      window.removeEventListener("resize", handleResize);
    };
  }, []);

  console.log(windowSize);

  return (
    <Box sx={{ display: "flex", width: "100%" }}>
      <CssBaseline />

      {/* -------------- Nav bar ------------- */}
      <AppBar
        position="fixed"
        sx={{
          width: `calc(100%)`,
          background: "#FFFF",
          color: "black",
          boxShadow: "none",
          zIndex: (theme) => theme.zIndex.drawer + 1,
          borderBottom: "1px solid lightgray",
          p: {
            md: 0,
            sm: 1,
          },
        }}
      >
        <Box
          component={"div"}
          sx={{
            display: "flex",
            justifyContent: {
              sm: "space-between",
            },
          }}
        >
          <Toolbar
            sx={{
              display: "flex",
              columnGap: 1,
              width: {
                lg: "22%",
                md: "32%",
                sm: "100%",
              },
              borderRight: { md: "1px solid lightgray", sm: "0px" },
              py: {
                md: 2.8,
                sm: 1,
              },
              gap: {
                sm: 2,
              },
            }}
          >
            <ViewKanbanIcon
              sx={{
                fontSize: 30,
                color: "violet",
              }}
            />
            <Typography
              variant="h4"
              noWrap
              component="div"
              sx={{
                fontWeight: 700,
                fontSize: {
                  sm: 25,
                },
              }}
            >
              {windowSize?.width && windowSize?.width > 900
                ? "Kanban"
                : windowSize?.width
                ? activeBoard?.title
                    ?.split(" ")
                    ?.map(
                      (ele) => ele?.slice(0, 1)?.toUpperCase() + ele?.slice(1)
                    )
                    ?.join(" ")
                : "Kanban"}
            </Typography>
            {windowSize?.width < 900 &&
              takeicon(setTabSidebar, tabSidebar, setSecAnchor, secAnchor)}
          </Toolbar>

          <Toolbar
            sx={{
              display: "flex",
              justifyContent: "space-between",
              width: {
                md: "75%",
                sm: "30%",
              },
            }}
          >
            <Typography
              variant="h5"
              noWrap
              component="div"
              sx={{
                fontWeight: 600,
                visibility: {
                  sm: "hidden",
                  md: "visible",
                },
              }}
            >
              {activeBoard?.title
                ?.split(" ")
                ?.map((ele) => ele?.slice(0, 1)?.toUpperCase() + ele?.slice(1))
                ?.join(" ")}
            </Typography>
            <Box
              component={"div"}
              sx={{
                display: "flex",
                gap: 2,
              }}
            >
              <Button
                variant="contained"
                sx={{
                  borderRadius: 20,
                  boxShadow: "none",
                  background: "#635FC7",
                  ":hover": {
                    bgcolor: "#635FC7",
                  },
                  fontWeight: {
                    sm: "bold",
                    md: 600,
                  },
                  fontSize: {
                    md: 15,
                    sm: 26,
                  },
                  textTransform: "none",
                  p: {
                    sm: 0,
                    md: 1,
                  },
                  height: {
                    sm: 35,
                  },
                  mt: {
                    sm: 1,
                  },
                }}
                onClick={() =>
                  setTaskPopup({
                    open: true,
                  })
                }
              >
                {windowSize?.width < 900 ? "+" : "+ Add New Task"}
              </Button>
              <ListItemButton
                sx={{
                  p: 0,
                  borderRadius: 5,
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
          </Toolbar>
        </Box>
      </AppBar>

      <Box
        sx={{
          display: "flex",
          width: "100%",
          height: "100vh",
        }}
      >
        <Drawer
          sx={{
            flexShrink: 0,
            width: {
              lg: isSidebarOpen ? "22%" : 0,
              md: isSidebarOpen ? "30%" : 0,
            },
            "& .MuiDrawer-paper": {
              width: {
                lg: isSidebarOpen ? "22%" : 0,
                md: isSidebarOpen ? "30%" : 0,
              },
              boxSizing: "border-box",
              overflow: "hidden",
              transition: "width 0.3s",
              top: 65,
              left: 0,
              zIndex: (theme) => theme.zIndex.drawer,
              borderTop: "0px",
              p: 0.2,
              pl: 0,
              visibility: {
                sm: "hidden",
                md: "visible",
              },
            },
          }}
          variant="permanent"
          anchor="left"
          open={isSidebarOpen}
        >
          <List
            sx={{
              display: "flex",
              flexDirection: "column",
              justifyContent: "space-between",
              height: "calc(100% - 60px)",
            }}
          >
            <Box
              sx={{
                display: "flex",
                flexDirection: "column",
              }}
            >
              <Typography
                sx={{
                  color: "#828fa3",
                  fontWeight: 700,
                  p: 2,
                  fontSize: 15,
                  letterSpacing: 3,
                }}
              >
                {`ALL BOARDS (${blogData?.data?.length})`}
              </Typography>
              <Box component={"div"}>
                {Boolean(blogData?.data?.length) &&
                  blogData?.data?.map(({ title, _id, ...rest }, index) => (
                    <ListItem
                      key={_id}
                      disablePadding
                      sx={{
                        py: 1,
                      }}
                      onClick={() => handleActiveBoard(rest, index, title, _id)}
                    >
                      <ListItemButton
                        sx={{
                          borderTopRightRadius: 40,
                          borderBottomRightRadius: 40,
                          background:
                            activeBoard?.index === index ? "#635FC7" : "#FFFFF",
                          color:
                            activeBoard?.index === index
                              ? "#FFFF"
                              : "lightslategray",
                          ":hover": {
                            background:
                              activeBoard?.index === index
                                ? "#635FC7"
                                : "#FFFFF",
                          },
                          fontWeight: "bold",
                        }}
                      >
                        <ListItemIcon>
                          <ViewSidebarIcon
                            sx={{
                              color:
                                activeBoard?.index === index ? "#FFFF" : "",
                            }}
                          />
                        </ListItemIcon>
                        <ListItemText
                          primary={title
                            ?.split(" ")
                            ?.map(
                              (ele) =>
                                ele?.slice(0, 1)?.toUpperCase() + ele?.slice(1)
                            )
                            ?.join(" ")}
                        />
                      </ListItemButton>
                    </ListItem>
                  ))}
              </Box>
            </Box>
            <Box
              sx={{
                display: "flex",
                flexDirection: "column",
              }}
            >
              <ListItem
                disablePadding
                onClick={() => {
                  setBoardPopup({
                    open: true,
                  });
                  setActiveBoard((prev) => ({
                    ...(prev ?? {}),
                    isEdit: false,
                  }));
                }}
              >
                <ListItemButton
                  sx={{
                    borderTopRightRadius: 40,
                    borderBottomRightRadius: 40,
                  }}
                >
                  <ListItemIcon>
                    <ViewSidebarIcon
                      sx={{
                        color: "#635fc7",
                      }}
                    />
                  </ListItemIcon>
                  <Button
                    variant="text"
                    sx={{
                      borderRadius: 20,
                      boxShadow: "none",
                      background: "#FFFF",
                      ":hover": {
                        bgcolor: "none",
                      },
                      fontWeight: 600,
                      fontSize: 17,
                      textTransform: "none",
                      color: "#635fc7",
                    }}
                  >
                    + Create New Board
                  </Button>{" "}
                </ListItemButton>
              </ListItem>
              <Stack
                direction={"row"}
                spacing={2}
                sx={{
                  p: 2,
                  width: "70%",
                  mx: "auto",
                  color: "lightslategray",
                  ":hover": {
                    cursor: "pointer",
                    color: "lightgray",
                  },
                }}
                onClick={() => setIsSidebarOpen(false)}
              >
                <IoEyeOffOutline size={22} />
                <Typography
                  sx={{
                    fontSize: 16,
                    fontWeight: "bold",
                  }}
                >
                  Hide Sidebar
                </Typography>
              </Stack>
            </Box>
          </List>
        </Drawer>

        <Box
          component="main"
          sx={{
            flexGrow: 1,
            px: 3,
            background: "#F4F7FD",
            transition: "width 0.3s",
            overflowX: "scroll",
            height: "calc(100% - 0px)",
            "&::-webkit-scrollbar": {
              width: "6px",
              height: "7px",
            },
            "&::-webkit-scrollbar-thumb": {
              backgroundColor: "#635FC7",
              borderRadius: "4px",
            },
            "&::-webkit-scrollbar-thumb:hover": {
              backgroundColor: "#5048A5",
            },
            "&::-webkit-scrollbar-track": {
              background: "#F4F7FD",
            },
            width: "100%",
          }}
        >
          <Toolbar
            sx={{
              paddingBottom: {
                sm: 14,
                md: 12,
              },
            }}
          />
          {activeBoard?.columnData?.length && (
            <Body
              subcontents={activeBoard?.columnData}
              activeList={activeTask?.filter(
                (ele) => ele?.parentId === activeBoard?.id
              )}
              fetchTaskItems={fetchTaskItems}
              onEdit={editBoard}
            />
          )}
        </Box>
      </Box>

      {!isSidebarOpen && (
        <Box
          sx={{
            position: "absolute",
            top: "80%",
            width: "5%",
            zIndex: 1300,
            cursor: "pointer",
            background: "#635FC7",
            borderTopRightRadius: 15,
            borderBottomRightRadius: 15,
            color: "#FFFF",
            display: "flex",
            justifyContent: "center",
            alignItems: "center",
            p: 1.5,
            visibility: {
              sm: windowSize?.width < 900 ? "hidden" : "visible",
            },
          }}
          onClick={() => setIsSidebarOpen((prev) => !prev)}
        >
          <IoIosEye size={25} />
        </Box>
      )}

      {/* ---------- Popup for new Board ---------- */}
      {boardPopup?.open && (
        <BoardPopup
          open={boardPopup?.open}
          onClose={setBoardPopup}
          fetchTodoData={fetchTodoData}
          activeBoard={activeBoard}
          setAnchorEl={setAnchorEl}
          activeList={activeTask?.filter(
            (ele) => ele?.parentId === activeBoard?.id
          )}
        />
      )}
      {/* ----------- Popup for new Task list ----------- */}
      {taskPopup?.open && (
        <TaskPopup
          onClose={setTaskPopup}
          open={taskPopup?.open}
          status={activeBoard?.columnData}
          id={activeBoard?.id}
          fetchItems={fetchTaskItems}
          isEdit={false}
        />
      )}

      {/* -------------- event Poper --------------- */}
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
                  setIsBoardDelete((prev) => !prev);
                  setEventPopper(false);
                }}
              >
                <Typography>Delete Board</Typography>
              </Button>
            </Box>
          </Popper>
        </ClickAwayListener>
      )}

      {tabSidebar && windowSize?.width < 900 && (
        <ClickAwayListener onClickAway={() => setTabSidebar((prev) => !prev)}>
          <Popper
            open={tabSidebar}
            anchorEl={secAnchor}
            placement="bottom-end"
            disablePortal={false}
            sx={{
              zIndex: theme.zIndex ? theme.zIndex.modal : 1300,
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
              <List
                sx={{
                  display: "flex",
                  flexDirection: "column",
                  justifyContent: "space-between",
                  height: "calc(100% - 60px)",
                }}
              >
                <Box
                  sx={{
                    display: "flex",
                    flexDirection: "column",
                  }}
                >
                  <Typography
                    sx={{
                      color: "#828fa3",
                      fontWeight: 700,
                      p: 2,
                      fontSize: 15,
                      letterSpacing: 3,
                    }}
                  >
                    {`ALL BOARDS (${blogData?.data?.length})`}
                  </Typography>
                  <Box component={"div"}>
                    {Boolean(blogData?.data?.length) &&
                      blogData?.data?.map(({ title, _id, ...rest }, index) => (
                        <ListItem
                          key={_id}
                          disablePadding
                          sx={{
                            py: 1,
                          }}
                          onClick={() =>
                            handleActiveBoard(rest, index, title, _id)
                          }
                        >
                          <ListItemButton
                            sx={{
                              borderTopRightRadius: 40,
                              borderBottomRightRadius: 40,
                              background:
                                activeBoard?.index === index
                                  ? "#635FC7"
                                  : "#FFFFF",
                              color:
                                activeBoard?.index === index
                                  ? "#FFFF"
                                  : "lightslategray",
                              ":hover": {
                                background:
                                  activeBoard?.index === index
                                    ? "#635FC7"
                                    : "#FFFFF",
                              },
                              fontWeight: "bold",
                            }}
                          >
                            <ListItemIcon>
                              <ViewSidebarIcon
                                sx={{
                                  color:
                                    activeBoard?.index === index ? "#FFFF" : "",
                                }}
                              />
                            </ListItemIcon>
                            <ListItemText
                              primary={title
                                ?.split(" ")
                                ?.map(
                                  (ele) =>
                                    ele?.slice(0, 1)?.toUpperCase() +
                                    ele?.slice(1)
                                )
                                ?.join(" ")}
                            />
                          </ListItemButton>
                        </ListItem>
                      ))}
                  </Box>
                </Box>
                <Box
                  sx={{
                    display: "flex",
                    flexDirection: "column",
                  }}
                >
                  <ListItem
                    disablePadding
                    onClick={() => {
                      setBoardPopup({
                        open: true,
                      });
                      setActiveBoard((prev) => ({
                        ...(prev ?? {}),
                        isEdit: false,
                      }));
                      setTabSidebar((prev) => !prev);
                    }}
                  >
                    <ListItemButton
                      sx={{
                        borderTopRightRadius: 40,
                        borderBottomRightRadius: 40,
                      }}
                    >
                      <ListItemIcon>
                        <ViewSidebarIcon
                          sx={{
                            color: "#635fc7",
                          }}
                        />
                      </ListItemIcon>
                      <Button
                        variant="text"
                        sx={{
                          borderRadius: 20,
                          boxShadow: "none",
                          background: "#FFFF",
                          ":hover": {
                            bgcolor: "none",
                          },
                          fontWeight: 600,
                          fontSize: 17,
                          textTransform: "none",
                          color: "#635fc7",
                        }}
                      >
                        + Create New Board
                      </Button>
                    </ListItemButton>
                  </ListItem>
                </Box>
              </List>
            </Box>
          </Popper>
        </ClickAwayListener>
      )}

      {isBoardDelete && (
        <DeleteBlog
          id={activeBoard?.id}
          title={activeBoard?.title}
          setClose={setIsBoardDelete}
          open={isBoardDelete}
          getData={fetchTodoData}
          setAnchorEl={setAnchorEl}
        />
      )}

      {/* ------------ Toast Container ------------ */}
      <ToastContainer
        style={{ fontSize: "0.8rem" }}
        position="bottom-right"
        theme="colored"
      />
    </Box>
  );
}

function takeicon(setState, tab, setAnchor, anchor) {
  return (
    <>
      {!tab ? (
        <ArrowDropDownIcon
          sx={{
            fontSize: 30,
          }}
          onClick={(event) => {
            setState((prev) => !prev);
            setAnchor(anchor ? null : event.currentTarget);
          }}
        />
      ) : (
        <ArrowDropUpIcon
          sx={{
            fontSize: 30,
          }}
          onClick={(event) => {
            setState((prev) => !prev);
            setAnchor(anchor ? null : event.currentTarget);
          }}
        />
      )}
    </>
  );
}

function sidebarList() {}
