import axiosInstance from '../utils/axiosInstance';
import { toast } from "react-toastify";

export async function signupUser(username, password) {
  try {
    const response = await axiosInstance.post('/user/create', {
      username,
      password,
    });
    toast.info("Sign up successful");
    return response.data.token;
  } catch (error) {
    throw error;
  }
}

export async function checkUsernameAvailability(username) {
  try {
    const response = await axiosInstance.post('/user/username_avaible', {
      username,
    });
    return response.data.avaible;
  } catch (error) {
    throw error;
  }
}