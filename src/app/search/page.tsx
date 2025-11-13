
import { listings } from '@/lib/dummy-data';
import { ListingCard } from '@/components/listing-card';
import { Filters } from './filters';
import type { Listing } from '@/lib/types';

export default async function SearchPage({
  searchParams,
}: {
  searchParams: any;
}) {
  // `searchParams` is an awaitable proxy in newer Next.js versions; await it
  // before accessing properties to avoid sync-dynamic-apis errors.
  const sp = await searchParams;

  const filteredListings = listings.filter((listing: Listing) => {
    const location = sp.location as string | undefined;
    const type = sp.type as string | undefined;
    const price = sp.price ? Number(sp.price) : undefined;
    const rating = sp.rating ? Number(sp.rating) : undefined;
    const country = sp.country as string | undefined;

    if (location && !listing.location.toLowerCase().includes(location.toLowerCase())) {
        return false;
    }
    
    if (country && listing.location.split(', ')[1]?.toLowerCase() !== country) {
      return false;
    }

    if (type && type.length > 0 && !type.split(',').includes(listing.type)) {
      return false;
    }

    if (price && listing.basePrice > price) {
      return false;
    }
    
    if (rating && listing.rating < rating) {
        return false;
    }

    return true;
  });

  const hotelListings = filteredListings.filter(l => l.type === 'hotel');
  const placeListings = filteredListings.filter(l => l.type === 'tour' || l.type === 'package');
  
  const typeParam = searchParams.type as string | undefined;
  let resultMessage;
  if (typeParam === 'hotel') {
    resultMessage = `We found ${hotelListings.length} amazing hotels for you.`;
  } else if (typeParam === 'tour,package' || typeParam === 'package,tour' || typeParam === 'tour' || typeParam === 'package') {
    resultMessage = `We found ${placeListings.length} amazing places for you.`;
  } else {
    resultMessage = `We found ${filteredListings.length} amazing results for you.`;
  }


  return (
    <div className="container mx-auto px-4 md:px-6 py-8">
      <div className="mb-8">
        <h1 className="text-3xl md:text-4xl font-headline font-bold">
          Search Results
        </h1>
        <p className="mt-2 text-muted-foreground md:text-lg">
          {resultMessage}
        </p>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-4 gap-8">
        <aside className="lg:col-span-1">
          <div className="sticky top-20">
            <Filters />
          </div>
        </aside>

        <main className="lg:col-span-3">
            {filteredListings.length > 0 ? (
                <div className="space-y-12">
                  {placeListings.length > 0 && (
                    <section>
                      <h2 className="text-2xl font-headline font-bold mb-6">Places</h2>
                      <div className="grid grid-cols-1 sm:grid-cols-2 xl:grid-cols-3 gap-6">
                          {placeListings.map((listing) => (
                          <ListingCard key={listing.id} listing={listing} />
                          ))}
                      </div>
                    </section>
                  )}
                  {hotelListings.length > 0 && (
                     <section>
                      <h2 className="text-2xl font-headline font-bold mb-6">Hotels</h2>
                      <div className="grid grid-cols-1 sm:grid-cols-2 xl:grid-cols-3 gap-6">
                          {hotelListings.map((listing) => (
                          <ListingCard key={listing.id} listing={listing} />
                          ))}
                      </div>
                    </section>
                  )}
                </div>
            ) : (
                <div className="flex flex-col items-center justify-center text-center py-16">
                    <h2 className="text-2xl font-bold font-headline">No results found</h2>
                    <p className="mt-2 text-muted-foreground">Try adjusting your filters to find what you're looking for.</p>
                </div>
            )}
        </main>
      </div>
    </div>
  );
}
