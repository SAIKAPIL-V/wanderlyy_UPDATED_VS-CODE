"use server";

import { z } from 'zod';

/**
 * Lightweight, local-only sendEmail implementation for development.
 * This avoids importing external AI plugins (genkit) during server execution
 * when no API keys are configured. In production you can replace this with
 * a real email provider integration.
 */

const SendEmailInputSchema = z.object({
  to: z.string().email(),
  subject: z.string(),
  body: z.string(),
});
export type SendEmailInput = z.infer<typeof SendEmailInputSchema>;

const SendEmailOutputSchema = z.object({
  success: z.boolean(),
  message: z.string(),
});
export type SendEmailOutput = z.infer<typeof SendEmailOutputSchema>;

export async function sendEmail(input: SendEmailInput): Promise<SendEmailOutput> {
  // Development-safe behaviour: log and return success without external APIs.
  console.log('----- SIMULATING EMAIL -----');
  console.log(`To: ${input.to}`);
  console.log(`Subject: ${input.subject}`);
  console.log('Body:', input.body.substring(0, 100) + '...');
  console.log('--------------------------');

  return {
    success: true,
    message: `Simulated sending email to ${input.to}`,
  };
}
