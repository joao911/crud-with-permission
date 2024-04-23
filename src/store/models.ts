import { Models } from "@rematch/core";
import { users } from "./modules/users";

export interface RootModel extends Models<RootModel> {
  users: typeof users;
}

export const models: RootModel = {
  users,
};
