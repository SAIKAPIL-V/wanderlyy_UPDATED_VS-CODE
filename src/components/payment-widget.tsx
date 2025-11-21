'use client';

import { useState } from 'react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Alert, AlertDescription } from '@/components/ui/alert';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Label } from '@/components/ui/label';
import {
  Form,
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from '@/components/ui/form';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { z } from 'zod';
import { CreditCard, Banknote, Zap, AlertCircle } from 'lucide-react';

const cardSchema = z.object({
  cardNumber: z.string().regex(/^\d{13,19}$/, 'Invalid card number'),
  cardHolder: z.string().min(3, 'Cardholder name required'),
  expiryMonth: z.coerce.number().min(1).max(12),
  expiryYear: z.coerce.number().min(new Date().getFullYear()),
  cvv: z.string().regex(/^\d{3,4}$/, 'Invalid CVV'),
});

const bankSchema = z.object({
  accountHolder: z.string().min(3, 'Account holder name required'),
  accountNumber: z.string().regex(/^\d{9,18}$/, 'Invalid account number'),
  bankCode: z.string().min(3, 'Bank code required'),
  ifscCode: z.string().regex(/^[A-Z]{4}0[A-Z0-9]{6}$/, 'Invalid IFSC code (format: XXXX0XXXXXX)'),
});

type CardFormData = z.infer<typeof cardSchema>;
type BankFormData = z.infer<typeof bankSchema>;

interface PaymentWidgetProps {
  bookingId: string;
  userId: string;
  amount: number;
  onPaymentSuccess?: (paymentId: string) => void;
  onPaymentError?: (error: string) => void;
}

export function PaymentWidget({
  bookingId,
  userId,
  amount,
  onPaymentSuccess,
  onPaymentError,
}: PaymentWidgetProps) {
  const [isProcessing, setIsProcessing] = useState(false);
  const [successMessage, setSuccessMessage] = useState('');
  const [errorMessage, setErrorMessage] = useState('');

  const cardForm = useForm<CardFormData>({
    resolver: zodResolver(cardSchema),
    defaultValues: {
      cardNumber: '',
      cardHolder: '',
      expiryMonth: 1,
      expiryYear: new Date().getFullYear(),
      cvv: '',
    },
  });

  const bankForm = useForm<BankFormData>({
    resolver: zodResolver(bankSchema),
    defaultValues: {
      accountHolder: '',
      accountNumber: '',
      bankCode: '',
      ifscCode: '',
    },
  });

  const processPayment = async (paymentMethod: 'card' | 'bank_transfer' | 'demo', data?: any) => {
    setIsProcessing(true);
    setErrorMessage('');
    setSuccessMessage('');

    try {
      const payload: any = {
        bookingId,
        userId,
        amount,
        paymentMethod,
        action: paymentMethod,
      };

      if (paymentMethod === 'card' && data) {
        payload.cardDetails = data;
      } else if (paymentMethod === 'bank_transfer' && data) {
        payload.bankDetails = data;
      }

      const response = await fetch('/api/payments', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(payload),
      });

      const result = await response.json();

      if (!response.ok) {
        throw new Error(result.error || 'Payment failed');
      }

      setSuccessMessage(`Payment successful! Transaction ID: ${result.transactionId}`);
      onPaymentSuccess?.(result.paymentId);
    } catch (error) {
      const errorMsg = error instanceof Error ? error.message : 'Payment processing failed';
      setErrorMessage(errorMsg);
      onPaymentError?.(errorMsg);
    } finally {
      setIsProcessing(false);
    }
  };

  const onCardSubmit = (data: CardFormData) => {
    processPayment('card', data);
  };

  const onBankSubmit = (data: BankFormData) => {
    processPayment('bank_transfer', data);
  };

  return (
    <Card className="w-full">
      <CardHeader>
        <CardTitle className="font-headline">Payment Method</CardTitle>
        <CardDescription>
          Choose how you want to pay for your booking
        </CardDescription>
      </CardHeader>
      <CardContent className="space-y-6">
        {/* Amount Display */}
        <div className="bg-secondary/50 p-4 rounded-lg">
          <p className="text-sm text-muted-foreground">Total Amount</p>
          <p className="text-2xl font-bold">₹{amount.toLocaleString()}</p>
        </div>

        {/* Error Alert */}
        {errorMessage && (
          <Alert variant="destructive">
            <AlertCircle className="h-4 w-4" />
            <AlertDescription>{errorMessage}</AlertDescription>
          </Alert>
        )}

        {/* Success Alert */}
        {successMessage && (
          <Alert className="border-green-500 bg-green-50">
            <AlertDescription className="text-green-800">{successMessage}</AlertDescription>
          </Alert>
        )}

        {/* Payment Tabs */}
        <Tabs defaultValue="demo" className="w-full">
          <TabsList className="grid w-full grid-cols-3">
            <TabsTrigger value="demo" className="gap-2">
              <Zap className="w-4 h-4" />
              <span className="hidden sm:inline">Demo</span>
            </TabsTrigger>
            <TabsTrigger value="card" className="gap-2">
              <CreditCard className="w-4 h-4" />
              <span className="hidden sm:inline">Card</span>
            </TabsTrigger>
            <TabsTrigger value="bank" className="gap-2">
              <Banknote className="w-4 h-4" />
              <span className="hidden sm:inline">Bank</span>
            </TabsTrigger>
          </TabsList>

          {/* Demo Payment Tab */}
          <TabsContent value="demo" className="space-y-4 mt-4">
            <div className="bg-blue-50 border border-blue-200 rounded-lg p-4">
              <p className="text-sm text-blue-900">
                <strong>Demo Mode:</strong> Click "Pay Now" to simulate an instant payment. No real charges will be made.
              </p>
            </div>
            <Button
              onClick={() => processPayment('demo')}
              disabled={isProcessing}
              className="w-full"
              size="lg"
            >
              {isProcessing ? 'Processing...' : 'Pay Now (Demo)'}
            </Button>
          </TabsContent>

          {/* Card Payment Tab */}
          <TabsContent value="card" className="space-y-4 mt-4">
            <Form {...cardForm}>
              <form onSubmit={cardForm.handleSubmit(onCardSubmit)} className="space-y-4">
                <FormField
                  control={cardForm.control}
                  name="cardNumber"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>Card Number</FormLabel>
                      <FormControl>
                        <Input
                          placeholder="1234 5678 9012 3456"
                          {...field}
                          onChange={(e) => {
                            const value = e.target.value.replace(/\s/g, '');
                            field.onChange(value);
                          }}
                        />
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />

                <FormField
                  control={cardForm.control}
                  name="cardHolder"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>Cardholder Name</FormLabel>
                      <FormControl>
                        <Input placeholder="John Doe" {...field} />
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />

                <div className="grid grid-cols-3 gap-4">
                  <FormField
                    control={cardForm.control}
                    name="expiryMonth"
                    render={({ field }) => (
                      <FormItem>
                        <FormLabel>Month</FormLabel>
                        <FormControl>
                          <Input type="number" min="1" max="12" placeholder="MM" {...field} />
                        </FormControl>
                        <FormMessage />
                      </FormItem>
                    )}
                  />

                  <FormField
                    control={cardForm.control}
                    name="expiryYear"
                    render={({ field }) => (
                      <FormItem>
                        <FormLabel>Year</FormLabel>
                        <FormControl>
                          <Input type="number" placeholder="YYYY" {...field} />
                        </FormControl>
                        <FormMessage />
                      </FormItem>
                    )}
                  />

                  <FormField
                    control={cardForm.control}
                    name="cvv"
                    render={({ field }) => (
                      <FormItem>
                        <FormLabel>CVV</FormLabel>
                        <FormControl>
                          <Input type="password" placeholder="123" {...field} />
                        </FormControl>
                        <FormMessage />
                      </FormItem>
                    )}
                  />
                </div>

                <Button type="submit" disabled={isProcessing} className="w-full" size="lg">
                  {isProcessing ? 'Processing...' : `Pay ₹${amount.toLocaleString()}`}
                </Button>
              </form>
            </Form>
          </TabsContent>

          {/* Bank Transfer Tab */}
          <TabsContent value="bank" className="space-y-4 mt-4">
            <div className="bg-amber-50 border border-amber-200 rounded-lg p-4">
              <p className="text-sm text-amber-900">
                <strong>Note:</strong> Bank transfers may take 1-2 business days to process.
              </p>
            </div>

            <Form {...bankForm}>
              <form onSubmit={bankForm.handleSubmit(onBankSubmit)} className="space-y-4">
                <FormField
                  control={bankForm.control}
                  name="accountHolder"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>Account Holder Name</FormLabel>
                      <FormControl>
                        <Input placeholder="John Doe" {...field} />
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />

                <FormField
                  control={bankForm.control}
                  name="accountNumber"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>Account Number</FormLabel>
                      <FormControl>
                        <Input placeholder="9876543210" {...field} />
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />

                <FormField
                  control={bankForm.control}
                  name="bankCode"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>Bank Code</FormLabel>
                      <FormControl>
                        <Input placeholder="SBIN" {...field} />
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />

                <FormField
                  control={bankForm.control}
                  name="ifscCode"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>IFSC Code</FormLabel>
                      <FormControl>
                        <Input placeholder="SBIN0001234" {...field} />
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />

                <Button type="submit" disabled={isProcessing} className="w-full" size="lg">
                  {isProcessing ? 'Processing...' : 'Initiate Transfer'}
                </Button>
              </form>
            </Form>
          </TabsContent>
        </Tabs>
      </CardContent>
    </Card>
  );
}
