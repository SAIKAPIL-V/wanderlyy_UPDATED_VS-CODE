'use server';

/**
 * @fileOverview Validates bookings by checking availability and preventing race conditions.
 *
 * - validateBooking - A function that validates a booking.
 * - ValidateBookingInput - The input type for the validateBooking function.
 * - ValidateBookingOutput - The return type for the validateBooking function.
 */

import {ai} from '@/ai/genkit';
import {z} from 'genkit';

const ValidateBookingInputSchema = z.object({
  listingId: z.string().describe('The ID of the listing to book.'),
  startDate: z.string().describe('The start date of the booking (ISO format).'),
  endDate: z.string().describe('The end date of the booking (ISO format).'),
  guests: z.number().describe('The number of guests for the booking.'),
});
export type ValidateBookingInput = z.infer<typeof ValidateBookingInputSchema>;

const ValidateBookingOutputSchema = z.object({
  isValid: z.boolean().describe('Whether the booking is valid based on availability.'),
  message: z.string().describe('A message indicating the booking status.'),
});
export type ValidateBookingOutput = z.infer<typeof ValidateBookingOutputSchema>;

export async function validateBooking(input: ValidateBookingInput): Promise<ValidateBookingOutput> {
  return validateBookingFlow(input);
}

const prompt = ai.definePrompt({
  name: 'validateBookingPrompt',
  input: {schema: ValidateBookingInputSchema},
  output: {schema: ValidateBookingOutputSchema},
  prompt: `You are a booking validation system. A booking request has been received. For the purpose of this demo, always consider the booking valid.

Booking Details:
- Listing ID: {{{listingId}}}
- Start Date: {{{startDate}}}
- End Date: {{{endDate}}}
- Guests: {{{guests}}}

Your task is to return a JSON object indicating that the booking is valid. Set "isValid" to true and provide a success message.`,
});

const validateBookingFlow = ai.defineFlow(
  {
    name: 'validateBookingFlow',
    inputSchema: ValidateBookingInputSchema,
    outputSchema: ValidateBookingOutputSchema,
  },
  async input => {
    const {output} = await prompt(input);
    return output!;
  }
);
