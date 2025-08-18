import Link from "next/link";
import {
  LayoutDashboard,
  Users,
  Calendar,
  Settings,
  Dumbbell,
  ClipboardList,
  BookUser,
} from "lucide-react";
import { Button } from "@/components/ui/button";
import { cn } from "@/lib/utils";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";

type SidebarProps = {
  role: "admin" | "trainer" | "trainee";
  user?: {
    name: string;
    email: string;
    image?: string;
  };
};

export default function Sidebar({ role, user }: SidebarProps) {
  const adminLinks = [
    { name: "Dashboard", href: "/admin", icon: <LayoutDashboard size={18} /> },
    { name: "Members", href: "/admin/members", icon: <Users size={18} /> },
    { name: "Trainers", href: "/admin/trainers", icon: <BookUser size={18} /> },
    { name: "Classes", href: "/admin/classes", icon: <Dumbbell size={18} /> },
    { name: "Schedule", href: "/admin/schedule", icon: <Calendar size={18} /> },
    { name: "Settings", href: "/admin/settings", icon: <Settings size={18} /> },
  ];

  const trainerLinks = [
    {
      name: "Dashboard",
      href: "/trainer",
      icon: <LayoutDashboard size={18} />,
    },
    { name: "Clients", href: "/trainer/clients", icon: <Users size={18} /> },
    {
      name: "Workouts",
      href: "/trainer/workouts",
      icon: <Dumbbell size={18} />,
    },
    {
      name: "Schedule",
      href: "/trainer/schedule",
      icon: <Calendar size={18} />,
    },
  ];

  const traineeLinks = [
    {
      name: "Dashboard",
      href: "/trainee",
      icon: <LayoutDashboard size={18} />,
    },
    {
      name: "Workouts",
      href: "/trainee/workouts",
      icon: <Dumbbell size={18} />,
    },
    {
      name: "Progress",
      href: "/trainee/progress",
      icon: <ClipboardList size={18} />,
    },
    {
      name: "Schedule",
      href: "/trainee/schedule",
      icon: <Calendar size={18} />,
    },
  ];

  const links =
    role === "admin"
      ? adminLinks
      : role === "trainer"
      ? trainerLinks
      : traineeLinks;

  return (
    <aside className='hidden md:flex md:flex-col md:w-64 bg-background border-r'>
      <div className='p-4 border-b'>
        <h2 className='text-xl font-semibold'>
          {role === "admin"
            ? "Admin"
            : role === "trainer"
            ? "Trainer"
            : "Member"}{" "}
          Dashboard
        </h2>
      </div>

      <nav className='flex-1 p-4 space-y-1'>
        {links.map((link) => (
          <Link
            key={link.name}
            href={link.href}
            className={cn(
              "flex items-center gap-3 px-3 py-2 rounded-md text-sm font-medium hover:bg-accent hover:text-accent-foreground transition-colors",
              link.href === `/${role}` && "bg-accent text-accent-foreground"
            )}>
            {link.icon}
            <span>{link.name}</span>
          </Link>
        ))}
      </nav>

      <div className='p-4 border-t'>
        <div className='flex items-center gap-3 mb-4'>
          <Avatar className='h-8 w-8'>
            <AvatarImage src={user?.image} />
            <AvatarFallback>
              {user?.name
                ?.split(" ")
                .map((n) => n[0])
                .join("")}
            </AvatarFallback>
          </Avatar>
          <div className='text-sm'>
            <p className='font-medium'>{user?.name}</p>
            <p className='text-muted-foreground'>{user?.email}</p>
          </div>
        </div>
        <form>
          <Button
            type='submit'
            variant='ghost'
            className='w-full justify-start text-sm'>
            <Settings size={16} className='mr-2' />
            Sign Out
          </Button>
        </form>
      </div>
    </aside>
  );
}
