
'use client';

import { useState, useEffect } from 'react';
import { useSearchParams, useRouter, usePathname } from 'next/navigation';
import { listings } from '@/lib/dummy-data';
import {
  Card,
  CardContent,
  CardHeader,
  CardTitle,
} from '@/components/ui/card';
import { Checkbox } from '@/components/ui/checkbox';
import { Label } from '@/components/ui/label';
import { Slider } from '@/components/ui/slider';
import { Button } from '@/components/ui/button';
import { Separator } from '@/components/ui/separator';
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select"
import { formatPrice } from '@/lib/utils';

export function Filters() {
  const router = useRouter();
  const pathname = usePathname();
  const searchParams = useSearchParams();
  
  const countries = Array.from(new Set(listings.map(l => l.location.split(', ')[1]).filter(Boolean) as string[]));

  const [country, setCountry] = useState(searchParams.get('country') || 'all');
  const [types, setTypes] = useState<string[]>(searchParams.get('type')?.split(',') || []);
  const [price, setPrice] = useState(Number(searchParams.get('price')) || 0);
  const [rating, setRating] = useState(Number(searchParams.get('rating')) || 0);
  const [isClient, setIsClient] = useState(false);

  useEffect(() => {
    setIsClient(true);
  }, []);

  const handleTypeChange = (type: string, checked: boolean) => {
    setTypes(prev => 
      checked ? [...prev, type] : prev.filter(t => t !== type)
    );
  };
  
  const handleRatingChange = (newRating: number, checked: boolean) => {
    setRating(prev => {
        if (checked) {
            return newRating; // Set to the new rating
        }
        if (prev === newRating) {
            return 0; // Uncheck if it's the current rating
        }
        return prev;
    });
  };


  const handleApplyFilters = () => {
    const params = new URLSearchParams(searchParams);
    if (country && country !== 'all') {
      params.set('country', country);
    } else {
      params.delete('country');
    }

    if (types.length > 0) {
      params.set('type', types.join(','));
    } else {
      params.delete('type');
    }

    if (price > 0) {
        params.set('price', price.toString());
    } else {
        params.delete('price');
    }
    
    if (rating > 0) {
        params.set('rating', rating.toString());
    } else {
        params.delete('rating');
    }

    router.push(`${pathname}?${params.toString()}`);
  };
  
  const handleClearFilters = () => {
    setCountry('all');
    setTypes([]);
    setPrice(0);
    setRating(0);
    router.push(pathname);
  };

  return (
    <Card>
      <CardHeader>
        <CardTitle className="font-headline">Filters</CardTitle>
      </CardHeader>
      <CardContent className="space-y-6">
        <div className="space-y-3">
          <h4 className="font-semibold">Country</h4>
          <Select value={country} onValueChange={setCountry}>
            <SelectTrigger className="w-full">
              <SelectValue placeholder="All Countries" />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="all">All Countries</SelectItem>
              {countries.map(c => (
                <SelectItem key={c} value={c.toLowerCase()}>{c}</SelectItem>
              ))}
            </SelectContent>
          </Select>
        </div>
        <Separator />
        <div className="space-y-3">
          <h4 className="font-semibold">Listing Type</h4>
          <div className="flex items-center space-x-2">
            <Checkbox id="type-tour" checked={types.includes('tour')} onCheckedChange={(checked) => handleTypeChange('tour', !!checked)} />
            <Label htmlFor="type-tour">Tours</Label>
          </div>
          <div className="flex items-center space-x-2">
            <Checkbox id="type-hotel" checked={types.includes('hotel')} onCheckedChange={(checked) => handleTypeChange('hotel', !!checked)}/>
            <Label htmlFor="type-hotel">Hotels</Label>
          </div>
          <div className="flex items-center space-x-2">
            <Checkbox id="type-package" checked={types.includes('package')} onCheckedChange={(checked) => handleTypeChange('package', !!checked)}/>
            <Label htmlFor="type-package">Packages</Label>
          </div>
        </div>
        <Separator />
        <div className="space-y-4">
          <h4 className="font-semibold">Max Price</h4>
          {isClient && <Slider value={[price]} max={300000} step={1000} onValueChange={(value) => setPrice(value[0])} />}
          <div className="text-sm text-muted-foreground">
            {price > 0 ? `Up to ${formatPrice(price)}` : 'Select a price'}
          </div>
        </div>
        <Separator />
        <div className="space-y-3">
          <h4 className="font-semibold">Rating</h4>
          <div className="flex items-center space-x-2">
            <Checkbox id="rating-5" checked={rating === 5} onCheckedChange={(checked) => handleRatingChange(5, !!checked)} />
            <Label htmlFor="rating-5">5 stars</Label>
          </div>
          <div className="flex items-center space-x-2">
            <Checkbox id="rating-4" checked={rating === 4} onCheckedChange={(checked) => handleRatingChange(4, !!checked)} />
            <Label htmlFor="rating-4">4 stars & up</Label>
          </div>
          <div className="flex items-center space-x-2">
            <Checkbox id="rating-3" checked={rating === 3} onCheckedChange={(checked) => handleRatingChange(3, !!checked)} />
            <Label htmlFor="rating-3">3 stars & up</Label>
          </div>
        </div>
        <div className="flex flex-col gap-2">
            <Button onClick={handleApplyFilters} className="w-full">Apply Filters</Button>
            <Button onClick={handleClearFilters} className="w-full" variant="outline">Clear Filters</Button>
        </div>
      </CardContent>
    </Card>
  );
}
