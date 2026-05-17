import { AlertCircle } from 'lucide-react';

interface AlertBannerProps {
  message: string;
}

export const AlertBanner = ({ message }: AlertBannerProps) => (
  <div className="flex items-start gap-2 rounded-md border border-red-200 bg-red-50 px-3 py-2 text-sm text-red-700" role="alert">
    <AlertCircle className="mt-0.5 h-4 w-4" />
    <span>{message}</span>
  </div>
);
