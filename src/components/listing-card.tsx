'use client';

import Link from 'next/link';
import Image from 'next/image';
import { Card, CardContent } from '@/components/ui/card';
import {
  Carousel,
  CarouselContent,
  CarouselItem,
  CarouselNext,
  CarouselPrevious,
} from '@/components/ui/carousel';
import { Badge } from '@/components/ui/badge';
import { Star, MapPin } from 'lucide-react';
import type { Listing } from '@/lib/types';
import { formatPrice } from '@/lib/utils';
import { cn } from '@/lib/utils';

interface ListingCardProps {
  listing: Listing;
}

export function ListingCard({ listing }: ListingCardProps) {
  return (
    <Card className="overflow-hidden group w-full">
      <div className="relative">
        <Carousel
          className="w-full"
          opts={{
            loop: true,
          }}
        >
          <CarouselContent>
            {listing.images.map((image, index) => (
              <CarouselItem key={index}>
                <Link href={`/listings/${listing.id}`} className="block">
                  <div className="aspect-[4/3] relative">
                    <Image
                      src={image.imageUrl}
                      alt={listing.title}
                      fill
                      className="object-cover"
                      sizes="(max-width: 640px) 100vw, (max-width: 1024px) 50vw, 33vw"
                      data-ai-hint={image.imageHint}
                    />
                  </div>
                </Link>
              </CarouselItem>
            ))}
          </CarouselContent>
          <div
            onClick={(e) => {
              e.preventDefault();
              e.stopPropagation();
            }}
            className={cn(
              'absolute inset-x-0 top-1/2 -translate-y-1/2',
              'flex items-center justify-between px-2',
              'opacity-0 group-hover:opacity-100 transition-opacity'
            )}
          >
            <CarouselPrevious className="static -translate-x-0 -translate-y-0" />
            <CarouselNext className="static -translate-x-0 -translate-y-0" />
          </div>
        </Carousel>
      </div>

      <Link href={`/listings/${listing.id}`} className="block">
        <CardContent className="p-4">
          <div className="flex justify-between items-start">
            <h3 className="font-semibold text-lg leading-tight truncate pr-2 font-headline">
              {listing.title}
            </h3>
            <div className="flex items-center gap-1 flex-shrink-0">
              <Star className="w-4 h-4 text-amber-400 fill-amber-400" />
              <span className="text-sm font-medium">{listing.rating.toFixed(1)}</span>
            </div>
          </div>
          <div className="flex items-center text-sm text-muted-foreground mt-1">
            <MapPin className="w-4 h-4 mr-1" />
            <span>{listing.location}</span>
          </div>
          <div className="flex justify-between items-center mt-3">
            <Badge variant="outline" className="capitalize">{listing.type}</Badge>
            <p className="text-lg font-semibold">
              {formatPrice(listing.basePrice)}
              <span className="text-sm font-normal text-muted-foreground">/{listing.type === 'hotel' ? 'night' : 'person'}</span>
            </p>
          </div>
        </CardContent>
      </Link>
    </Card>
  );
}
