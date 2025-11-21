import { MongoClient } from 'mongodb';

const MONGO_URI = process.env.NEXT_PUBLIC_MONGODB_URI || '';

interface Payment {
  _id?: string;
  bookingId: string;
  userId: string;
  amount: number;
  currency: string;
  paymentMethod: 'card' | 'bank_transfer' | 'demo';
  status: 'pending' | 'completed' | 'failed';
  cardDetails?: {
    cardNumber: string;
    cardHolder: string;
    expiryMonth: number;
    expiryYear: number;
  };
  bankDetails?: {
    accountHolder: string;
    accountNumber: string;
    bankCode: string;
    ifscCode: string;
  };
  transactionId?: string;
  createdAt: Date;
  updatedAt: Date;
}

export async function createPayment(paymentData: Omit<Payment, '_id' | 'createdAt' | 'updatedAt'>) {
  const client = new MongoClient(MONGO_URI);
  try {
    await client.connect();
    const db = client.db('wanderly_db');
    const collection = db.collection<Payment>('payments');
    
    const result = await collection.insertOne({
      ...paymentData,
      createdAt: new Date(),
      updatedAt: new Date(),
    });
    
    return result.insertedId.toString();
  } finally {
    await client.close();
  }
}

export async function getPaymentByBookingId(bookingId: string) {
  const client = new MongoClient(MONGO_URI);
  try {
    await client.connect();
    const db = client.db('wanderly_db');
    const collection = db.collection<Payment>('payments');
    
    return await collection.findOne({ bookingId });
  } finally {
    await client.close();
  }
}

export async function updatePaymentStatus(paymentId: string, status: 'pending' | 'completed' | 'failed', transactionId?: string) {
  const client = new MongoClient(MONGO_URI);
  try {
    await client.connect();
    const db = client.db('wanderly_db');
    const collection = db.collection<Payment>('payments');
    
    const updateData: any = {
      status,
      updatedAt: new Date(),
    };
    
    if (transactionId) {
      updateData.transactionId = transactionId;
    }
    
    const result = await collection.updateOne(
      { _id: new (require('mongodb').ObjectId)(paymentId) },
      { $set: updateData }
    );
    
    return result.modifiedCount > 0;
  } finally {
    await client.close();
  }
}

export async function processCardPayment(
  bookingId: string,
  userId: string,
  amount: number,
  cardDetails: {
    cardNumber: string;
    cardHolder: string;
    expiryMonth: number;
    expiryYear: number;
    cvv: string;
  }
) {
  // In production, use Stripe, Razorpay, or similar
  // For demo: validate and create payment record
  
  if (!cardDetails.cardNumber || cardDetails.cardNumber.length < 13) {
    throw new Error('Invalid card number');
  }
  
  if (cardDetails.expiryMonth < 1 || cardDetails.expiryMonth > 12) {
    throw new Error('Invalid expiry month');
  }
  
  const currentYear = new Date().getFullYear();
  if (cardDetails.expiryYear < currentYear) {
    throw new Error('Card has expired');
  }
  
  if (!cardDetails.cvv || cardDetails.cvv.length < 3) {
    throw new Error('Invalid CVV');
  }
  
  // Simulate payment processing
  const transactionId = `TXN_${Date.now()}_${Math.random().toString(36).substr(2, 9)}`;
  
  const paymentId = await createPayment({
    bookingId,
    userId,
    amount,
    currency: 'INR',
    paymentMethod: 'card',
    status: 'completed',
    cardDetails: {
      cardNumber: `****${cardDetails.cardNumber.slice(-4)}`,
      cardHolder: cardDetails.cardHolder,
      expiryMonth: cardDetails.expiryMonth,
      expiryYear: cardDetails.expiryYear,
    },
    transactionId,
  });
  
  return { paymentId, transactionId, status: 'completed' };
}

export async function processBankTransfer(
  bookingId: string,
  userId: string,
  amount: number,
  bankDetails: {
    accountHolder: string;
    accountNumber: string;
    bankCode: string;
    ifscCode: string;
  }
) {
  // Validate bank details
  if (!bankDetails.accountNumber || bankDetails.accountNumber.length < 9) {
    throw new Error('Invalid account number');
  }
  
  if (!bankDetails.ifscCode || bankDetails.ifscCode.length !== 11) {
    throw new Error('Invalid IFSC code');
  }
  
  // Simulate bank transfer initiation
  const transactionId = `BANK_${Date.now()}_${Math.random().toString(36).substr(2, 9)}`;
  
  const paymentId = await createPayment({
    bookingId,
    userId,
    amount,
    currency: 'INR',
    paymentMethod: 'bank_transfer',
    status: 'pending', // Bank transfers are typically pending until confirmed
    bankDetails: {
      accountHolder: bankDetails.accountHolder,
      accountNumber: `****${bankDetails.accountNumber.slice(-4)}`,
      bankCode: bankDetails.bankCode,
      ifscCode: bankDetails.ifscCode,
    },
    transactionId,
  });
  
  return { paymentId, transactionId, status: 'pending' };
}

export async function processDemoPayment(
  bookingId: string,
  userId: string,
  amount: number
) {
  // Instant demo payment
  const transactionId = `DEMO_${Date.now()}_${Math.random().toString(36).substr(2, 9)}`;
  
  const paymentId = await createPayment({
    bookingId,
    userId,
    amount,
    currency: 'INR',
    paymentMethod: 'demo',
    status: 'completed',
    transactionId,
  });
  
  return { paymentId, transactionId, status: 'completed' };
}
