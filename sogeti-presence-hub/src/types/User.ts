export type UserStatus =
  | "office"
  | "remote"
  | "client"
  | "offline";

export type User = {

  id: string;

  name: string;

  initials: string;

  status: UserStatus;

};