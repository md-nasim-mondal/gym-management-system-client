import React from "react";

type DashboardHeaderProps = {
  user: {
    name: string;
    email: string;
    role: string;
    picture?: string;
  };
};

const DashboardHeader = ({ user }: DashboardHeaderProps) => {
  return (
    <header className='bg-white shadow-md p-4'>
      <div className='flex justify-between items-center'>
        <h1 className='text-xl font-semibold'>
          {user?.role === "super_admin"
            ? "Super Admin"
            : user.role.charAt(0).toUpperCase() + user.role.slice(1)}{" "}
          Dashboard
        </h1>
        <div className='flex items-center space-x-4'>
          <div className='text-right'>
            <p className='font-medium'>{user.name}</p>
            <p className='text-sm text-gray-500'>{user.email}</p>
          </div>
          <div className='w-10 h-10 rounded-full bg-blue-500 flex items-center justify-center text-white font-bold'>
            {user.name.charAt(0).toUpperCase()}
          </div>
        </div>
      </div>
    </header>
  );
};

export default DashboardHeader;
