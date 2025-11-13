'use client';
import {
  SidebarProvider,
  Sidebar,
  SidebarHeader,
  SidebarContent,
  SidebarTrigger,
  SidebarMenu,
  SidebarMenuItem,
  SidebarMenuButton,
  SidebarInset,
} from '@/components/ui/sidebar';
import {
  LayoutGrid,
  Calendar,
  Ticket,
  BedDouble,
  Users,
  Wand,
  Settings,
} from 'lucide-react';
import { WanderlyIcon } from '@/components/icons';
import {
  Card,
  CardContent,
  CardHeader,
  CardTitle,
} from '@/components/ui/card';
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from '@/components/ui/table';
import { Badge } from '@/components/ui/badge';
import { bookings, listings } from '@/lib/dummy-data';
import { formatPrice } from '@/lib/utils';

const menuItems = [
  { icon: LayoutGrid, label: 'Dashboard', href: '#' },
  { icon: Ticket, label: 'Bookings', href: '#' },
  { icon: Wand, label: 'Tours', href: '#' },
  { icon: BedDouble, label: 'Hotels', href: '#' },
  { icon: Calendar, label: 'Availability', href: '#' },
  { icon: Users, label: 'Users', href: '#' },
  { icon: Settings, label: 'Settings', href: '#' },
];

export default function AdminPage() {
  return (
    <SidebarProvider>
      <Sidebar>
        <SidebarHeader className="border-b">
          <div className="flex items-center gap-2 p-2">
            <WanderlyIcon className="h-7 w-7 text-primary" />
            <span className="text-lg font-bold font-headline">Wanderly Admin</span>
          </div>
        </SidebarHeader>
        <SidebarContent>
          <SidebarMenu>
            {menuItems.map((item) => (
              <SidebarMenuItem key={item.label}>
                <SidebarMenuButton
                  tooltip={item.label}
                  isActive={item.label === 'Bookings'}
                >
                  <item.icon />
                  <span>{item.label}</span>
                </SidebarMenuButton>
              </SidebarMenuItem>
            ))}
          </SidebarMenu>
        </SidebarContent>
      </Sidebar>
      <SidebarInset>
        <header className="flex items-center justify-between p-4 border-b">
            <div className="flex items-center gap-4">
                <h1 className="text-xl font-semibold font-headline">Bookings</h1>
            </div>
        </header>
        <main className="p-4 md:p-6">
          <Card>
            <CardHeader>
              <CardTitle>Recent Bookings</CardTitle>
            </CardHeader>
            <CardContent>
              <Table>
                <TableHeader>
                  <TableRow>
                    <TableHead>Listing</TableHead>
                    <TableHead>Dates</TableHead>
                    <TableHead>Guests</TableHead>
                    <TableHead>Status</TableHead>
                    <TableHead className="text-right">Total</TableHead>
                  </TableRow>
                </TableHeader>
                <TableBody>
                  {bookings.map((booking) => {
                    const listing = listings.find(
                      (l) => l.id === booking.listingId
                    );
                    return (
                      <TableRow key={booking.id}>
                        <TableCell className="font-medium">
                          {listing?.title}
                        </TableCell>
                        <TableCell>
                          {booking.startDate} - {booking.endDate}
                        </TableCell>
                        <TableCell>{booking.guests}</TableCell>
                        <TableCell>
                          <Badge className={booking.status === 'confirmed' ? 'bg-green-500 border-transparent text-white' : 'bg-destructive'}>
                            {booking.status}
                          </Badge>
                        </TableCell>
                        <TableCell className="text-right">
                          {formatPrice(booking.priceTotal)}
                        </TableCell>
                      </TableRow>
                    );
                  })}
                </TableBody>
              </Table>
            </CardContent>
          </Card>
        </main>
      </SidebarInset>
    </SidebarProvider>
  );
}
