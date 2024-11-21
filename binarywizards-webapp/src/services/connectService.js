import axiosInstance from '../utils/axiosInstance';
import { toast } from "react-toastify";

export async function connectUser(username, password) {
  try {
    const response = await axiosInstance.post('/user/connect', {
      username,
      password,
    });
    toast.info("Login successful");
    return response.data.user_id;
  } catch (error) {
    throw error;
  }
}