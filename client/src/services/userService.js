import axiosInstance from "../api/axiosInstance";

export const signUp = async (credintials) => {
  try {
    return (await axiosInstance.post("/api/user/signup", credintials)).data;
  } catch (error) {
    console.log(error);
  }
};

export const signIn = async (credintials) => {
  try {
    return (await axiosInstance.post("/api/user/signin", credintials)).data;
  } catch (error) {
    console.log(error);
  }
};

export const getRefreshToken = async () => {
  try {
    return (await axiosInstance.post("/api/refreshToken"), data).data;
  } catch (error) {
    console.log(error);
  }
}

export const signOut = async (data) => {
  try {
    return (await axiosInstance.delete("/api/refreshToken"), data).data;
  } catch (error) {
    console.log(error);
  }
};
