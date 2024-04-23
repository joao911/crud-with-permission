export interface IState {
  users: IUsers[];
  userLogged: IUsers;
}

export interface IUsers {
  id?: string;
  name: string;
  lastName: string;
  password: string;
  confirmPassword: string;
  email: string;
  role?: string;
}
