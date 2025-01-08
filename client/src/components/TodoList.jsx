import TodoItem from "./TodoItem";

function TodoList({ todos }) {
  return (
    <>
      <ul className="bg-[#faedcd] custom-scrollbar p-4 space-y-2 border border-[#ccd5ae] max-h-[70vh] w-fit overflow-y-scroll flex flex-center flex-col items-center">
        {todos.map((todo) => (
          <TodoItem key={todo._id} todo={todo} />
        ))}
      </ul>
    </>
  );
}

export default TodoList;
