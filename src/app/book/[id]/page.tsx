import { notFound } from 'next/navigation';
import { listings } from '@/lib/dummy-data';
import Image from 'next/image';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Separator } from '@/components/ui/separator';
import { Star, MapPin } from 'lucide-react';
import { formatPrice } from '@/lib/utils';
import { BookingForm } from './booking-form';

export default function BookingPage({ params }: { params: { id: string } }) {
  const listing = listings.find((l) => l.id === params.id);

  if (!listing) {
    notFound();
  }
  
  const displayPrice = listing.basePrice;
  const serviceFee = 2800; // Approx 35 USD in INR
  const taxes = displayPrice * 0.1;
  const totalPrice = displayPrice + serviceFee + taxes;
  const isPerPerson = listing.type === 'tour' || listing.type === 'package';

  return (
    <div className="container mx-auto max-w-6xl px-4 md:px-6 py-12">
      <h1 className="text-3xl md:text-4xl font-headline font-bold mb-8">
        Confirm and pay
      </h1>
      <div className="grid grid-cols-1 lg:grid-cols-5 gap-12">
        <div className="lg:col-span-3">
            <h2 className="text-2xl font-headline font-semibold mb-6">Your booking</h2>
            <BookingForm listingId={listing.id} />
        </div>
        <aside className="lg:col-span-2">
            <div className="sticky top-24">
                <Card>
                    <CardHeader className="flex-row gap-4 items-start p-4">
                       {listing.images[0] && (
                        <div className="relative w-32 h-24 rounded-md overflow-hidden">
                             <Image 
                                src={listing.images[0].imageUrl} 
                                alt={listing.title} 
                                fill
                                className="object-cover"
                                data-ai-hint={listing.images[0].imageHint}
                            />
                        </div>
                       )}
                       <div className="flex-1">
                            <p className="text-sm text-muted-foreground">{listing.type}</p>
                            <h3 className="font-semibold">{listing.title}</h3>
                             <div className="flex items-center gap-1 text-sm text-muted-foreground mt-1">
                                <Star className="w-3 h-3 text-amber-500 fill-amber-500" />
                                <span>{listing.rating}</span>
                                <span className="text-gray-400">({listing.reviewsCount} reviews)</span>
                            </div>
                       </div>
                    </CardHeader>
                    <CardContent className="p-4 pt-0">
                        <Separator className="my-4"/>
                        <h4 className="text-xl font-headline font-semibold mb-4">Price details</h4>
                         <p className="text-sm text-muted-foreground mb-4">
                            The final price will be calculated based on your selections.
                         </p>
                         <div className="space-y-2 text-sm">
                            <div className="flex justify-between">
                                <span className="text-muted-foreground">{formatPrice(displayPrice)} x 1 {isPerPerson ? 'person' : 'night'}</span>
                                <span>{formatPrice(displayPrice)}</span>
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
                        <Separator className="my-4"/>
                        <div className="flex justify-between font-bold text-lg">
                            <span>Total (INR)</span>
                            <span>{formatPrice(totalPrice)}</span>
                        </div>
                    </CardContent>
                </Card>
            </div>
        </aside>
      </div>
    </div>
  );
}
