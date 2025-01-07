import TodoItem from "./TodoItem";

function TodoList({ todos }) {
  return (
    <>
      <ul className="border">
        {todos.map((todo) => (
          <TodoItem key={todo._id} todo={todo} />
        ))}
      </ul>
    </>
  );
}

export default TodoList;
