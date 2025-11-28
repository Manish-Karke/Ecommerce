import { Button } from "@/components/ui/button";
import { AlertCircle } from "lucide-react";

interface ProductGridErrorProps {
  error: string;
  onRetry: () => void;
}

export default function ProductGridError({ error, onRetry }: ProductGridErrorProps) {
  return (
    <div className="text-center py-16 bg-white rounded-xl shadow-sm">
      <AlertCircle className="h-16 w-16 mx-auto text-red-400 mb-4" />
      <p className="text-xl font-semibold text-gray-900 mb-2">Oops! Something went wrong</p>
      <p className="text-red-600 mb-6">{error}</p>
      <Button onClick={onRetry} variant="default">
        Try Again
      </Button>
    </div>
  );
}