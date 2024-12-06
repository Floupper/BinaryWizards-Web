import axiosInstance from '../utils/axiosInstance';
import { toast } from "react-toastify";

export async function ConnectService(username, password) {
  try {
    const response = await axiosInstance.post('/user/signin', {
      username,
      password
    });
    toast.info("Login successful");
    return response.data.token;
  } catch (error) {
    throw error;
  }
}