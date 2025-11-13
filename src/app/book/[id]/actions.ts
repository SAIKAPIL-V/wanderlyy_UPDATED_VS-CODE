'use server';

import { z } from 'zod';
import { validateBooking } from '@/ai/flows/secure-booking-validation';

const bookingSchema = z.object({
  listingId: z.string(),
  startDate: z.string().refine((val) => !isNaN(Date.parse(val)), {
    message: "Invalid start date",
  }).transform((str) => new Date(str).toISOString()),
  endDate: z.string().refine((val) => !isNaN(Date.parse(val)), {
    message: "Invalid end date",
  }).transform((str) => new Date(str).toISOString()),
  guests: z.coerce.number().int().positive('Number of guests must be at least 1.'),
});

export async function handleBookingValidation(
  prevState: any,
  formData: FormData
) {
  try {
    const rawData = {
      listingId: formData.get('listingId'),
      startDate: formData.get('startDate'),
      endDate: formData.get('endDate'),
      guests: formData.get('guests'),
    };
    const validatedFields = bookingSchema.safeParse(rawData);

    if (!validatedFields.success) {
      console.log(validatedFields.error.flatten().fieldErrors);
      return {
        message: 'Invalid form data. Please check your inputs.',
        isValid: false,
        isSubmitted: true,
      };
    }
    
    const { listingId, startDate, endDate, guests } = validatedFields.data;

    // Call the GenAI validation flow
    const validationResult = await validateBooking({
      listingId,
      startDate,
      endDate,
      guests,
    });

    return {
      message: validationResult.message,
      isValid: validationResult.isValid,
      isSubmitted: true,
    };
  } catch (error) {
    console.error('Booking validation error:', error);
    return {
      message: 'An unexpected error occurred. Please try again later.',
      isValid: false,
      isSubmitted: true,
    };
  }
}
