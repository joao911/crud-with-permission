import React from "react";
import {
  Avatar,
  Box,
  Button,
  MenuItem,
  TextField,
  Typography,
} from "@mui/material";
import * as zod from "zod";
import { Controller, useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { map } from "lodash";
import { useHooks } from "../../hooks";
export const Profile: React.FC = () => {
  const { userLogged, dispatch } = useHooks();

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
  const {
    handleSubmit,
    register,
    control,
    formState: { errors },
  } = useForm<NewCycleFormData>({
    resolver: zodResolver(userSchema),
    defaultValues: userLogged,
  });

  const onSubmit = async (data: NewCycleFormData) => {
    const { name, lastName, password, confirmPassword, email } = data;
    console.log("data", data);
    await dispatch.users.updateUser({
      data: {
        name,
        lastName,
        password,
        confirmPassword,
        email,
      },
      userId: userLogged?.id || "",
    });
  };

  return (
    <Box flex={1}>
      <Box
        display={"flex"}
        justifyContent={"center"}
        alignItems={"center"}
        flexDirection={"column"}
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
          <Typography variant="h3" textAlign={"center"}>
            Editar perfil
          </Typography>
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
          />
          <TextField
            {...register("confirmPassword")}
            error={errors.confirmPassword && true}
            margin="normal"
            fullWidth
            helperText={errors.confirmPassword?.message?.toString()}
            label="Confirme a senha"
            variant="standard"
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

          <Button
            type="submit"
            fullWidth
            variant="contained"
            sx={{ mt: 3, mb: 2 }}
          >
            Salvar
          </Button>
        </Box>
      </Box>
    </Box>
  );
};
