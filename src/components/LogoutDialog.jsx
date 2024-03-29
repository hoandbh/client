import { useEffect, useContext, useState, React } from 'react';
import { AuthContext } from '../context/authContext';
import { useNavigate } from 'react-router-dom';
import Button from '@mui/material/Button';
import Dialog from '@mui/material/Dialog';
import DialogActions from '@mui/material/DialogActions';
import DialogContent from '@mui/material/DialogContent';
import DialogContentText from '@mui/material/DialogContentText';
import DialogTitle from '@mui/material/DialogTitle';

const LogoutDialog = ({ open, setOpen }) => {

  const { logout } = useContext(AuthContext);
  const navigate = useNavigate();

  const handleClose = () => {
    setOpen(false);
  };

  const handleSubmission = () => {
    handleLogout();
    setOpen(false);
  };

  const handleLogout = async () => {
    await logout();
    navigate('/');
  };

  return (
    <>
      <Dialog
        open={open}
        onClose={handleClose}
        aria-labelledby="alert-dialog-title"
        aria-describedby="alert-dialog-description"
      >
        <DialogTitle id="alert-dialog-title">{"Confirmation"}</DialogTitle>
        <DialogContent>
          <DialogContentText id="alert-dialog-description">
            Are you sure you want to logout?
          </DialogContentText>
        </DialogContent>
        <DialogActions>
          <Button onClick={handleClose}>Cancel</Button>
          <Button onClick={handleSubmission} autoFocus>
            Logout
          </Button>
        </DialogActions>
      </Dialog>
    </>
  );
}

export default LogoutDialog;