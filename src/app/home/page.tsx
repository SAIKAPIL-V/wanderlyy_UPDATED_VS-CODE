
'use client';

import Image from 'next/image';
import Link from 'next/link';
import { useState } from 'react';
import { format } from 'date-fns';
import { cn } from '@/lib/utils';
import { Button } from '@/components/ui/button';
import { Card, CardContent } from '@/components/ui/card';
import { Input } from '@/components/ui/input';
import { Popover, PopoverContent, PopoverTrigger } from '@/components/ui/popover';
import { Calendar } from '@/components/ui/calendar';
import {
  Calendar as CalendarIcon,
  MapPin,
  Users,
  Search,
} from 'lucide-react';
import { listings } from '@/lib/dummy-data';
import { ListingCard } from '@/components/listing-card';
import { placeholderImages } from '@/lib/placeholder-images';
import { useRouter } from 'next/navigation';

export default function HomePage() {
  const router = useRouter();
  const heroImage = placeholderImages.find((img) => img.id === 'hero');
  const featuredPlaces = listings.filter(l => l.type === 'tour' || l.type === 'package').slice(0, 4);
  const featuredHotels = listings.filter(l => l.type === 'hotel').slice(0, 4);
  
  const [destination, setDestination] = useState('');
  const [date, setDate] = useState<Date | undefined>();
  const [guests, setGuests] = useState('');

  const handleSearch = (e: React.FormEvent) => {
    e.preventDefault();
    const params = new URLSearchParams();
    if (destination) {
      params.set('location', destination);
    }
    if (date) {
      params.set('date', format(date, 'yyyy-MM-dd'));
    }
    if (guests) {
      params.set('guests', guests);
    }
    router.push(`/search?${params.toString()}`);
  };

  const isSearchDisabled = !destination || !date || !guests;

  return (
    <div className="flex flex-col min-h-dvh">
      <section className="relative w-full h-[60vh] md:h-[70vh] flex items-center justify-center text-center text-white">
        {heroImage && (
          <Image
            src={heroImage.imageUrl}
            alt={heroImage.description}
            fill
            className="object-cover"
            priority
            data-ai-hint={heroImage.imageHint}
          />
        )}
        <div className="absolute inset-0 bg-black/50" />
        <div className="relative z-10 px-4 md:px-6">
          <h1 className="text-4xl md:text-6xl font-headline font-bold tracking-tighter">
            Find Your Next Adventure
          </h1>
          <p className="mt-4 max-w-2xl mx-auto text-lg md:text-xl text-primary-foreground/90">
            Discover and book unique tours, hotels, and packages around the
            world.
          </p>

          <Card className="mt-8 max-w-4xl mx-auto p-4 md:p-6 bg-background/90 backdrop-blur-sm">
            <CardContent className="p-0">
              <form onSubmit={handleSearch} className="grid grid-cols-1 md:grid-cols-12 gap-4 items-end">
                <div className="md:col-span-4 space-y-2">
                  <label htmlFor="destination" className="text-sm font-medium text-left text-foreground">
                    Destination
                  </label>
                  <div className="relative">
                    <MapPin className="absolute left-3 top-1/2 -translate-y-1/2 h-5 w-5 text-muted-foreground" />
                    <Input 
                      id="destination" 
                      placeholder="e.g., Paris, France" 
                      className="pl-10" 
                      value={destination}
                      onChange={(e) => setDestination(e.target.value)}
                    />
                  </div>
                </div>
                <div className="md:col-span-3 space-y-2">
                  <label htmlFor="date" className="text-sm font-medium text-left text-foreground">
                    Date
                  </label>
                  <Popover>
                    <PopoverTrigger asChild>
                      <Button
                        variant={"outline"}
                        className={cn(
                          "w-full justify-start text-left font-normal",
                          !date && "text-muted-foreground"
                        )}
                      >
                        <CalendarIcon className="mr-2 h-4 w-4" />
                        {date ? format(date, "PPP") : <span>Pick a date</span>}
                      </Button>
                    </PopoverTrigger>
                    <PopoverContent className="w-auto p-0">
                      <Calendar
                        mode="single"
                        selected={date}
                        onSelect={setDate}
                        disabled={(date) => date < new Date(new Date().setHours(0, 0, 0, 0))}
                        initialFocus
                      />
                    </PopoverContent>
                  </Popover>
                </div>
                <div className="md:col-span-3 space-y-2">
                  <label htmlFor="guests" className="text-sm font-medium text-left text-foreground">
                    Guests
                  </label>
                  <div className="relative">
                    <Users className="absolute left-3 top-1/2 -translate-y-1/2 h-5 w-5 text-muted-foreground" />
                    <Input 
                      id="guests" 
                      type="number" 
                      placeholder="2" 
                      className="pl-10" 
                      value={guests}
                      onChange={(e) => setGuests(e.target.value)}
                      min="1"
                    />
                  </div>
                </div>
                <div className="md:col-span-2">
                  <Button type="submit" className="w-full" disabled={isSearchDisabled}>
                      <Search className="mr-2 h-4 w-4" />
                      Search
                  </Button>
                </div>
              </form>
            </CardContent>
          </Card>
        </div>
      </section>

      <section className="py-12 md:py-20 bg-background">
        <div className="container mx-auto px-4 md:px-6">
          <div className="text-center">
            <h2 className="text-3xl md:text-4xl font-headline font-bold">
              Featured Places
            </h2>
            <p className="mt-2 text-muted-foreground md:text-lg">
              Explore our hand-picked selection of top-rated tours and packages.
            </p>
          </div>
          <div className="mt-10 grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6 md:gap-8">
            {featuredPlaces.map((listing) => (
              <ListingCard key={listing.id} listing={listing} />
            ))}
          </div>
           <div className="mt-12 text-center">
            <Button asChild size="lg">
              <Link href="/search?type=tour,package">Explore More Places</Link>
            </Button>
          </div>
        </div>
      </section>

       <section className="py-12 md:py-20 bg-secondary/50">
        <div className="container mx-auto px-4 md:px-6">
          <div className="text-center">
            <h2 className="text-3xl md:text-4xl font-headline font-bold">
              Featured Hotels
            </h2>
            <p className="mt-2 text-muted-foreground md:text-lg">
              Rest easy with our selection of highly-rated hotels.
            </p>
          </div>
          <div className="mt-10 grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6 md:gap-8">
            {featuredHotels.map((listing) => (
              <ListingCard key={listing.id} listing={listing} />
            ))}
          </div>
           <div className="mt-12 text-center">
            <Button asChild size="lg">
              <Link href="/hotels">Explore More Hotels</Link>
            </Button>
          </div>
        </div>
      </section>

    </div>
  );
}
