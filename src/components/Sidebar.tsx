import Link from "next/link";
import { useAppDispatch } from "@/redux/hooks";
import { logoutUser } from "@/redux/features/auth/authSlice";
import { useRouter } from "next/navigation";
import { FaCalendarAlt, FaHome, FaSignOutAlt, FaUser, FaUsers } from "react-icons/fa";
import { MdClass } from "react-icons/md";

type SidebarProps = {
  user: {
    role: string;
    name: string;
    email: string;
    picture?: string;
  };
  isSidebarOpen: boolean;
  setIsSidebarOpen: (isOpen: boolean) => void;
};

export default function Sidebar({user,
  isSidebarOpen,
  setIsSidebarOpen,
}: SidebarProps) {
  const router = useRouter();
  const dispatch = useAppDispatch();
  const handleLogout = async () => {
    try {
      await dispatch(logoutUser()).unwrap();
      router.push("/login");
    } catch (error) {
      console.error("Logout failed:", error);
    }
  };
  

  // Define menu items based on user role
  const getMenuItems = () => {
    if (!user) return [];

    const commonItems = [
      {
        name: "Profile",
        path: `/dashboard/profile`,
        icon: <FaUser className='w-5 h-5' />,
      },
    ];

    if (user.role === "admin" || user.role === "super_admin") {
      return [
        {
          name: "Dashboard",
          path: "/dashboard/admin",
          icon: <FaHome className='w-5 h-5' />,
        },
        {
          name: "Manage Users",
          path: "/dashboard/admin/users",
          icon: <FaUsers className='w-5 h-5' />,
        },
        {
          name: "Manage Classes",
          path: "/dashboard/admin/classes",
          icon: <MdClass className='w-5 h-5' />,
        },
        ...commonItems,
      ];
    } else if (user.role === "trainer") {
      return [
        {
          name: "Dashboard",
          path: "/dashboard/trainer",
          icon: <FaHome className='w-5 h-5' />,
        },
        {
          name: "My Classes",
          path: "/dashboard/trainer/classes",
          icon: <MdClass className='w-5 h-5' />,
        },
        {
          name: "Schedule",
          path: "/dashboard/trainer/schedules",
          icon: <FaCalendarAlt className='w-5 h-5' />,
        },
        ...commonItems,
      ];
    } else if (user.role === "trainee") {
      return [
        {
          name: "Dashboard",
          path: "/dashboard/trainee",
          icon: <FaHome className='w-5 h-5' />,
        },
        {
          name: "Book Class",
          path: "/dashboard/trainee/booking",
          icon: <MdClass className='w-5 h-5' />,
        },
        {
          name: "My Bookings",
          path: "/dashboard/trainee/bookings",
          icon: <FaCalendarAlt className='w-5 h-5' />,
        },
        ...commonItems,
      ];
    }

    return commonItems;
  };

  const menuItems = getMenuItems();

  return (
    <div
      className={`${
        isSidebarOpen ? "w-64" : "w-20"
      } bg-gray-800 text-white transition-all duration-300 ease-in-out`}>
      <div className='p-4 flex items-center justify-between'>
        {isSidebarOpen && (
          <h2 onClick={() => router.push("/")} className='text-xl font-bold'>
            FitPro
          </h2>
        )}
        <button
          onClick={() => setIsSidebarOpen(!isSidebarOpen)}
          className='p-2 rounded-md hover:bg-gray-700'>
          <svg
            xmlns='http://www.w3.org/2000/svg'
            className='h-6 w-6'
            fill='none'
            viewBox='0 0 24 24'
            stroke='currentColor'>
            {isSidebarOpen ? (
              <path
                strokeLinecap='round'
                strokeLinejoin='round'
                strokeWidth={2}
                d='M11 19l-7-7 7-7m8 14l-7-7 7-7'
              />
            ) : (
              <path
                strokeLinecap='round'
                strokeLinejoin='round'
                strokeWidth={2}
                d='M4 6h16M4 12h16m-7 6h7'
              />
            )}
          </svg>
        </button>
      </div>

      <nav className='mt-6'>
        <ul>
          {menuItems.map((item, index) => (
            <li key={index} className='mb-2'>
              <Link
                href={item.path}
                className='flex items-center px-4 py-3 hover:bg-gray-700 rounded-md transition-colors'>
                <span className='mr-3'>{item.icon}</span>
                {isSidebarOpen && <span>{item.name}</span>}
              </Link>
            </li>
          ))}
          <li className='mb-2'>
            <button
              onClick={handleLogout}
              className='w-full flex items-center px-4 py-3 hover:bg-gray-700 rounded-md transition-colors text-red-400'>
              <span className='mr-3'>
                <FaSignOutAlt className='w-5 h-5' />
              </span>
              {isSidebarOpen && <span>Logout</span>}
            </button>
          </li>
        </ul>
      </nav>
    </div>
  );
}
