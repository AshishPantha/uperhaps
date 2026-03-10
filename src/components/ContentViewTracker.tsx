'use client';

import { useEffect, useRef } from 'react';
import { trpc } from '@/trpc/client';

interface ContentViewTrackerProps {
  productId: string;
  eventType?: 'view';
}

/**
 * Records a content view (or other event) in the background. Runs once after mount;
 * does not block render or user interaction.
 */
export function ContentViewTracker({
  productId,
  eventType = 'view',
}: ContentViewTrackerProps) {
  const hasRecorded = useRef(false);
  const record = trpc.recordContentEvent.useMutation({
    onError: () => {
      hasRecorded.current = false;
    },
  });

  useEffect(() => {
    if (!productId || hasRecorded.current) return;
    hasRecorded.current = true;
    record.mutate({ productId, eventType });
  }, [productId, eventType]);

  return null;
}
