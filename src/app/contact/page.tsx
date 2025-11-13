import { Card, CardHeader, CardTitle, CardContent } from "@/components/ui/card";
import { Phone, Mail } from 'lucide-react';

export default function ContactPage() {
  return (
    <div className="container mx-auto px-4 md:px-6 py-12 md:py-20">
      <div className="text-center">
        <h1 className="text-3xl md:text-4xl font-headline font-bold">Contact Us</h1>
        <p className="mt-4 text-lg text-muted-foreground max-w-2xl mx-auto">
          Have questions or need support? We're here to help. Reach out to our team lead for any inquiries.
        </p>
      </div>

      <div className="mt-12 max-w-md mx-auto">
        <Card>
          <CardHeader>
            <CardTitle className="font-headline text-center">Team Lead Contact</CardTitle>
          </CardHeader>
          <CardContent className="space-y-6">
            <div className="flex items-center gap-4">
              <div className="bg-primary/10 p-3 rounded-full">
                <Phone className="w-6 h-6 text-primary" />
              </div>
              <div>
                <p className="text-sm text-muted-foreground">Team Lead</p>
                <p className="font-semibold">V Sai Kapil</p>
              </div>
            </div>
            <div className="flex items-center gap-4">
               <div className="bg-primary/10 p-3 rounded-full">
                <Mail className="w-6 h-6 text-primary" />
              </div>
              <div>
                <p className="text-sm text-muted-foreground">Phone Number</p>
                <a href="tel:8019587119" className="font-semibold text-primary hover:underline">
                  8019587119
                </a>
              </div>
            </div>
          </CardContent>
        </Card>
      </div>
    </div>
  );
}
