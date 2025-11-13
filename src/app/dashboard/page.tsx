'use client';
import Link from 'next/link';
import Image from 'next/image';
import { listings } from '@/lib/dummy-data';
import { Button } from '@/components/ui/button';
import {
  Card,
  CardContent,
  CardDescription,
  CardFooter,
  CardHeader,
  CardTitle,
} from '@/components/ui/card';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Badge } from '@/components/ui/badge';
import { Calendar, MapPin } from 'lucide-react';
import { format } from 'date-fns';
import { useState, useEffect, useContext } from 'react';
import { BookingsContext } from '@/context/bookings-context';

function BookingCard({ bookingId }: { bookingId: string }) {
  const { bookings } = useContext(BookingsContext);
  const booking = bookings.find((b) => b.id === bookingId);
  if (!booking) return null;

  const listing = listings.find((l) => l.id === booking.listingId);
  if (!listing) return null;
  
  const isPast = new Date(booking.endDate) < new Date();

  return (
    <Card>
      <div className="flex flex-col sm:flex-row">
        <div className="sm:w-1/3 relative aspect-video sm:aspect-square">
          {listing.images[0] && (
            <Image
              src={listing.images[0].imageUrl}
              alt={listing.title}
              fill
              className="object-cover rounded-t-lg sm:rounded-l-lg sm:rounded-t-none"
              data-ai-hint={listing.images[0].imageHint}
            />
          )}
        </div>
        <div className="sm:w-2/3 flex flex-col">
          <CardHeader>
            <div className="flex justify-between items-start">
              <CardTitle className="font-headline text-xl">{listing.title}</CardTitle>
              <Badge variant={booking.status === 'confirmed' ? 'default' : 'destructive'} className="capitalize bg-green-500">
                {booking.status}
              </Badge>
            </div>
            <CardDescription className="flex items-center gap-2 pt-1">
              <MapPin className="w-4 h-4" /> {listing.location}
            </CardDescription>
          </CardHeader>
          <CardContent className="flex-grow">
            <div className="flex items-center gap-2 text-sm text-muted-foreground">
                <Calendar className="w-4 h-4" />
                <span>{format(new Date(booking.startDate), 'PPP')}</span>
                <span>-</span>
                <span>{format(new Date(booking.endDate), 'PPP')}</span>
            </div>
            <p className="mt-2 text-sm">Guests: {booking.guests}</p>
          </CardContent>
          <CardFooter className="flex gap-2">
            <Button asChild>
                <Link href={`/listings/${listing.id}`}>View Listing</Link>
            </Button>
            {!isPast && booking.status === 'confirmed' && (
                <Button variant="outline">Cancel Booking</Button>
            )}
          </CardFooter>
        </div>
      </div>
    </Card>
  );
}

export default function DashboardPage() {
    const { bookings } = useContext(BookingsContext);
    const [today, setToday] = useState(new Date());

    useEffect(() => {
        // To avoid hydration mismatch, we set the date on the client.
        const now = new Date();
        now.setHours(0, 0, 0, 0); // Set to start of day for consistent comparison
        setToday(now);
    }, []);

    const upcomingBookings = bookings.filter(b => new Date(b.endDate) >= today);
    const pastBookings = bookings.filter(b => new Date(b.endDate) < today);

  return (
    <div className="container mx-auto px-4 md:px-6 py-8">
      <h1 className="text-3xl md:text-4xl font-headline font-bold mb-8">My Dashboard</h1>
      <Tabs defaultValue="upcoming">
        <TabsList className="grid w-full grid-cols-2 max-w-md">
          <TabsTrigger value="upcoming">Upcoming Trips</TabsTrigger>
          <TabsTrigger value="past">Past Trips</TabsTrigger>
        </TabsList>
        <TabsContent value="upcoming">
            <div className="mt-6 space-y-6">
                {upcomingBookings.length > 0 ? (
                    upcomingBookings.map(booking => <BookingCard key={booking.id} bookingId={booking.id} />)
                ) : (
                    <p className="text-muted-foreground">You have no upcoming trips.</p>
                )}
            </div>
        </TabsContent>
        <TabsContent value="past">
             <div className="mt-6 space-y-6">
                {pastBookings.length > 0 ? (
                    pastBookings.map(booking => <BookingCard key={booking.id} bookingId={booking.id} />)
                ) : (
                    <p className="text-muted-foreground">You have no past trips.</p>
                )}
            </div>
        </TabsContent>
      </Tabs>
    </div>
  );
}
