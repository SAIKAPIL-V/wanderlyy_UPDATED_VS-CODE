import { getCollection } from './mongodb';
import { ObjectId } from 'mongodb';

export interface MongoUser {
  _id?: ObjectId;
  uid: string; // Firebase UID
  email: string;
  name?: string;
  phone?: string;
  createdAt: Date;
  updatedAt: Date;
}

export interface MongoBooking {
  _id?: ObjectId;
  userId: string; // Firebase UID
  listingId: string;
  email: string;
  checkInDate: Date;
  checkOutDate: Date;
  numberOfGuests: number;
  totalPrice: number;
  status: 'pending' | 'confirmed' | 'cancelled';
  createdAt: Date;
  updatedAt: Date;
}

// User operations
export async function createUser(userData: Omit<MongoUser, '_id' | 'createdAt' | 'updatedAt'>) {
  const usersCollection = await getCollection('users');
  const result = await usersCollection.insertOne({
    ...userData,
    createdAt: new Date(),
    updatedAt: new Date(),
  } as MongoUser);
  return result.insertedId;
}

export async function getUserByUID(uid: string): Promise<MongoUser | null> {
  const usersCollection = await getCollection('users');
  return usersCollection.findOne({ uid }) as Promise<MongoUser | null>;
}

export async function getUserByEmail(email: string): Promise<MongoUser | null> {
  const usersCollection = await getCollection('users');
  return usersCollection.findOne({ email }) as Promise<MongoUser | null>;
}

export async function updateUser(uid: string, updates: Partial<MongoUser>) {
  const usersCollection = await getCollection('users');
  const result = await usersCollection.updateOne(
    { uid },
    {
      $set: {
        ...updates,
        updatedAt: new Date(),
      },
    }
  );
  return result.modifiedCount > 0;
}

// Booking operations
export async function createBooking(bookingData: Omit<MongoBooking, '_id' | 'createdAt' | 'updatedAt'>) {
  const bookingsCollection = await getCollection('bookings');
  const result = await bookingsCollection.insertOne({
    ...bookingData,
    createdAt: new Date(),
    updatedAt: new Date(),
  } as MongoBooking);
  return result.insertedId;
}

export async function getBookingsByUserId(userId: string): Promise<MongoBooking[]> {
  const bookingsCollection = await getCollection('bookings');
  return bookingsCollection.find({ userId }).toArray() as Promise<MongoBooking[]>;
}

export async function getBookingById(bookingId: string): Promise<MongoBooking | null> {
  const bookingsCollection = await getCollection('bookings');
  return bookingsCollection.findOne({ _id: new ObjectId(bookingId) }) as Promise<MongoBooking | null>;
}

export async function updateBooking(bookingId: string, updates: Partial<MongoBooking>) {
  const bookingsCollection = await getCollection('bookings');
  const result = await bookingsCollection.updateOne(
    { _id: new ObjectId(bookingId) },
    {
      $set: {
        ...updates,
        updatedAt: new Date(),
      },
    }
  );
  return result.modifiedCount > 0;
}

export async function getAllBookings(): Promise<MongoBooking[]> {
  const bookingsCollection = await getCollection('bookings');
  return bookingsCollection.find({}).toArray() as Promise<MongoBooking[]>;
}
