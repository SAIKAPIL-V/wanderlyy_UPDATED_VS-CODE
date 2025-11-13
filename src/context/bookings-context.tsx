
'use client';

import React, { createContext, useState, ReactNode, useCallback } from 'react';
import type { Booking } from '@/lib/types';
import { bookings as initialBookings } from '@/lib/dummy-data';

interface BookingsContextType {
  bookings: Booking[];
  addBooking: (booking: Booking) => void;
}

export const BookingsContext = createContext<BookingsContextType>({
  bookings: [],
  addBooking: () => {},
});

export const BookingsProvider = ({ children }: { children: ReactNode }) => {
  const [bookings, setBookings] = useState<Booking[]>(initialBookings);

  const addBooking = useCallback((booking: Booking) => {
    setBookings((prevBookings) => [...prevBookings, booking]);
  }, []);

  return (
    <BookingsContext.Provider value={{ bookings, addBooking }}>
      {children}
    </BookingsContext.Provider>
  );
};
