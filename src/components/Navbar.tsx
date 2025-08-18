"use client";
import Link from "next/link";
import { Button } from "@/components/ui/button";
import { Menu, X } from "lucide-react";
import { useState } from "react";
import { NAV_LINKS } from "@/lib/constants";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";

export default function Navbar() {
  const [isOpen, setIsOpen] = useState(false);
  const [isLoggedIn, setIsLoggedIn] = useState(false);

  return (
    <header className='bg-background sticky top-0 z-50 border-b w-full'>
      <div className='container mx-auto px-4 py-3 flex justify-between items-center  w-full md:max-w-[90%]'>
        <Link href='/' className='text-2xl font-bold'>
          FitPro
        </Link>

        {/* Desktop Navigation */}
        <nav className='hidden md:flex items-center gap-6'>
          {NAV_LINKS.map((link) => (
            <Link
              key={link.name}
              href={link.href}
              className='text-sm font-medium text-muted-foreground hover:text-primary transition-colors'>
              {link.name}
            </Link>
          ))}

          {isLoggedIn ? (
            <DropdownMenu>
              <DropdownMenuTrigger asChild>
                <Button
                  variant='ghost'
                  className='relative h-8 w-8 rounded-full'>
                  <Avatar className='h-8 w-8'>
                    <AvatarImage src='/avatars/user.png' alt='User' />
                    <AvatarFallback>U</AvatarFallback>
                  </Avatar>
                </Button>
              </DropdownMenuTrigger>
              <DropdownMenuContent className='w-56' align='end' forceMount>
                <DropdownMenuItem>Profile</DropdownMenuItem>
                <DropdownMenuItem>Settings</DropdownMenuItem>
                <DropdownMenuItem onClick={() => setIsLoggedIn(false)}>
                  Logout
                </DropdownMenuItem>
              </DropdownMenuContent>
            </DropdownMenu>
          ) : (
            <div className='flex gap-2'>
              <Button
                variant='outline'
                size='sm'
                onClick={() => setIsLoggedIn(true)}>
                Login
              </Button>
              <Button size='sm' onClick={() => setIsLoggedIn(true)}>
                Sign Up
              </Button>
            </div>
          )}
        </nav>

        {/* Mobile Navigation */}
        <Button
          variant='ghost'
          size='icon'
          className='md:hidden'
          onClick={() => setIsOpen(!isOpen)}>
          {isOpen ? <X size={20} /> : <Menu size={20} />}
        </Button>
      </div>

      {/* Mobile Menu */}
      {isOpen && (
        <div className='md:hidden bg-background pb-4 px-4 border-b'>
          <div className='flex flex-col space-y-3'>
            {NAV_LINKS.map((link) => (
              <Link
                key={link.name}
                href={link.href}
                className='text-sm font-medium py-2 px-4 rounded hover:bg-accent'
                onClick={() => setIsOpen(false)}>
                {link.name}
              </Link>
            ))}
            <div className='flex gap-2 pt-2'>
              <Button
                variant='outline'
                className='w-full'
                size='sm'
                onClick={() => {
                  setIsLoggedIn(true);
                  setIsOpen(false);
                }}>
                Login
              </Button>
              <Button
                className='w-full'
                size='sm'
                onClick={() => {
                  setIsLoggedIn(true);
                  setIsOpen(false);
                }}>
                Sign Up
              </Button>
            </div>
          </div>
        </div>
      )}
    </header>
  );
}
