
'use client';

import { useFormStatus } from 'react-dom';
import { useActionState, useContext, useEffect } from 'react';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { z } from 'zod';
import { handleBookingValidation } from './actions';
import { sendEmail } from '@/ai/flows/send-email-flow';

import { Button } from '@/components/ui/button';
import {
  Form,
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from '@/components/ui/form';
import { Input } from '@/components/ui/input';
import {
  Card,
  CardContent,
  CardDescription,
  CardFooter,
  CardHeader,
  CardTitle,
} from '@/components/ui/card';
import { Alert, AlertDescription, AlertTitle } from '@/components/ui/alert';
import { AlertCircle } from 'lucide-react';
import { Popover, PopoverContent, PopoverTrigger } from '@/components/ui/popover';
import { Calendar } from '@/components/ui/calendar';
import { cn } from '@/lib/utils';
import { format } from 'date-fns';
import { CalendarIcon } from 'lucide-react';
import { useRouter } from 'next/navigation';
import { BookingsContext } from '@/context/bookings-context';
import type { Booking } from '@/lib/types';
import { useUser } from '@/firebase';

const bookingFormSchema = z.object({
  listingId: z.string(),
  email: z.string().email('Please enter a valid email address.'),
  startDate: z.date({
    required_error: 'A start date is required.',
  }),
  endDate: z.date({
    required_error: 'An end date is required.',
  }),
  guests: z.coerce.number().min(1, 'At least one guest is required.'),
});

type BookingFormValues = z.infer<typeof bookingFormSchema>;

const initialState = {
  message: '',
  isValid: false,
  isSubmitted: false,
};

function SubmitButton() {
  const { pending } = useFormStatus();
  return (
    <Button type="submit" disabled={pending} className="w-full">
      {pending ? 'Validating...' : 'Confirm Booking'}
    </Button>
  );
}

export function BookingForm({ listingId }: { listingId: string }) {
  const [state, formAction] = useActionState(handleBookingValidation, initialState);
  const router = useRouter();
  const { addBooking } = useContext(BookingsContext);
  const { user } = useUser();

  const form = useForm<BookingFormValues>({
    resolver: zodResolver(bookingFormSchema),
    defaultValues: {
      listingId: listingId,
      guests: 1,
      email: user?.email || '',
    },
  });

  const { watch, getValues } = form;
  const startDate = watch('startDate');
  const endDate = watch('endDate');

  useEffect(() => {
    if (state.isSubmitted && state.isValid) {
      const values = getValues();
      const newBooking: Omit<Booking, 'paymentIntentId'> = {
        id: `b${Date.now()}`,
        listingId: values.listingId,
        userId: user?.uid || 'user123',
        startDate: values.startDate.toISOString(),
        endDate: values.endDate.toISOString(),
        guests: values.guests,
        priceTotal: 1000, // This should be calculated properly
        status: 'confirmed',
        createdAt: new Date().toISOString(),
      };
      addBooking(newBooking as Booking);

      if (values.email) {
        sendEmail({
          to: values.email,
          subject: 'Your Booking is Confirmed!',
          body: `
            <h1>Booking Confirmation</h1>
            <p>Thank you for booking with Wanderly!</p>
            <p>Your booking for listing ${newBooking.listingId} from ${format(new Date(newBooking.startDate), 'PPP')} to ${format(new Date(newBooking.endDate), 'PPP')} is confirmed.</p>
            <p>Your booking ID is: <strong>${newBooking.id}</strong></p>
          `,
        });
      }

      router.push(`/confirmation/${newBooking.id}`);
    }
  }, [state, router, addBooking, getValues, user]);

  return (
    <>
      {state.isSubmitted && state.isValid === false && (
         <Alert variant={'destructive'} className="mb-6 bg-card">
            <AlertCircle className="h-4 w-4" />
            <AlertTitle>{'Validation Failed'}</AlertTitle>
            <AlertDescription>{state.message}</AlertDescription>
         </Alert>
      )}

      <Form {...form}>
        <form action={formAction} className="space-y-8">
            <Card>
                <CardHeader>
                    <CardTitle className="font-headline">Booking Details</CardTitle>
                    <CardDescription>
                        Please provide the details for your stay.
                    </CardDescription>
                </CardHeader>
                <CardContent className="space-y-4">
                    <input type="hidden" name="listingId" value={listingId} />
                    {startDate && <input type="hidden" name="startDate" value={startDate.toISOString()} />}
                    {endDate && <input type="hidden" name="endDate" value={endDate.toISOString()} />}
                     <FormField
                        control={form.control}
                        name="email"
                        render={({ field }) => (
                            <FormItem>
                                <FormLabel>Confirmation Email</FormLabel>
                                <FormControl>
                                    <Input type="email" placeholder="your@email.com" {...field} />
                                </FormControl>
                                <FormMessage />
                            </FormItem>
                        )}
                        />
                    <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                        <FormField
                            control={form.control}
                            name="startDate"
                            render={({ field }) => (
                                <FormItem className="flex flex-col">
                                <FormLabel>Start Date</FormLabel>
                                <Popover>
                                    <PopoverTrigger asChild>
                                    <FormControl>
                                        <Button
                                        variant={"outline"}
                                        className={cn(
                                            "w-full pl-3 text-left font-normal",
                                            !field.value && "text-muted-foreground"
                                        )}
                                        >
                                        {field.value ? (
                                            format(field.value, "PPP")
                                        ) : (
                                            <span>Pick a date</span>
                                        )}
                                        <CalendarIcon className="ml-auto h-4 w-4 opacity-50" />
                                        </Button>
                                    </FormControl>
                                    </PopoverTrigger>
                                    <PopoverContent className="w-auto p-0" align="start">
                                    <Calendar
                                        mode="single"
                                        selected={field.value}
                                        onSelect={field.onChange}
                                        disabled={(date) => date < new Date(new Date().setHours(0, 0, 0, 0))}
                                        initialFocus
                                    />
                                    </PopoverContent>
                                </Popover>
                                <FormMessage />
                                </FormItem>
                            )}
                        />
                         <FormField
                            control={form.control}
                            name="endDate"
                            render={({ field }) => (
                                <FormItem className="flex flex-col">
                                <FormLabel>End Date</FormLabel>
                                <Popover>
                                    <PopoverTrigger asChild>
                                    <FormControl>
                                        <Button
                                        variant={"outline"}
                                        className={cn(
                                            "w-full pl-3 text-left font-normal",
                                            !field.value && "text-muted-foreground"
                                        )}
                                        >
                                        {field.value ? (
                                            format(field.value, "PPP")
                                        ) : (
                                            <span>Pick a date</span>
                                        )}
                                        <CalendarIcon className="ml-auto h-4 w-4 opacity-50" />
                                        </Button>
                                    </FormControl>
                                    </PopoverTrigger>
                                    <PopoverContent className="w-auto p-0" align="start">
                                    <Calendar
                                        mode="single"
                                        selected={field.value}
                                        onSelect={field.onChange}
                                        disabled={(date) => date < new Date(new Date().setHours(0, 0, 0, 0)) || (startDate && date < startDate)}
                                        initialFocus
                                    />
                                    </PopoverContent>
                                </Popover>
                                <FormMessage />
                                </FormItem>
                            )}
                        />
                    </div>
                     <FormField
                        control={form.control}
                        name="guests"
                        render={({ field }) => (
                            <FormItem>
                                <FormLabel>Number of Guests</FormLabel>
                                <FormControl>
                                    <Input type="number" min="1" placeholder="1" {...field} />
                                </FormControl>
                                <FormMessage />
                            </FormItem>
                        )}
                        />
                </CardContent>
                <CardFooter>
                    <SubmitButton />
                </CardFooter>
            </Card>
        </form>
      </Form>
    </>
  );
}
