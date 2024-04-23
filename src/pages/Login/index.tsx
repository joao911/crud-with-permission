import React, { useState } from "react";
import Button from "@mui/material/Button";
import CssBaseline from "@mui/material/CssBaseline";
import TextField from "@mui/material/TextField";
import Paper from "@mui/material/Paper";
import Box from "@mui/material/Box";
import Grid from "@mui/material/Grid";
import { IconButton, InputAdornment } from "@mui/material";
import VisibilityIcon from "@mui/icons-material/Visibility";
import VisibilityOffIcon from "@mui/icons-material/VisibilityOff";
import logo from "../../assests/img/logo.png";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { z } from "zod";
import { api } from "../../api/axios";
import { find } from "lodash";
import { Toast } from "../../components/Toast";
import { useNavigate } from "react-router-dom";
import { useHooks } from "../../hooks";

export const Login: React.FC = () => {
  const [showPassword, setShowPassword] = useState(false);
  const [showToastConfirm, setShowToastConfirm] = useState(false);
  const [showToastError, setShowToastError] = useState(false);
  const { dispatch, getUsers } = useHooks();
  const navigation = useNavigate();

  const userSchema = z.object({
    name: z.string().min(1, "Nome é obrigatório"),
    password: z.string().min(1, "Senha é obrigatória"),
  });
  type NewCycleFormData = z.infer<typeof userSchema>;

  const {
    handleSubmit,
    register,
    formState: { errors },
  } = useForm<NewCycleFormData>({
    resolver: zodResolver(userSchema),
  });

  function navigateToTableUsers() {
    navigation("/users");
  }
  const onSubmit = async (data: NewCycleFormData) => {
    try {
      const response = await api.get("/users");
      const users = response.data;
      const user = find(users, (user) => user.email === data.name);
      dispatch.users.setUserLogged(user);

      if (user) {
        setShowToastConfirm(true);
        navigateToTableUsers();
      } else {
        setShowToastError(true);
      }
    } catch (error) {
      console.log(error);
    }
  };

  const closeToast = () => setShowToastConfirm(false);
  const closeToastError = () => setShowToastError(false);

  return (
    <Grid container component="main" sx={{ height: "100vh" }}>
      <CssBaseline />
      <Grid
        item
        xs={false}
        sm={4}
        md={7}
        sx={{
          backgroundImage:
            "url(https://neofeed.com.br/wp-content/uploads/2023/08/softplan-logo.jpg)",
          backgroundRepeat: "no-repeat",
          backgroundColor: (t) =>
            t.palette.mode === "light"
              ? t.palette.grey[50]
              : t.palette.grey[900],
          backgroundSize: "cover",
          backgroundPosition: "center",
        }}
      />
      <Grid item xs={12} sm={8} md={5} component={Paper} elevation={6} square>
        <Box
          sx={{
            my: 8,
            mx: 4,
            display: "flex",
            flexDirection: "column",
            alignItems: "center",
          }}
        >
          <Box>
            <img src={logo} alt="logo" />
          </Box>

          <Box
            component="form"
            noValidate
            onSubmit={handleSubmit(onSubmit)}
            sx={{ mt: 1 }}
          >
            <TextField
              {...register("name")}
              error={errors.name && true}
              fullWidth
              helperText={errors.name?.message?.toString()}
              label="Nome"
              margin="normal"
            />
            <TextField
              {...register("password")}
              error={errors.password && true}
              margin="normal"
              fullWidth
              helperText={errors.password?.message?.toString()}
              label="Senha"
              type={showPassword ? "text" : "password"}
              InputProps={{
                endAdornment: (
                  <InputAdornment position="end">
                    <IconButton
                      aria-label="toggle password visibility"
                      onClick={() => setShowPassword(!showPassword)}
                    >
                      {showPassword ? (
                        <VisibilityIcon />
                      ) : (
                        <VisibilityOffIcon />
                      )}
                    </IconButton>
                  </InputAdornment>
                ),
              }}
            />

            <Button
              type="submit"
              fullWidth
              variant="contained"
              sx={{ mt: 3, mb: 2 }}
            >
              Entrar
            </Button>
          </Box>
        </Box>
      </Grid>
      <Toast
        message="Login efetuado com sucesso"
        type="success"
        open={showToastConfirm}
        handleClose={closeToast}
      />

      <Toast
        message="Usuario ou senha incorretos"
        type="error"
        open={showToastError}
        handleClose={closeToastError}
      />
    </Grid>
  );
};
