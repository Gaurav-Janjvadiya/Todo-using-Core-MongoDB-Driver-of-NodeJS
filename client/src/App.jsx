import Input from "./components/Input";
import TodoList from "./components/TodoList";
import { fetchTodos, createTodo } from "./services/todoService";
import { useQuery } from "@tanstack/react-query";
import { useMutation, useQueryClient } from "@tanstack/react-query";
import Header from "./layout/Header";
import { BrowserRouter, Routes, Route } from "react-router-dom";
import SignUp from "./pages/signup/SignUp";
import SignIn from "./pages/signin/SignIn";
import UserContextProvider from "./context/userContext.jsx";

const App = () => {
  const { data: todos = [], isLoading } = useQuery({
    queryKey: ["todos"],
    queryFn: fetchTodos,
    gcTime: 5 * 60 * 1000,
    refetchOnWindowFocus: false,
  });
  const queryClient = useQueryClient();

  const { mutate } = useMutation({
    mutationKey: ["createTodo"],
    mutationFn: createTodo,
    onSuccess: () => {
      queryClient.invalidateQueries(["todos"]);
    },
  });
  return (
    <UserContextProvider >
      <BrowserRouter>
        <Header />
        <Routes>
          <Route
            path="/"
            element={
              <div className="flex sm:p-4 border p-2 items-center justify-center flex-col h-screen">
                <Input onSubmit={mutate} />
                {isLoading ? (
                  <p>Loading...</p>
                ) : (
                  <>
                    <TodoList todos={todos} />
                  </>
                )}
              </div>
            }
          />
          <Route path="/signup" element={<SignUp />} />
          <Route path="/signin" element={<SignIn />} />
        </Routes>
      </BrowserRouter>
    </UserContextProvider>
  );
};

export default App;
