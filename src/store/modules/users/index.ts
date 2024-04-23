import { createModel } from "@rematch/core";
import { RootModel } from "../../models";

import { IState } from "./types";
import { api } from "../../../api/axios";
import { IUsers } from "./types";

export const users = createModel<RootModel>()({
  state: {
    users: [],
    userLogged: {} as IUsers,
  } as IState,
  reducers: {
    setUsers(state, payload: IUsers[]) {
      return { ...state, users: payload };
    },
    setUserLogged(state, payload: IUsers) {
      return { ...state, userLogged: payload };
    },
  },
  effects: (dispatch) => ({
    async getAll() {
      try {
        const response = await api.get("/users");

        dispatch.users.setUsers(response.data);
      } catch (error) {
        console.log("error", error);
      }
    },

    async createUser(payload: IUsers) {
      try {
        const response = await api.post("/users", payload);
        return response;
      } catch (error: any) {
        throw error;
      }
    },

    async updateUser(payload: { data: IUsers; userId: string }) {
      const { data, userId } = payload;

      try {
        const response = await api.put(`/users/${userId}`, data);
        return response;
      } catch (error: any) {
        throw error;
      }
    },
    async deleteUser(id: string) {
      try {
        const response = await api.delete(`/users/${id}`);
        return response;
      } catch (error: any) {
        throw error;
      }
    },
  }),
});
