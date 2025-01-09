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
    [formData, updateMutation.mutate, todo._id]
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
      <li className="flex bg-[#fefae0] p-2 items-center space-x-3 justify-center w-full  border border-[#ccd5ae]">
        <div className="mr-auto">
          <p className="font-semibold text-lg text-balance">{todo.todo}</p>
        </div>
        <div className="grid grid-cols-1 gap-2 sm:grid-cols-2">
          <button
            className="border border-[#ccd5ae] py-1 px-3 hover:bg-[#e9edc9] active:bg-[#fefae0]"
            onClick={handleDelete}
          >
            Delete
          </button>
          {!inputActive.includes(todo._id) && (
            <button
              className="border border-[#ccd5ae] py-1 px-3 hover:bg-[#e9edc9] active:bg-[#fefae0]"
              onClick={handleUpdate}
            >
              Update
            </button>
          )}
        </div>
      </li>
      {inputActive.includes(todo._id) && (
        <div className="border w-full bg-[#d4a373] text-[#fefae0] p-4">
          <form onSubmit={handleSubmit} className="flex flex-col gap-2">
            <input
              className="text-[#d4a373] p-2 outline-none border border-[#fefae0] bg-[#fefae0]"
              type="text"
              name="todo"
              onChange={handleChange}
              value={formData.todo}
            />
            <div className="flex gap-2">
              <button
                className="border border-[#fefae0] hover:bg-[#fefae0] hover:text-[#d4a373] active:bg-[#d4a373] active:text-[#fefae0] px-2 py-1"
                type="submit"
              >
                Update
              </button>
              <button
                className="border border-[#fefae0] hover:bg-[#fefae0] hover:text-[#d4a373] active:bg-[#d4a373] active:text-[#fefae0] px-2 py-1"
                type="button"
                onClick={handleCloseInput}
              >
                Close
              </button>
            </div>
          </form>
        </div>
      )}
    </>
  );
});

TodoItem.displayName = "TodoItem";

export default TodoItem;
