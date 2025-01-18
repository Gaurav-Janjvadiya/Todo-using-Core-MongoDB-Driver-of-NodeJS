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
        className="flex items-center space-x-3 w-full p-6 justify-center"
        onSubmit={handleSubmit}
      >
        <input
          className="border-2 border-[#ccd5ae] outline-none py-2 px-4 text-lg bg-[#fefae0]"
          required
          type="text"
          name="todo"
          onChange={handleChange}
          value={formData.todo}
          placeholder="Type something..."
        />
        <button className="border-2 border-[#ccd5ae] bg-[#fefae0] py-2 px-4 text-lg hover:bg-[#e9edc9] active:bg-[#fefae0]">
          Add
        </button>
      </form>
    </>
  );
}

export default Input;
