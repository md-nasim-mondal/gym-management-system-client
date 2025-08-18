'use client';

import { useAppSelector } from '@/redux/hooks';
import { useRouter } from 'next/navigation';
import { useEffect, useState } from 'react';
import { FaCalendarAlt, FaHome, FaSignOutAlt, FaUser, FaUsers } from 'react-icons/fa';
import { MdClass } from 'react-icons/md';
import Link from 'next/link';
import { logoutUser } from '@/redux/features/auth/authSlice';
import { useAppDispatch } from '@/redux/hooks';
import { toast } from 'sonner';

export default function DashboardLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  const { user, isLoading } = useAppSelector((state) => state.auth);
  const router = useRouter();
  const dispatch = useAppDispatch();
  const [isSidebarOpen, setIsSidebarOpen] = useState(true);

  useEffect(() => {
    if (!isLoading && !user) {
      router.push('/login');
    }
  }, [user, isLoading, router]);

  const handleLogout = () => {
    dispatch(logoutUser())
      .unwrap()
      .then(() => {
        toast.success('Logged out successfully');
        router.push('/login');
      })
      .catch((error) => {
        toast.error(error.message || 'Failed to logout');
      });
  };

  // Define menu items based on user role
  const getMenuItems = () => {
    if (!user) return [];

    const commonItems = [
      {
        name: 'Profile',
        path: `/${user.role}/profile`,
        icon: <FaUser className="w-5 h-5" />,
      },
    ];

    if (user.role === 'admin' || user.role === 'super_admin') {
      return [
        {
          name: 'Dashboard',
          path: '/admin',
          icon: <FaHome className="w-5 h-5" />,
        },
        {
          name: 'Manage Users',
          path: '/admin/users',
          icon: <FaUsers className="w-5 h-5" />,
        },
        {
          name: 'Manage Classes',
          path: '/admin/classes',
          icon: <MdClass className="w-5 h-5" />,
        },
        ...commonItems,
      ];
    } else if (user.role === 'trainer') {
      return [
        {
          name: 'Dashboard',
          path: '/trainer',
          icon: <FaHome className="w-5 h-5" />,
        },
        {
          name: 'My Classes',
          path: '/trainer/classes',
          icon: <MdClass className="w-5 h-5" />,
        },
        {
          name: 'Schedule',
          path: '/trainer/schedule',
          icon: <FaCalendarAlt className="w-5 h-5" />,
        },
        ...commonItems,
      ];
    } else if (user.role === 'trainee') {
      return [
        {
          name: 'Dashboard',
          path: '/trainee',
          icon: <FaHome className="w-5 h-5" />,
        },
        {
          name: 'Book Class',
          path: '/trainee/booking',
          icon: <MdClass className="w-5 h-5" />,
        },
        {
          name: 'My Bookings',
          path: '/trainee/my-bookings',
          icon: <FaCalendarAlt className="w-5 h-5" />,
        },
        ...commonItems,
      ];
    }

    return commonItems;
  };

  const menuItems = getMenuItems();

  if (isLoading || !user) {
    return (
      <div className="flex items-center justify-center min-h-screen">
        <div className="w-16 h-16 border-4 border-blue-500 border-t-transparent rounded-full animate-spin"></div>
      </div>
    );
  }

  return (
    <div className="flex h-screen bg-gray-100">
      {/* Sidebar */}
      <div
        className={`${isSidebarOpen ? 'w-64' : 'w-20'} bg-gray-800 text-white transition-all duration-300 ease-in-out`}
      >
        <div className="p-4 flex items-center justify-between">
          {isSidebarOpen && (
            <h2 className="text-xl font-bold">Gym Management</h2>
          )}
          <button
            onClick={() => setIsSidebarOpen(!isSidebarOpen)}
            className="p-2 rounded-md hover:bg-gray-700"
          >
            <svg
              xmlns="http://www.w3.org/2000/svg"
              className="h-6 w-6"
              fill="none"
              viewBox="0 0 24 24"
              stroke="currentColor"
            >
              {isSidebarOpen ? (
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  strokeWidth={2}
                  d="M11 19l-7-7 7-7m8 14l-7-7 7-7"
                />
              ) : (
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  strokeWidth={2}
                  d="M4 6h16M4 12h16m-7 6h7"
                />
              )}
            </svg>
          </button>
        </div>

        <nav className="mt-6">
          <ul>
            {menuItems.map((item, index) => (
              <li key={index} className="mb-2">
                <Link
                  href={item.path}
                  className="flex items-center px-4 py-3 hover:bg-gray-700 rounded-md transition-colors"
                >
                  <span className="mr-3">{item.icon}</span>
                  {isSidebarOpen && <span>{item.name}</span>}
                </Link>
              </li>
            ))}
            <li className="mb-2">
              <button
                onClick={handleLogout}
                className="w-full flex items-center px-4 py-3 hover:bg-gray-700 rounded-md transition-colors text-red-400"
              >
                <span className="mr-3">
                  <FaSignOutAlt className="w-5 h-5" />
                </span>
                {isSidebarOpen && <span>Logout</span>}
              </button>
            </li>
          </ul>
        </nav>
      </div>

      {/* Main Content */}
      <div className="flex-1 overflow-auto">
        {/* Header */}
        <header className="bg-white shadow-md p-4">
          <div className="flex justify-between items-center">
            <h1 className="text-xl font-semibold">
              {user.role.charAt(0).toUpperCase() + user.role.slice(1)} Dashboard
            </h1>
            <div className="flex items-center space-x-4">
              <div className="text-right">
                <p className="font-medium">{user.name}</p>
                <p className="text-sm text-gray-500">{user.email}</p>
              </div>
              <div className="w-10 h-10 rounded-full bg-blue-500 flex items-center justify-center text-white font-bold">
                {user.name.charAt(0).toUpperCase()}
              </div>
            </div>
          </div>
        </header>

        {/* Page Content */}
        <main className="p-6">{children}</main>
      </div>
    </div>
  );
}