import {
  Box,
  Button,
  Dialog,
  DialogActions,
  DialogContent,
  DialogContentText,
  DialogTitle,
} from "@mui/material";
import React from "react";
import { axiosDelete } from "../utils/axios";
import { toast } from "react-toastify";

const DeleteBlog = ({
  id,
  title,
  setClose,
  open,
  getData,
  setAnchorEl,
  setIsScratch,
}) => {
  return (
    <Dialog
      open={open}
      onClose={() => {
        setClose((prev) => !prev);
        setIsScratch(false);
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
          fontSize: 17,
          fontWeight: 600,
          color: "red",
        }}
      >
        {"Delete this Board ?"}
      </DialogTitle>
      <DialogContent
        sx={{
          py: 1,
        }}
      >
        <DialogContentText
          sx={{
            color: "lightslategray",
          }}
        >
          {`Are you sure you want to delete the "${title}" board? This
          action will remove all columns and tasks and cannot be reversed.`}
        </DialogContentText>
      </DialogContent>
      <DialogActions
        sx={{
          display: "flex",
          rowGap: 2,
          px: 3,
          py: 4,
          pt: 2,
          width: 500,
          mx: "auto",
        }}
      >
        <Button
          autoFocus
          fullWidth
          variant="outlined"
          onClick={() => {
            async function deleteId(id) {
              try {
                const resposne = await axiosDelete(
                  `http://localhost:7001/todo/taskList/${id}`
                );
                toast.success(resposne?.data?.message ?? "", {
                  autoClose: 800,
                });
                getData();
              } catch (err) {}
            }
            setIsScratch(false);
            setClose((prev) => !prev);
            deleteId(id);
            setAnchorEl(null);
          }}
          sx={{
            border: "1px solid red",
            color: "red",
            textTransform: "capitalize",
            ":hover": {
              bgcolor: "#FFFF",
              border: "1px solid red",
            },
          }}
        >
          Delete
        </Button>
        <Button
          autoFocus
          fullWidth
          variant="contained"
          sx={{
            p: 0.6,
            boxShadow: "none",
            background: "#f0effa",
            ":hover": {
              bgcolor: "#f0effa",
              border: "none",
              boxShadow: "none",
            },
            fontWeight: 600,
            fontSize: 14,
            textTransform: "none",
            border: "none",
            color: "#635fc7",
          }}
          onClick={() => {
            setClose((prev) => !prev);
            setIsScratch(false);
            setAnchorEl(null);
          }}
        >
          Cancel
        </Button>
      </DialogActions>
    </Dialog>
  );
};

export default DeleteBlog;
