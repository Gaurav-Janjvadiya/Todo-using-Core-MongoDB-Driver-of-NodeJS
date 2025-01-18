import { Link } from "react-router-dom";

const Header = () => {
  return (
    <div className="w-full flex h-fit py-4 px-16 border-b border-b-[#d4a373]">
      <h1 className="mr-auto font-extrabold text-4xl">
        <Link to={"/"}>Todo</Link>
      </h1>
      <ul className="flex justify-end items-center space-x-2">
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
            Sign In
          </Link>
        </li>
        <li>
          <Link
            className="bg-[#fefae0] border-2 border-[#ccd5ae] py-1 px-3 hover:bg-[#e9edc9] active:bg-[#fefae0] "
            to={"/signout"}
          >
            Sign Out
          </Link>
        </li>
      </ul>
    </div>
  );
};

export default Header;
