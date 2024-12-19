import axiosInstance from '../utils/axiosInstance';
import { toast } from "react-toastify";

export async function SignupUser(username, password) {
  try {
    const response = await axiosInstance.post('/user/signup', {
      username,
      password
    });
    toast.info("Sign up successful");
    return response.data.token;
  } catch (error) {
    throw error;
  }
}

export async function checkUsernameAvailability(username) {
  try {
    const response = await axiosInstance.post('/user/username_available', {
      username,
    });
    return response.data.is_available;
  } catch (error) {
    throw error;
  }
}
