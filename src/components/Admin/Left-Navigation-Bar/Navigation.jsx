import { faHome, faCalendarPlus, faArrowRightToBracket } from "@fortawesome/free-solid-svg-icons";
import { Link, useNavigate } from "react-router-dom";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import toast from "react-hot-toast";

const Navigation = ({ setShowCreateModal }) => {
  const navigate = useNavigate();
  const Navbar = [
    { Icon: faHome, Title: "Admin Dashboard", path: "/adashboard" },
    { Icon: faCalendarPlus, Title: "Create Events", action: () => setShowCreateModal(true) }
  ];

  const LogoutUser = () => {
    localStorage.removeItem('token');
    navigate('/login');
    toast.success('Logged out successfully');
  };

  return (
    <>
      <h1 className="text-center text-[17px] mb-7 text-white">Event-Trace</h1>
      <ul>
        {Navbar.map((nav, index) => (
          <li key={index} className="mb-3 border-b border-black text-[15px] cursor-pointer hover:bg-[#3e61bc] hover:text-white p-2 mx-2">
            {nav.path ? <Link to={nav.path}><FontAwesomeIcon icon={nav.Icon} className="pl-[10px] pr-[10px]" /><span>{nav.Title}</span></Link> : <button onClick={nav.action} className="w-full text-left"><FontAwesomeIcon icon={nav.Icon} className="pl-[10px] pr-[10px]" /><span>{nav.Title}</span></button>}
          </li>
        ))}
      </ul>
      <div className="text-center mt-auto mb-2 cursor-pointer hover:text-white" onClick={LogoutUser}><p className="text-[18px]"><span className="max-md:hidden">Logout</span><FontAwesomeIcon icon={faArrowRightToBracket} className="pl-2" /></p></div>
    </>
  );
};
export default Navigation;