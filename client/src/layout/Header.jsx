import { Link } from "react-router-dom";
import { useUserContext } from "../context/userContext";
import { useMutation } from "@tanstack/react-query";
import { signOut } from "../services/userService";

const Header = () => {
  const { user, logout } = useUserContext();
  const { mutate } = useMutation({
    mutationKey: ["signout"],
    mutationFn: signOut,
    onSuccess: () => {
      logout();
    },
  });
  return (
    <div className="w-full flex h-fit py-4 px-16 border-b border-b-[#d4a373]">
      <h1 className="mr-auto font-extrabold text-4xl">
        <Link to={"/"}>Todo</Link>
      </h1>
      <ul className="flex justify-end items-center space-x-2">
        {user.isUser ? (
          <li>
            <button
              className="bg-[#fefae0] border-2 border-[#ccd5ae] py-1 px-3 hover:bg-[#e9edc9] active:bg-[#fefae0] "
              // to={"/signout"}
              onClick={() => mutate(user.refreshToken)}
            >
              Sign Out
            </button>
          </li>
        ) : (
          <>
            <li>
              <Link
                className="bg-[#fefae0] border-2 border-[#ccd5ae] py-1 px-3 hover:bg-[#e9edc9] active:bg-[#fefae0]"
                to={"/signup"}
              >
                Sign Up
              </Link>
            </li>
            <li>
              <Link
                className="bg-[#fefae0] border-2 border-[#ccd5ae] py-1 px-3 hover:bg-[#e9edc9] active:bg-[#fefae0]"
                to={"/signin"}
              >
                Login
              </Link>
            </li>
          </>
        )}
      </ul>
    </div>
  );
};

export default Header;
