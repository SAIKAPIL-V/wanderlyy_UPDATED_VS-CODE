
'use client';

import Link from 'next/link';
import { Button } from '@/components/ui/button';
import {
  Sheet,
  SheetContent,
  SheetTrigger,
  SheetClose,
  SheetHeader,
  SheetTitle,
  SheetDescription,
} from '@/components/ui/sheet';
import {
  Menu,
  Search,
  Hotel,
  Package,
  Info,
  Mail,
  User,
  LogOut,
  LayoutDashboard,
  Home,
  Map,
} from 'lucide-react';
import { WanderlyIcon } from './icons';
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from './ui/dropdown-menu';
import { Avatar, AvatarFallback, AvatarImage } from './ui/avatar';
import { usePathname } from 'next/navigation';
import { cn } from '@/lib/utils';
import { useUser, useAuth } from '@/firebase';
import { signOut } from 'firebase/auth';
import { useRouter } from 'next/navigation';

const navLinks = [
  { href: '/home', label: 'Home', icon: Home },
  { href: '/search', label: 'Search', icon: Search },
  { href: '/search?type=tour,package', label: 'Places', icon: Map },
  { href: '/packages', label: 'Packages', icon: Package },
  { href: '/hotels', label: 'Hotels', icon: Hotel },
  { href: '/about', label: 'About', icon: Info },
  { href: '/contact', label: 'Contact', icon: Mail },
];

export function Header() {
  const pathname = usePathname();
  const { user, isUserLoading } = useUser();
  const auth = useAuth();
  const router = useRouter();

  const handleLogout = async () => {
    await signOut(auth);
    router.push('/');
  };
  
  const isLoggedIn = !!user;

  const renderNavLinks = (isMobile: boolean) =>
    navLinks.map((link) => {
      const isActive = pathname === link.href;
      
      const linkContent = (
        <>
          <link.icon className="mr-2 h-4 w-4" />
          {link.label}
        </>
      );

      if (isMobile) {
        return (
           <SheetClose asChild key={link.href}>
             <Button
                variant="ghost"
                asChild
                className={cn(
                  'justify-start w-full text-lg py-6',
                  isActive
                    ? 'bg-accent text-accent-foreground'
                    : 'text-muted-foreground'
                )}
              >
              <Link href={link.href}>{linkContent}</Link>
            </Button>
          </SheetClose>
        )
      }

      return (
        <Button
          key={link.href}
          variant="ghost"
          asChild
          className={cn(
            'justify-start',
            isActive
              ? 'bg-accent text-accent-foreground'
              : 'text-muted-foreground'
          )}
        >
          <Link href={link.href}>{linkContent}</Link>
        </Button>
      );
    });

  return (
    <header className="sticky top-0 z-50 w-full border-b bg-background/95 backdrop-blur supports-[backdrop-filter]:bg-background/60">
      <div className="container flex h-16 items-center">
        <Sheet>
          <SheetTrigger asChild>
            <Button variant="ghost" size="icon" className="md:hidden">
              <Menu className="h-6 w-6" />
              <span className="sr-only">Toggle Menu</span>
            </Button>
          </SheetTrigger>
          <SheetContent side="left" className="p-4">
             <SheetHeader className="sr-only">
              <SheetTitle>Navigation Menu</SheetTitle>
              <SheetDescription>Main navigation links for Wanderly</SheetDescription>
            </SheetHeader>
            <Link href="/" className="mb-8 flex items-center gap-2 text-lg font-bold font-headline">
              <SheetClose asChild>
                <WanderlyIcon className="h-6 w-6 text-primary" />
              </SheetClose>
              <SheetClose asChild>
                <span>Wanderly</span>
              </SheetClose>
            </Link>
            <nav className="flex flex-col gap-2">{isLoggedIn && renderNavLinks(true)}</nav>
          </SheetContent>
        </Sheet>
        <div className="hidden md:flex items-center gap-6">
          <Link
            href={isLoggedIn ? "/home" : "/"}
            className="flex items-center gap-2 text-lg font-bold font-headline"
          >
            <WanderlyIcon className="h-6 w-6 text-primary" />
            <span>Wanderly</span>
          </Link>
          {isLoggedIn && <nav className="flex items-center gap-2">
            {renderNavLinks(false)}
          </nav>}
        </div>

        <div className="flex flex-1 items-center justify-end gap-4">
          {isUserLoading ? null : isLoggedIn ? (
            <DropdownMenu>
              <DropdownMenuTrigger asChild>
                <Button variant="ghost" className="relative h-9 w-9 rounded-full">
                  <Avatar className="h-9 w-9">
                    <AvatarFallback>{user.displayName?.charAt(0) || user.email?.charAt(0) || 'U'}</AvatarFallback>
                  </Avatar>
                </Button>
              </DropdownMenuTrigger>
              <DropdownMenuContent className="w-56" align="end" forceMount>
                <DropdownMenuLabel className="font-normal">
                  <div className="flex flex-col space-y-1">
                    <p className="text-sm font-medium leading-none">{user.displayName || 'User'}</p>
                    <p className="text-xs leading-none text-muted-foreground">
                      {user.email}
                    </p>
                  </div>
                </DropdownMenuLabel>
                <DropdownMenuSeparator />
                <DropdownMenuItem asChild>
                  <Link href="/dashboard">
                    <LayoutDashboard className="mr-2 h-4 w-4" />
                    <span>Dashboard</span>
                  </Link>
                </DropdownMenuItem>
                <DropdownMenuSeparator />
                <DropdownMenuItem onClick={handleLogout}>
                  <LogOut className="mr-2 h-4 w-4" />
                  <span>Log out</span>
                </DropdownMenuItem>
              </DropdownMenuContent>
            </DropdownMenu>
          ) : (
            pathname !== '/' && (
            <Button asChild>
              <Link href="/">Login</Link>
            </Button>
            )
          )}
        </div>
      </div>
    </header>
  );
}
