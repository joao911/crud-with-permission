import React, { useEffect, useMemo, useState } from "react";
import {
  AppBar,
  Avatar,
  Box,
  Button,
  Menu,
  Toolbar,
  MenuItem,
} from "@mui/material";
import { Outlet, useNavigate } from "react-router-dom";

import logo from "../assests/img/logo.png";
import { useHooks } from "../hooks";
import { IUsers } from "../store/modules/users/types";
import { isEmpty, slice } from "lodash";

export const DefaultLayout: React.FC = () => {
  const { userLogged, dispatch } = useHooks();

  const navigate = useNavigate();
  const [anchorEl, setAnchorEl] = useState<null | HTMLElement>(null);
  const open = Boolean(anchorEl);
  const handleClick = (event: React.MouseEvent<HTMLButtonElement>) => {
    setAnchorEl(event.currentTarget);
  };
  const handleClose = () => {
    setAnchorEl(null);
  };

  useEffect(() => {
    if (isEmpty(userLogged)) {
      navigate("/");
    }
  }, [userLogged]);

  const fistLetterName = useMemo(() => {
    return slice(userLogged.name, 0, 1);
  }, [userLogged]);

  const fistLetterLastName = useMemo(() => {
    return slice(userLogged.lastName, 0, 1);
  }, [userLogged]);

  return (
    <Box>
      <Box sx={{ flexGrow: 1 }}>
        <AppBar position="static">
          <Toolbar style={{ display: "flex", justifyContent: "space-between" }}>
            <img
              src={logo}
              alt="logo"
              onClick={() => navigate("/users")}
              style={{ cursor: "pointer" }}
            />

            <Button
              color="inherit"
              id="basic-button"
              aria-controls={open ? "basic-menu" : undefined}
              aria-haspopup="true"
              aria-expanded={open ? "true" : undefined}
              onClick={handleClick}
            >
              <Avatar>
                {fistLetterName} {fistLetterLastName}
              </Avatar>
            </Button>
            <Menu
              id="basic-menu"
              anchorEl={anchorEl}
              open={open}
              onClose={handleClose}
              MenuListProps={{
                "aria-labelledby": "basic-button",
              }}
            >
              <MenuItem
                onClick={() => {
                  handleClose();
                  navigate("/profile");
                }}
              >
                Perfil
              </MenuItem>
              <MenuItem
                onClick={() => {
                  handleClose();
                  dispatch.users.setUserLogged({} as IUsers);
                }}
              >
                Sair
              </MenuItem>
            </Menu>
          </Toolbar>
        </AppBar>
      </Box>
      <Outlet />
    </Box>
  );
};
