import Image from 'next/image';
import Link from 'next/link';
import { notFound } from 'next/navigation';
import { listings, reviews as allReviews } from '@/lib/dummy-data';
import {
  Carousel,
  CarouselContent,
  CarouselItem,
  CarouselNext,
  CarouselPrevious,
} from '@/components/ui/carousel';
import {
  Card,
  CardContent,
  CardHeader,
  CardTitle,
} from '@/components/ui/card';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar';
import { Star, MapPin, CheckCircle } from 'lucide-react';
import type { Review } from '@/lib/types';
import { BookingWidget } from './booking-widget';


function Rating({ rating, count, uniqueKey }: { rating: number; count: number, uniqueKey?: string }) {
  return (
    <div className="flex items-center gap-2">
      <div className="flex items-center">
        {[...Array(5)].map((_, i) => (
          <Star
            key={`${uniqueKey}-${i}`}
            className={`w-5 h-5 ${
              i < Math.floor(rating)
                ? 'text-amber-400 fill-amber-400'
                : 'text-gray-300'
            }`}
          />
        ))}
      </div>
      <span className="text-muted-foreground">
        {rating.toFixed(1)} ({count} reviews)
      </span>
    </div>
  );
}

function ReviewCard({ review }: { review: Review }) {
  return (
    <div className="flex flex-col gap-4 py-4">
      <div className="flex items-center gap-4">
        <Avatar>
          <AvatarImage src={review.userAvatar} alt={review.userName} data-ai-hint="person portrait" />
          <AvatarFallback>{review.userName.charAt(0)}</AvatarFallback>
        </Avatar>
        <div>
          <p className="font-semibold">{review.userName}</p>
          <div className="flex items-center gap-1 text-sm text-muted-foreground">
             <Rating rating={review.rating} count={0} uniqueKey={`review-${review.id}`} />
          </div>
        </div>
        <p className="ml-auto text-sm text-muted-foreground">{review.createdAt}</p>
      </div>
      <p className="text-muted-foreground">{review.comment}</p>
    </div>
  );
}


export default async function ListingDetailPage({ params }: { params: any }) {
  // `params` is an awaitable proxy in newer Next.js versions; await it first.
  const p = await params;
  const listing = listings.find((l) => l.id === p.id);
  const reviews = allReviews.filter((r) => r.listingId === p.id);

  if (!listing) {
    notFound();
  }
  
  return (
    <div className="container mx-auto px-4 md:px-6 py-8">
      <div className="mb-6">
        <h1 className="text-3xl md:text-4xl font-headline font-bold">{listing.title}</h1>
        <div className="flex items-center gap-4 mt-2 text-muted-foreground">
            <div className="flex items-center gap-1">
                <MapPin className="w-4 h-4" />
                <span>{listing.location}</span>
            </div>
            <Rating rating={listing.rating} count={listing.reviewsCount} uniqueKey={`listing-${listing.id}`} />
        </div>
      </div>
      
      <div className="grid grid-cols-1 lg:grid-cols-3 lg:gap-12">
        <div className="lg:col-span-2">
           <Carousel className="w-full mb-8 rounded-lg overflow-hidden border">
                <CarouselContent>
                    {listing.images.map((image, index) => (
                    <CarouselItem key={index}>
                        <div className="aspect-video relative">
                        <Image
                            src={image.imageUrl}
                            alt={`${listing.title} - Image ${index + 1}`}
                            fill
                            className="object-cover"
                            sizes="(max-width: 1024px) 100vw, 66vw"
                            data-ai-hint={image.imageHint}
                        />
                        </div>
                    </CarouselItem>
                    ))}
                </CarouselContent>
                <CarouselPrevious className="absolute left-2 top-1/2 -translate-y-1/2" />
                <CarouselNext className="absolute right-2 top-1/2 -translate-y-1/2" />
            </Carousel>

            <Tabs defaultValue="description" className="w-full">
                <TabsList>
                    <TabsTrigger value="description">Description</TabsTrigger>
                    {listing.itinerary && <TabsTrigger value="itinerary">Itinerary</TabsTrigger>}
                    <TabsTrigger value="reviews">Reviews</TabsTrigger>
                </TabsList>
                <TabsContent value="description" className="mt-4 text-base text-muted-foreground leading-relaxed prose max-w-none">
                   <p>{listing.description}</p>
                   <h3 className="text-lg font-semibold text-foreground mt-6 mb-3 font-headline">Amenities</h3>
                    <ul className="grid grid-cols-2 md:grid-cols-3 gap-x-4 gap-y-2">
                        {listing.amenities.map(amenity => (
                            <li key={amenity} className="flex items-center gap-2">
                                <CheckCircle className="w-4 h-4 text-primary" />
                                <span>{amenity}</span>
                            </li>
                        ))}
                    </ul>
                </TabsContent>
                {listing.itinerary && (
                    <TabsContent value="itinerary" className="mt-4">
                        <div className="space-y-6">
                            {listing.itinerary.map(item => (
                                <div key={item.day} className="flex gap-4">
                                    <div className="flex flex-col items-center">
                                        <div className="flex items-center justify-center w-10 h-10 rounded-full bg-primary text-primary-foreground font-bold">
                                            {item.day}
                                        </div>
                                        <div className="flex-1 w-px bg-border my-2"></div>
                                    </div>
                                    <div>
                                        <h4 className="font-semibold text-lg font-headline">{item.title}</h4>
                                        <p className="text-muted-foreground mt-1">{item.description}</p>
                                    </div>
                                </div>
                            ))}
                        </div>
                    </TabsContent>
                )}
                <TabsContent value="reviews" className="mt-4">
                    <Card>
                        <CardHeader>
                            <CardTitle className="font-headline">Guest Reviews</CardTitle>
                        </CardHeader>
                        <CardContent className="divide-y">
                            {reviews.length > 0 ? reviews.map(review => (
                                <ReviewCard key={review.id} review={review} />
                            )) : <p className="text-muted-foreground py-4">No reviews yet.</p>}
                        </CardContent>
                    </Card>
                </TabsContent>
            </Tabs>
        </div>

        <aside className="lg:col-span-1 mt-8 lg:mt-0">
          <div className="sticky top-24">
            <BookingWidget listing={listing} />
          </div>
        </aside>
      </div>
    </div>
  );
}
