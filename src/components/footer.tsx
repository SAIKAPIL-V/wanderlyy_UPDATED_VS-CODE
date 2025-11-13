
import Link from 'next/link';
import { WanderlyIcon } from './icons';

const footerLinks = [
  {
    title: 'Company',
    links: [
      { href: '/about', label: 'About Us' },
      { href: '/contact', label: 'Contact' },
    ],
  },
  {
    title: 'Explore',
    links: [
      { href: '/search', label: 'Tours' },
      { href: '/hotels', label: 'Hotels' },
      { href: '/packages', label: 'Packages' },
      { href: '#', label: 'Destinations' },
    ],
  },
];

export function Footer() {
  return (
    <footer className="bg-secondary/50 border-t">
      <div className="container mx-auto px-4 sm:px-6 lg:px-8 py-12">
        <div className="grid grid-cols-1 md:grid-cols-5 gap-8">
          <div className="md:col-span-2">
            <Link
              href="/"
              className="flex items-center gap-2 text-xl font-bold font-headline"
            >
              <WanderlyIcon className="h-7 w-7 text-primary" />
              <span>Wanderly</span>
            </Link>
            <p className="mt-4 text-muted-foreground max-w-xs">
              Your gateway to unforgettable travel experiences.
            </p>
          </div>
          {footerLinks.map((section) => (
            <div key={section.title}>
              <h3 className="text-sm font-semibold text-foreground uppercase tracking-wider">
                {section.title}
              </h3>
              <ul className="mt-4 space-y-2">
                {section.links.map((link) => (
                  <li key={`${link.href}-${link.label}`}>
                    <Link
                      href={link.href}
                      className="text-base text-muted-foreground hover:text-primary"
                    >
                      {link.label}
                    </Link>
                  </li>
                ))}
              </ul>
            </div>
          ))}
        </div>
      </div>
    </footer>
  );
}
