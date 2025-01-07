import { memo, useState, useCallback } from "react";
import { deleteTodo, updateTodo } from "../services/todoService";
import { useMutation, useQueryClient } from "@tanstack/react-query";

const TodoItem = memo(({ todo }) => {
  const [formData, setFormData] = useState({ todo: todo.todo });
  const [inputActive, setInputActive] = useState([]);
  const queryClient = useQueryClient();

  const handleCloseInput = useCallback(() => {
    setInputActive((prev) => prev.filter((todo) => todo._id !== todo._id));
  }, [todo._id]);

  const handleChange = useCallback(
    (e) => {
      setFormData((prev) => ({ ...prev, [e.target.name]: e.target.value }));
    },
    [setFormData]
  );

  const updateMutation = useMutation({
    mutationKey: ["upadateTodo"],
    mutationFn: (id, todoObj) => updateTodo(id, todoObj),
    onSuccess: () => {
      queryClient.invalidateQueries(["todos"]);
    },
  });

  const handleSubmit = useCallback(
    (e) => {
      e.preventDefault();
      updateMutation.mutate({ id: todo._id, todoObj: formData });
      handleCloseInput();
    },
    [formData.todo, updateMutation.mutate, todo._id]
  );

  const deleteMutation = useMutation({
    mutationKey: ["deleteTodo"],
    mutationFn: deleteTodo,
    onSuccess: () => {
      queryClient.invalidateQueries(["todos"]);
    },
  });

  const handleDelete = () => {
    deleteMutation.mutate(todo._id);
  };
  const handleUpdate = useCallback(() => {
    setInputActive([...inputActive, todo._id]);
  }, []);

  return (
    <>
      <li className="border space-x-3 h-full text-center">
        <div>
          <p>{todo.todo}</p>
        </div>
        <div className="space-x-1">
          <button className="border" onClick={handleDelete}>
            Delete
          </button>
          <button className="border" onClick={handleUpdate}>
            Update
          </button>
        </div>
        {inputActive.includes(todo._id) && (
          <form onSubmit={handleSubmit}>
            <input
              type="text"
              name="todo"
              onChange={handleChange}
              value={formData.todo}
            />
            <button type="button" onClick={handleCloseInput}>
              Close
            </button>
            <button type="submit">Update</button>
          </form>
        )}
      </li>
    </>
  );
});

TodoItem.displayName = "TodoItem";

export default TodoItem;
