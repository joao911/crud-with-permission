import React, { useEffect, useMemo, useState } from "react";
import Paper from "@mui/material/Paper";
import Table from "@mui/material/Table";
import TableBody from "@mui/material/TableBody";
import TableCell from "@mui/material/TableCell";
import TableContainer from "@mui/material/TableContainer";
import TableHead from "@mui/material/TableHead";
import TableRow from "@mui/material/TableRow";
import {
  Box,
  IconButton,
  InputAdornment,
  TextField,
  Typography,
} from "@mui/material";
import CloseIcon from "@mui/icons-material/Close";
import AddCircleOutlineIcon from "@mui/icons-material/AddCircleOutline";
import ModalCreateAndEditUsers from "./components/ModalCreateAndEditUsers";
import { filter, includes, map } from "lodash";
import CreateIcon from "@mui/icons-material/Create";
import DeleteIcon from "@mui/icons-material/Delete";
import ModalConfirm from "./components/ModalConfirm";
import { IUsers } from "../../store/modules/users/types";
import { useHooks } from "../../hooks";

export const UsersTable: React.FC = () => {
  const [showModal, setShowModal] = useState(false);
  const [showModalConfirm, setShowModalConfirm] = useState(false);
  const [userSelected, setUserSelected] = useState<IUsers>();
  const { dispatch, getUsers, users, userLogged } = useHooks();
  const [search, setSearch] = useState("");

  function deleteUser(id: string) {
    dispatch.users.deleteUser(id);
  }

  function handleDeleteUser(id: string) {
    deleteUser(id);
    getUsers();
  }

  const hasAdminPermission = useMemo(() => {
    return userLogged?.role === "Administrador";
  }, [userLogged]);

  useEffect(() => {
    getUsers();
  }, []);

  useEffect(() => {
    const timeoutId = setTimeout(() => {
      if (search) {
        const filteredUsers = filter(users, (user) =>
          includes(user.name.toLocaleUpperCase(), search.toLowerCase())
        );
        dispatch.users.setUsers(filteredUsers);
      } else {
        dispatch.users.getAll();
      }
    }, 2000);

    return () => clearTimeout(timeoutId);
  }, [search]);

  return (
    <Box p={20}>
      <Box display={"flex"} justifyContent={"flex-end"} mb={2}>
        <Box>
          <TextField
            label="Pesquisar usuários"
            variant="standard"
            fullWidth
            InputProps={{
              endAdornment: (
                <InputAdornment position="end">
                  {search.length > 0 && (
                    <IconButton onClick={() => setSearch("")}>
                      <CloseIcon />
                    </IconButton>
                  )}
                </InputAdornment>
              ),
            }}
            value={search}
            onChange={(e) => setSearch(e.target.value)}
          />
        </Box>
      </Box>
      <Box display={"flex"} justifyContent={"space-between"} mb={2}>
        <Typography variant="h4">Tabela de Usuários</Typography>
        {hasAdminPermission && (
          <Box display={"flex"} alignItems={"center"} gap={1}>
            <Typography variant="subtitle1">Adicionar usuários</Typography>
            <IconButton
              onClick={() => {
                setShowModal(true);
                setUserSelected({} as IUsers);
              }}
            >
              <AddCircleOutlineIcon />
            </IconButton>
          </Box>
        )}
      </Box>

      <Paper sx={{ width: "100%", overflow: "hidden" }}>
        <TableContainer sx={{ maxHeight: 440 }}>
          <Table stickyHeader aria-label="sticky table">
            <TableHead>
              <TableRow>
                {hasAdminPermission && <TableCell>Ações</TableCell>}
                <TableCell>Nome</TableCell>
                <TableCell>Sobrenome</TableCell>
                <TableCell>Cargo</TableCell>
                <TableCell>Email</TableCell>
              </TableRow>
            </TableHead>
            <TableBody>
              {map(users, (user) => (
                <TableRow hover role="checkbox" tabIndex={-1} key={user.id}>
                  <>
                    {hasAdminPermission && (
                      <TableCell>
                        <IconButton
                          onClick={() => {
                            setUserSelected(user);
                            setShowModal(true);
                          }}
                        >
                          <CreateIcon />
                        </IconButton>
                        <IconButton
                          onClick={() => {
                            setShowModalConfirm(true);
                            setUserSelected(user);
                          }}
                        >
                          <DeleteIcon />
                        </IconButton>
                      </TableCell>
                    )}
                  </>

                  <TableCell>{user.name}</TableCell>
                  <TableCell>{user.lastName}</TableCell>
                  <TableCell>{user.role}</TableCell>
                  <TableCell>{user.email}</TableCell>
                </TableRow>
              ))}
            </TableBody>
          </Table>
        </TableContainer>
      </Paper>

      {showModal && (
        <ModalCreateAndEditUsers
          open={showModal}
          handleClose={() => {
            setShowModal(false);
          }}
          userSelected={userSelected}
          setShowModal={() => setShowModal(false)}
        />
      )}
      <ModalConfirm
        open={showModalConfirm}
        handleClose={() => setShowModalConfirm(false)}
        handleConfirm={() => {
          handleDeleteUser(userSelected?.id as string);
          getUsers();
        }}
      />
    </Box>
  );
};
