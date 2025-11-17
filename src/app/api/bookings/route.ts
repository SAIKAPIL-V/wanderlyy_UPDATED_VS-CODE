import { NextRequest, NextResponse } from 'next/server';
import { createBooking, getBookingsByUserId, getBookingById, updateBooking, getAllBookings } from '@/lib/mongodb-service';

export async function POST(request: NextRequest) {
  try {
    const bookingData = await request.json();
    const { userId, listingId, email, checkInDate, checkOutDate, numberOfGuests, totalPrice, action } = bookingData;

    if (!userId || !listingId || !email) {
      return NextResponse.json(
        { error: 'Missing required fields' },
        { status: 400 }
      );
    }

    if (action === 'create') {
      const bookingId = await createBooking({
        userId,
        listingId,
        email,
        checkInDate: new Date(checkInDate),
        checkOutDate: new Date(checkOutDate),
        numberOfGuests,
        totalPrice,
        status: 'confirmed',
      });
      return NextResponse.json(
        { message: 'Booking created successfully', bookingId },
        { status: 201 }
      );
    }

    if (action === 'get') {
      const bookings = await getBookingsByUserId(userId);
      return NextResponse.json({ bookings }, { status: 200 });
    }

    if (action === 'getAll') {
      const bookings = await getAllBookings();
      return NextResponse.json({ bookings }, { status: 200 });
    }

    if (action === 'getById') {
      const { bookingId } = bookingData;
      const booking = await getBookingById(bookingId);
      if (!booking) {
        return NextResponse.json(
          { error: 'Booking not found' },
          { status: 404 }
        );
      }
      return NextResponse.json({ booking }, { status: 200 });
    }

    if (action === 'update') {
      const { bookingId, status } = bookingData;
      const success = await updateBooking(bookingId, { status });
      if (!success) {
        return NextResponse.json(
          { error: 'Booking not found' },
          { status: 404 }
        );
      }
      return NextResponse.json(
        { message: 'Booking updated successfully' },
        { status: 200 }
      );
    }

    return NextResponse.json(
      { error: 'Invalid action' },
      { status: 400 }
    );
  } catch (error) {
    console.error('API error:', error);
    return NextResponse.json(
      { error: 'Internal server error', details: String(error) },
      { status: 500 }
    );
  }
}
