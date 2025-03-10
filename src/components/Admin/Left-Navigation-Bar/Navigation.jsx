import { faHome, faCalendarPlus, faArrowRightToBracket, faUsers } from "@fortawesome/free-solid-svg-icons";
import { Link, useNavigate } from "react-router-dom";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import toast from "react-hot-toast";

const Navigation = ({ setShowUserManagement }) => {
  const navigate = useNavigate();
  const Navbar = [
    { Icon: faHome, Title: "Admin Dashboard", path: "/adashboard" },
    { Icon: faUsers, Title: "User Management", action: () => setShowUserManagement(true) } // Updated to use action
  ];

  const LogoutUser = () => {
    localStorage.removeItem('token');
    navigate('/login');
    toast.success('Logged out successfully');
  };

  return (
    <>
      <h1 className="text-center text-3xl mb-7 mt-4 text-blue-800 bg-blue-100 p-5">Eventine</h1>
      <ul>
        {Navbar.map((nav, index) => (
          <li key={index} className="mb-3 border-b border-black text-[15px] cursor-pointer hover:bg-[#3e61bc] text-white p-2 mx-2">
            {nav.action ? (
              <button onClick={nav.action} className="w-full text-left">
                <FontAwesomeIcon icon={nav.Icon} className="pl-[10px] pr-[10px]" />
                <span>{nav.Title}</span>
              </button>
            ) : (
              <Link to={nav.path}>
                <FontAwesomeIcon icon={nav.Icon} className="pl-[10px] pr-[10px]" />
                <span>{nav.Title}</span>
              </Link>
            )}
          </li>
        ))}
      </ul>
      <div className="text-center mt-auto mb-2 cursor-pointer text-white" onClick={LogoutUser}>
        <p className="text-[18px]">
          <span className="max-md:hidden">Logout</span>
          <FontAwesomeIcon icon={faArrowRightToBracket} className="pl-2" />
        </p>
      </div>
    </>
  );
};

export default Navigation;
