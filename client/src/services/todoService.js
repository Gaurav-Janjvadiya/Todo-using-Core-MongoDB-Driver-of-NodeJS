import axiosInstance from "../api/axiosInstance";

export const fetchTodos = async () => {
  try {
    const { data } = await axiosInstance.get("/api/todos");
    console.log(data);
    return data;
  } catch (error) {
    console.log("fetchTodos Error", error);
  }
};

export const createTodo = async (todoObj) => {
  try {
    const { data } = await axiosInstance.post("/api/todos", todoObj);
    return data;
  } catch (error) {
    console.log("createTodo Error", error);
  }
};

export const updateTodo = async (id, todoObj) => {
  try {
    const { data } = await axiosInstance.put(`/api/todos/${id}`, todoObj);
    return data;
  } catch (error) {
    console.log("updateTodo Error", error);
  }
};

export const deleteTodo = async (id) => {
  try {
    const { data } = await axiosInstance.delete(`/api/todos/${id}`);
    return data;
  } catch (error) {
    console.log("deleteTodo Error", error);
  }
};
