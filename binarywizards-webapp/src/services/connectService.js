import config from '../config';
import { toast } from "react-toastify";

export async function connectUser(username, password) {
  try {
    const response = await fetch(`${config.API_BASE_URL}/user/connect`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({ username, password }),
    });
    if (!response.ok) {
      throw new Error('Error during login');
    }
    const data = await response.json();
    toast.info("Login successful");
    return data.user_id;
  } catch (error) {
    toast.error("Error during login: " + error.message);
    throw error;
  }
}
