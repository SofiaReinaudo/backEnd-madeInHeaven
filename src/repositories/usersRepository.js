import { UserDao } from "../dao/index.js";

export const getUserById = async (id) => await UserDao.getUserById(id);
export const getUserByEmail = async (email) => await UserDao.getUserByEmail(email);
export const registerUser = async (user) => await UserDao.registerUser(user);