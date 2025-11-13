import type { ImagePlaceholder } from "./placeholder-images";

export type Listing = {
  id: string;
  title: string;
  type: 'tour' | 'hotel' | 'package';
  location: string;
  description: string;
  images: ImagePlaceholder[];
  basePrice: number;
  capacity: number;
  hostId: string;
  amenities: string[];
  rating: number;
  reviewsCount: number;
  itinerary?: { day: number; title: string; description: string }[];
};

export type Review = {
  id: string;
  listingId: string;
  userId: string;
  userName: string;
  userAvatar: string;
  rating: number;
  comment: string;
  createdAt: string;
};

export type Booking = {
    id: string;
    listingId: string;
    userId: string;
    startDate: string;
    endDate: string;
    guests: number;
    priceTotal: number;
    status: 'pending' | 'confirmed' | 'cancelled';
    paymentIntentId: string;
    createdAt: string;
};
