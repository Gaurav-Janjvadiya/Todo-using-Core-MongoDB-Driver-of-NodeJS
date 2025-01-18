import { useState } from "react";
import { signUp } from "../../services/userService";
import { useQueryClient, useMutation } from "@tanstack/react-query";

const SignUp = () => {
  const [formData, setFormData] = useState({
    username: "",
    email: "",
    password: "",
  });
  const handleChange = (e) => {
    setFormData((prev) => ({ ...prev, [e.target.name]: e.target.value }));
  };
  const signUpMutatio = useMutation({
    mutationKey: ["signUpUser"],
    mutationFn: signUp,
  });
  const handleSubmit = (e) => {
    e.preventDefault();
    signUpMutatio.mutate(formData);
    setFormData({
      username: "",
      email: "",
      password: "",
    });
  };
  return (
    <div className="h-[80vh] w-full flex items-center justify-center">
      <form
        className="flex items-center flex-col border border-[#ccd5ae] space-y-3 w-1/4 p-6 justify-center"
        onSubmit={handleSubmit}
      >
        <input
          className="border-2 border-[#ccd5ae] outline-none py-2 px-2 w-full text-lg bg-[#fefae0]"
          onChange={handleChange}
          value={formData.username}
          type="text"
          name="username"
          id="username"
        />
        <input
          className="border-2 border-[#ccd5ae] outline-none py-2 px-2 w-full text-lg bg-[#fefae0]"
          onChange={handleChange}
          value={formData.email}
          type="email"
          name="email"
          id="email"
        />
        <input
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
          Sign Up
        </button>
      </form>
    </div>
  );
};

export default SignUp;
