'use client';

import { useEffect, useRef } from 'react';
import { usePathname, useSearchParams } from 'next/navigation';
import { pageview } from '@/lib/metaPixel';

/**
 * PixelTracker Component
 * 
 * This component tracks page views on route changes using Meta Pixel.
 * It should be placed in the root layout to track all page navigations.
 * 
 * Features:
 * - Only runs on client-side (marked with 'use client')
 * - Prevents duplicate pageview events using a ref
 * - Tracks both pathname and search params changes
 */
export default function PixelTracker(): null {
    const pathname = usePathname();
    const searchParams = useSearchParams();
    const previousUrl = useRef<string | null>(null);

    useEffect(() => {
        // Construct the full URL including search params
        const url = pathname + (searchParams?.toString() ? `?${searchParams.toString()}` : '');

        // Prevent duplicate pageview events for the same URL
        if (previousUrl.current === url) {
            return;
        }

        // Update the previous URL ref
        previousUrl.current = url;

        // Track the pageview
        pageview();
    }, [pathname, searchParams]);

    // This component doesn't render anything
    return null;
}
