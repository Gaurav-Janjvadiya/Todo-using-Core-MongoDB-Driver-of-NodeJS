import { useState } from "react";
import { signIn } from "../../services/userService";
import { useMutation } from "@tanstack/react-query";
import { useUserContext } from "../../context/userContext";

const SignIn = () => {
  const [formData, setFormData] = useState({ username: "", password: "" });
  const { user, login } = useUserContext();
  const handleChange = (e) => {
    setFormData((prev) => ({ ...prev, [e.target.name]: e.target.value }));
  };
  const { mutate } = useMutation({
    mutationKey: ["signUser"],
    mutationFn: signIn,
    onSuccess: (token) => {
      login(token);
    },
  });
  const handleSubmit = (e) => {
    e.preventDefault();
    mutate(formData);
    setFormData({ username: "", password: "" });
  };
  return (
    <div className="h-[80vh] w-full flex items-center justify-center">
      <form
        className="flex items-center flex-col border border-[#ccd5ae] space-y-3 w-1/4 p-6 justify-center"
        onSubmit={handleSubmit}
      >
        <input
          required
          className="border-2 border-[#ccd5ae] outline-none py-2 px-2 w-full text-lg bg-[#fefae0]"
          onChange={handleChange}
          placeholder="Username"
          value={formData.username}
          type="text"
          name="username"
          id="username"
        />
        <input
          required
          placeholder="Password"
          className="border-2 border-[#ccd5ae] outline-none py-2 px-2 w-full text-lg bg-[#fefae0]"
          onChange={handleChange}
          value={formData.password}
          type="password"
          name="password"
          id="password"
        />
        <button
          className="border-2 border-[#ccd5ae] py-1 px-3 w-full hover:bg-[#e9edc9] active:bg-[#fefae0]"
          type="submit"
        >
          Sign In
        </button>
      </form>
    </div>
  );
};

export default SignIn;
