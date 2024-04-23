import React from "react";
import { Box, Dialog, DialogTitle, Button } from "@mui/material";

interface IModalConfirmProps {
  open: boolean;
  handleClose: () => void;
  handleConfirm: () => void;
}

const ModalConfirm: React.FC<IModalConfirmProps> = ({
  open,
  handleClose,
  handleConfirm,
}) => {
  return (
    <Dialog
      open={open}
      onClose={handleClose}
      aria-labelledby="alert-dialog-title"
      aria-describedby="alert-dialog-description"
    >
      <Box p={2}>
        <DialogTitle id="alert-dialog-title" textAlign={"center"}>
          Deseja excluir este usuário?
        </DialogTitle>
        <Box gap={2}>
          <Button
            fullWidth
            variant="contained"
            sx={{ mt: 3, mb: 2 }}
            className=""
            onClick={handleClose}
          >
            Cancelar
          </Button>
          <Button
            type="submit"
            fullWidth
            variant="contained"
            color="error"
            sx={{ mt: 3, mb: 2 }}
            onClick={() => {
              handleClose();
              handleConfirm();
            }}
          >
            Confirmar
          </Button>
        </Box>
      </Box>
    </Dialog>
  );
};

export default ModalConfirm;
