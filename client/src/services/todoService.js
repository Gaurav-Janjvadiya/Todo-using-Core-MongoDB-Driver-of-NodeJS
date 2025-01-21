import axiosInstance from "../api/axiosInstance";
import Cookies from "js-cookie";

export const fetchTodos = async () => {
  try {
    const token = Cookies.get("jwt");
    const { data } = await axiosInstance.get("/api/todos", {
      headers: { Authorization: `Bearer ${token}` },
    });
    return data;
  } catch (error) {
    console.log("fetchTodos Error", error);
  }
};

export const createTodo = async (todoObj) => {
  try {
    return (await axiosInstance.post("/api/todos", todoObj)).data;
  } catch (error) {
    console.log("createTodo Error", error);
  }
};

export const updateTodo = async ({ id, todoObj }) => {
  try {
    return (await axiosInstance.put(`/api/todos/${id}`, todoObj)).data;
  } catch (error) {
    console.log("updateTodo Error", error);
  }
};

export const deleteTodo = async (id) => {
  try {
    return (await axiosInstance.delete(`/api/todos/${id}`)).data;
  } catch (error) {
    console.log("deleteTodo Error", error);
  }
};
