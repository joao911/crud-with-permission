import { useDispatch, useSelector } from "react-redux";
import { Dispatch, RootState } from "../store";

export const useHooks = () => {
  const dispatch = useDispatch<Dispatch>();
  const { users, userLogged } = useSelector((state: RootState) => state.users);
  const getUsers = async () => {
    await dispatch.users.getAll();
  };
  return { dispatch, getUsers, users, userLogged };
};
