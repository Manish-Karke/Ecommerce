import { Search, PackageX } from "lucide-react";

export default function ProductGridEmpty() {
  return (
    <div className="text-center py-16 bg-white rounded-xl shadow-sm">
      <div className="relative inline-block mb-4">
        <PackageX className="h-20 w-20 text-gray-300" />
        <Search className="h-8 w-8 text-gray-400 absolute -bottom-1 -right-1" />
      </div>
      <p className="text-xl font-semibold text-gray-900 mb-2">
        No products found
      </p>
      <p className="text-gray-500">
        Try adjusting your search or filters to find what you're looking for
      </p>
    </div>
  );
}
