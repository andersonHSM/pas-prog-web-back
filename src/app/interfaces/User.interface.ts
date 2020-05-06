export interface UserInterface {
  id?: number;
  name: string;
  password: string;
  password_hash: string;
  email: string;
  createdAt: Date;
  updatedAt: Date;
}
