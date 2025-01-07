import { useState, useCallback } from "react";

function Input({ onSubmit }) {
  const [formData, setFormData] = useState({ todo: "" });

  const handleChange = useCallback((e) => {
    setFormData((prev) => ({ ...prev, [e.target.name]: e.target.value }));
  }, []);

  const handleSubmit = useCallback(
    (e) => {
      e.preventDefault();
      onSubmit(formData);
      setFormData({ todo: "" });
    },
    [formData.todo]
  );
  return (
    <>
      <form
        className="flex items-center justify-center"
        onSubmit={handleSubmit}
      >
        <input
          className="border border-black"
          required
          type="text"
          name="todo"
          onChange={handleChange}
          value={formData.todo}
        />
      </form>
    </>
  );
}

export default Input;
