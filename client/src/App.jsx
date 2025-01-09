import Input from "./components/Input";
import TodoList from "./components/TodoList";
import { fetchTodos, createTodo } from "./services/todoService";
import { useQuery } from "@tanstack/react-query";
import { useMutation, useQueryClient } from "@tanstack/react-query";

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
    <div className="flex sm:p-6 p-2 items-center justify-center flex-col h-screen">
      <Input onSubmit={mutate} />
      {isLoading ? (
        <p>Loading...</p>
      ) : (
        <>
          <TodoList todos={todos} />
        </>
      )}
    </div>
  );
};

export default App;
