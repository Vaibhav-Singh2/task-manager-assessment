import { Card, CardContent } from '@/components/ui/card';

export const SkeletonCard = () => (
  <Card>
    <CardContent className="space-y-3 pt-5">
      <div className="h-4 w-1/3 animate-pulse rounded bg-slate-200" />
      <div className="h-4 w-full animate-pulse rounded bg-slate-200" />
      <div className="h-4 w-2/3 animate-pulse rounded bg-slate-200" />
    </CardContent>
  </Card>
);
