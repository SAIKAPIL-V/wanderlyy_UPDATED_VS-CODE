import Image from "next/image";
import Link from "next/link";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { placeholderImages } from "@/lib/placeholder-images";
import { CheckCircle } from "lucide-react";

export default function ConfirmationPage({ params }: { params: { bookingId: string }}) {
  const confirmationImage = placeholderImages.find(img => img.id === 'confirmation');
  
  return (
    <div className="container mx-auto max-w-3xl px-4 md:px-6 py-12 md:py-20 text-center">
        <Card>
            <CardHeader>
                <div className="flex justify-center text-primary">
                    <CheckCircle className="w-16 h-16" />
                </div>
                <CardTitle className="text-3xl md:text-4xl font-headline font-bold mt-4">Booking Confirmed!</CardTitle>
            </CardHeader>
            <CardContent>
                {confirmationImage && (
                     <div className="relative aspect-[5/3] w-full max-w-md mx-auto my-6 rounded-lg overflow-hidden">
                        <Image
                            src={confirmationImage.imageUrl}
                            alt={confirmationImage.description}
                            fill
                            className="object-cover"
                            data-ai-hint={confirmationImage.imageHint}
                        />
                    </div>
                )}
                <p className="text-muted-foreground text-lg">
                    Thank you for your booking. Your adventure awaits!
                </p>
                <p className="mt-2 text-muted-foreground">
                    A confirmation email has been sent to your address with all the details. Your booking ID is <span className="font-semibold text-foreground">#{params.bookingId}</span>.
                </p>
                <div className="mt-8 flex justify-center gap-4">
                    <Button asChild>
                        <Link href="/dashboard">View My Bookings</Link>
                    </Button>
                     <Button variant="outline" asChild>
                        <Link href="/">Explore More</Link>
                    </Button>
                </div>
            </CardContent>
        </Card>
    </div>
  );
}
