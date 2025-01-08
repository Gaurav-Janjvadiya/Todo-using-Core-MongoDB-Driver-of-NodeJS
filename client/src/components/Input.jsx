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
        className="flex items-center space-x-2 w-fit p-4 justify-center"
        onSubmit={handleSubmit}
      >
        <input
          className="border border-[#ccd5ae] outline-none py-1 px-2 bg-[#fefae0]"
          required
          type="text"
          name="todo"
          onChange={handleChange}
          value={formData.todo}
          placeholder="type something..."
        />
        <button className="border border-[#ccd5ae] bg-[#fefae0] py-1 px-3 hover:bg-[#e9edc9] active:bg-[#fefae0]">
          Add
        </button>
      </form>
    </>
  );
}

export default Input;
