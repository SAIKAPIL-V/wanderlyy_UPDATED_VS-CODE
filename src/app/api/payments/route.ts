import { NextRequest, NextResponse } from 'next/server';
import {
  processCardPayment,
  processBankTransfer,
  processDemoPayment,
  getPaymentByBookingId,
} from '@/lib/payment-service';

export async function POST(request: NextRequest) {
  try {
    const paymentData = await request.json();
    const { bookingId, userId, amount, paymentMethod, action } = paymentData;

    if (!bookingId || !userId || !amount) {
      return NextResponse.json(
        { error: 'Missing required fields: bookingId, userId, amount' },
        { status: 400 }
      );
    }

    if (action === 'card') {
      const { cardDetails } = paymentData;
      if (!cardDetails) {
        return NextResponse.json(
          { error: 'Card details are required' },
          { status: 400 }
        );
      }
      
      const result = await processCardPayment(bookingId, userId, amount, cardDetails);
      return NextResponse.json(result, { status: 201 });
    }

    if (action === 'bank_transfer') {
      const { bankDetails } = paymentData;
      if (!bankDetails) {
        return NextResponse.json(
          { error: 'Bank details are required' },
          { status: 400 }
        );
      }
      
      const result = await processBankTransfer(bookingId, userId, amount, bankDetails);
      return NextResponse.json(result, { status: 201 });
    }

    if (action === 'demo') {
      const result = await processDemoPayment(bookingId, userId, amount);
      return NextResponse.json(result, { status: 201 });
    }

    if (action === 'get') {
      const payment = await getPaymentByBookingId(bookingId);
      if (!payment) {
        return NextResponse.json(
          { error: 'Payment not found' },
          { status: 404 }
        );
      }
      return NextResponse.json(payment, { status: 200 });
    }

    return NextResponse.json(
      { error: 'Invalid action. Use: card, bank_transfer, demo, or get' },
      { status: 400 }
    );
  } catch (error) {
    console.error('Payment API error:', error);
    return NextResponse.json(
      { error: 'Payment processing failed', details: String(error) },
      { status: 500 }
    );
  }
}
