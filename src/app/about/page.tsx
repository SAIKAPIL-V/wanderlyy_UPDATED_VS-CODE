import { Card, CardHeader, CardTitle, CardDescription } from "@/components/ui/card";
import { User, Shield, Code, Palette, TestTube } from 'lucide-react';

const teamMembers = [
  { name: 'V Rishi Shankar Sai Kapil', role: 'Scrum Master', icon: Shield },
  { name: 'T Hemanth', role: 'Product Owner', icon: User },
  { name: 'S Ravi Teja', role: 'Frontend Developer', icon: Code },
  { name: 'J Teja', role: 'Backend Developer & UI/UX Designer', icon: Palette },
  { name: 'Anshul', role: 'QA & Testing', icon: TestTube },
];


export default function AboutPage() {
  return (
    <div className="container mx-auto px-4 md:px-6 py-12 md:py-20">
      <div className="text-center">
        <h1 className="text-3xl md:text-4xl font-headline font-bold">About Wanderly</h1>
        <p className="mt-4 text-lg text-muted-foreground max-w-3xl mx-auto">
          Wanderly is your gateway to unforgettable travel experiences. We believe in making travel accessible, enjoyable, and seamless for everyone. Our platform connects you with unique tours, comfortable hotels, and amazing packages all around the world.
        </p>
      </div>

      <div className="mt-16">
        <h2 className="text-3xl font-headline font-bold text-center">Meet Our Team</h2>
        <p className="mt-2 text-muted-foreground text-center">The passionate individuals behind Wanderly.</p>
        <div className="mt-10 grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
            {teamMembers.map((member) => (
                <Card key={member.name} className="text-center">
                    <CardHeader>
                        <div className="flex justify-center mb-4">
                            <member.icon className="w-12 h-12 text-primary" />
                        </div>
                        <CardTitle className="font-headline text-xl">{member.name}</CardTitle>
                        <CardDescription>{member.role}</CardDescription>
                    </CardHeader>
                </Card>
            ))}
        </div>
      </div>

    </div>
  );
}
