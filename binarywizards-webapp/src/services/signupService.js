import config from '../config';
import { toast } from "react-toastify";

export async function signupUser(username, password) {
  try {
    const response = await fetch(`${config.API_BASE_URL}/user/create`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({ username, password }),
    });
    if (!response.ok) {
      throw new Error('Error during account creation');
    }
    const data = await response.json();
    toast.info("Sign up successful");
    return data.user_id;
  } catch (error) {
    toast.error("Error during sign up: " + error.message);
    throw error;
  }
}

export async function checkUsernameAvailability(username) {
  try {
    const response = await fetch(`${config.API_BASE_URL}/user/username_avaible`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({ username }),
    });
    if (!response.ok) {
      throw new Error('Error checking username availability');
    }
    const data = await response.json();
    return data.avaible;
  } catch (error) {
    toast.error("Error checking username availability: " + error.message);
    throw error;
  }
}
