'use client';

import { useState } from 'react';
import Link from 'next/link';
import {
  Card,
  CardContent,
  CardFooter,
  CardHeader,
} from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Separator } from '@/components/ui/separator';
import { Calendar } from '@/components/ui/calendar';
import { Users, CalendarDays } from 'lucide-react';
import { formatPrice } from '@/lib/utils';
import type { Listing } from '@/lib/types';
import { Label } from '@/components/ui/label';

export function BookingWidget({ listing }: { listing: Listing }) {
  const [date, setDate] = useState<Date | undefined>(new Date());
  const [guests, setGuests] = useState(1);

  const isPerPerson = listing.type === 'tour' || listing.type === 'package';
  
  const basePrice = listing.basePrice;
  const serviceFee = 2800; // Approx 35 USD in INR
  const pricePerItem = isPerPerson ? basePrice * guests : basePrice;
  const taxes = pricePerItem * 0.1;
  const totalPrice = pricePerItem + serviceFee + taxes;


  const handleGuestChange = (amount: number) => {
    setGuests((prev) => Math.max(1, Math.min(listing.capacity, prev + amount)));
  };

  return (
    <Card className="shadow-lg">
      <CardHeader>
        <div className="flex justify-between items-center">
          <p className="text-2xl font-bold font-headline">
            {formatPrice(listing.basePrice)}
          </p>
          <span className="text-sm font-normal text-muted-foreground">
            /{listing.type === 'hotel' ? 'night' : 'person'}
          </span>
        </div>
      </CardHeader>
      <CardContent className="space-y-4">
        <div className="space-y-2">
          <Label htmlFor="date" className="flex items-center">
            <CalendarDays className="mr-2 h-4 w-4" />
            Dates
          </Label>
          <Calendar
            mode="single"
            selected={date}
            onSelect={setDate}
            className="rounded-md border p-0"
            disabled={(date) => date < new Date(new Date().setHours(0, 0, 0, 0))}
          />
        </div>
        <div className="space-y-2">
          <Label htmlFor="guests" className="flex items-center">
            <Users className="mr-2 h-4 w-4" />
            Guests
          </Label>
          <div className="flex items-center gap-2">
            <Button
              variant="outline"
              size="icon"
              onClick={() => handleGuestChange(-1)}
              disabled={guests <= 1}
            >
              -
            </Button>
            <span className="font-bold w-12 text-center">{guests}</span>
            <Button
              variant="outline"
              size="icon"
              onClick={() => handleGuestChange(1)}
              disabled={guests >= listing.capacity}
            >
              +
            </Button>
          </div>
        </div>
        <Separator />
        <div className="space-y-2 text-sm">
          <div className="flex justify-between">
            <span className="text-muted-foreground">
              {formatPrice(listing.basePrice)} x {isPerPerson ? guests : 1}{' '}
              {listing.type === 'hotel' ? 'night(s)' : 'person(s)'}
            </span>
            <span>{formatPrice(pricePerItem)}</span>
          </div>
          <div className="flex justify-between">
            <span className="text-muted-foreground">Service fee</span>
            <span>{formatPrice(serviceFee)}</span>
          </div>
          <div className="flex justify-between">
            <span className="text-muted-foreground">Taxes</span>
            <span>{formatPrice(taxes)}</span>
          </div>
        </div>
        <Separator />
        <div className="flex justify-between font-bold text-lg">
          <span>Total</span>
          <span>{formatPrice(totalPrice)}</span>
        </div>
      </CardContent>
      <CardFooter>
        <Button asChild size="lg" className="w-full">
          <Link href={`/book/${listing.id}`}>Book Now</Link>
        </Button>
      </CardFooter>
    </Card>
  );
}
