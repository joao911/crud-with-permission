import React, { useState } from "react";
import {
  Box,
  Button,
  Dialog,
  DialogTitle,
  IconButton,
  InputAdornment,
  MenuItem,
  TextField,
} from "@mui/material";
import * as zod from "zod";
import { Controller, useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { v4 as uuidv4 } from "uuid";
import { Toast } from "../../../../components/Toast";
import { isEmpty, map } from "lodash";
import VisibilityIcon from "@mui/icons-material/Visibility";
import VisibilityOffIcon from "@mui/icons-material/VisibilityOff";
import { IUsers } from "../../../../store/modules/users/types";
import { useHooks } from "../../../../hooks";
type IModalCreateAndEditUsersProps = {
  open: boolean;
  handleClose: (state: boolean) => void;
  userSelected?: IUsers;
  setShowModal: (state: boolean) => void;
};

const ModalCreateAndEditUsers: React.FC<IModalCreateAndEditUsersProps> = ({
  open,
  handleClose,
  userSelected,
  setShowModal,
}) => {
  const [showToastError, setShowToastError] = useState(false);
  const [showPassword, setShowPassword] = useState(false);
  const [showPasswordConfirm, setShowPasswordConfirm] = useState(false);
  const { dispatch, getUsers } = useHooks();

  const passwordSchema = zod
    .string()
    .min(8, "A senha deve conter no mínimo 8 caracteres.")
    .regex(/[A-Z]/, "A senha deve conter pelo menos uma letra maiúscula.")
    .regex(
      /[^a-zA-Z0-9]/,
      "A senha deve conter pelo menos um caractere especial."
    );

  const userSchema = zod
    .object({
      name: zod.string().min(1, "Nome é obrigatório"),
      lastName: zod.string().min(1, "Sobrenome é obrigatório"),
      password: passwordSchema,
      confirmPassword: passwordSchema,
      email: zod
        .string()
        .min(1, "Email é obrigatório")
        .email("Insira um email valido"),
      role: zod.string().min(1, "Selecione um cargo"),
    })
    .refine((data) => data.password === data.confirmPassword, {
      message: "As senhas não são iguais.",
      path: ["confirmPassword"],
    });
  type NewCycleFormData = zod.infer<typeof userSchema>;

  const defaultValue = {
    name: userSelected?.name,
    lastName: userSelected?.lastName,
    password: userSelected?.password,
    confirmPassword: userSelected?.password,
    email: userSelected?.email,
    role: userSelected?.role,
  };
  const {
    handleSubmit,
    register,
    control,
    formState: { errors },
  } = useForm<NewCycleFormData>({
    resolver: zodResolver(userSchema),
    defaultValues: defaultValue,
  });

  const hasEditeUser = isEmpty(userSelected);

  const userSelectedId = userSelected?.id;

  const onSubmit = async (data: NewCycleFormData) => {
    const { name, lastName, password, confirmPassword, email, role } = data;
    try {
      if (hasEditeUser) {
        await dispatch.users.createUser({
          name,
          lastName,
          password,
          confirmPassword,
          email,
          role,
          id: uuidv4(),
        });
      } else {
        await dispatch.users.updateUser({
          data: {
            name,
            lastName,
            password,
            confirmPassword,
            email,
            role,
          },
          userId: userSelectedId || "",
        });
      }
      await dispatch.users.getAll();
    } catch (error) {
      console.log("erro", error);
    } finally {
      setShowModal(false);
      getUsers();
    }
  };

  const rule = [{ role: "Administrador" }, { role: "Funcionário" }];
  const closeToastError = () => setShowToastError(false);

  return (
    <Dialog
      open={open}
      onClose={handleClose}
      aria-labelledby="alert-dialog-title"
      aria-describedby="alert-dialog-description"
    >
      <Box
        component="form"
        noValidate
        onSubmit={handleSubmit(onSubmit)}
        sx={{ mt: 1 }}
        p={6}
        height={"44rem"}
        display={"flex"}
        flexDirection={"column"}
        justifyContent={"space-around"}
        width={"35rem"}
      >
        <DialogTitle id="alert-dialog-title" textAlign={"center"}>
          {hasEditeUser ? "Cadastrar Usuário" : "Editar Usuário"}
        </DialogTitle>
        <TextField
          {...register("name")}
          error={errors.name && true}
          fullWidth
          helperText={errors.name?.message?.toString()}
          label="Nome"
          margin="normal"
          variant="standard"
        />
        <TextField
          {...register("lastName")}
          error={errors.lastName && true}
          fullWidth
          helperText={errors.lastName?.message?.toString()}
          label="Sobrenome"
          margin="normal"
          variant="standard"
        />
        <TextField
          {...register("password")}
          error={errors.password && true}
          margin="normal"
          fullWidth
          helperText={errors.password?.message?.toString()}
          label="Senha"
          variant="standard"
          type={showPassword ? "text" : "password"}
          InputProps={{
            endAdornment: (
              <InputAdornment position="end">
                <IconButton
                  aria-label="toggle password visibility"
                  onClick={() => setShowPassword(!showPassword)}
                >
                  {showPassword ? <VisibilityIcon /> : <VisibilityOffIcon />}
                </IconButton>
              </InputAdornment>
            ),
          }}
        />
        <TextField
          {...register("confirmPassword")}
          error={errors.confirmPassword && true}
          margin="normal"
          fullWidth
          helperText={errors.confirmPassword?.message?.toString()}
          label="Confirme a senha"
          variant="standard"
          type={showPasswordConfirm ? "text" : "password"}
          InputProps={{
            endAdornment: (
              <InputAdornment position="end">
                <IconButton
                  aria-label="toggle password visibility"
                  onClick={() => setShowPasswordConfirm(!showPasswordConfirm)}
                >
                  {showPasswordConfirm ? (
                    <VisibilityIcon />
                  ) : (
                    <VisibilityOffIcon />
                  )}
                </IconButton>
              </InputAdornment>
            ),
          }}
        />
        <TextField
          {...register("email")}
          error={errors.password && true}
          margin="normal"
          fullWidth
          helperText={errors.email?.message?.toString()}
          label="Email"
          variant="standard"
          type="email"
        />

        <Controller
          name="role"
          control={control}
          render={({ field }) => (
            <TextField
              {...field}
              label="Cargo"
              variant="standard"
              select
              fullWidth
              margin="normal"
              error={!!errors.role}
              helperText={errors.role?.message}
            >
              {map(rule, (option) => (
                <MenuItem key={option.role} value={option.role}>
                  {option.role}
                </MenuItem>
              ))}
            </TextField>
          )}
        />

        <Button
          type="submit"
          fullWidth
          variant="contained"
          sx={{ mt: 3, mb: 2 }}
        >
          {hasEditeUser ? "Cadastrar" : "Editar"}
        </Button>
      </Box>
      <Toast
        message="Erro ao deletar usuário tentando novamente mais tarde"
        type="error"
        open={showToastError}
        handleClose={closeToastError}
      />
    </Dialog>
  );
};

export default ModalCreateAndEditUsers;
