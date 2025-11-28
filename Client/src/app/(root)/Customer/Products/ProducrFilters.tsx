"use client";

import { Checkbox } from "@/components/ui/checkbox";
import { Label } from "@/components/ui/label";
import { Filter } from "lucide-react";

interface Category {
  _id: string;
  name: string;
}

interface Brand {
  _id: string;
  name: string;
}

interface ProductFiltersProps {
  categories: Category[];
  brands: Brand[];
  selectedCategory: string | null;
  selectedBrands: string[];
  onCategoryChange: (categoryId: string | null) => void;
  onBrandsChange: (brandIds: string[]) => void;
}

export default function ProductFilters({
  categories,
  brands,
  selectedCategory,
  selectedBrands,
  onCategoryChange,
  onBrandsChange,
}: ProductFiltersProps) {
  const handleBrandToggle = (brandId: string, checked: boolean) => {
    onBrandsChange(
      checked
        ? [...selectedBrands, brandId]
        : selectedBrands.filter((id) => id !== brandId)
    );
  };

  return (
    <aside className="lg:w-64 space-y-8">
      <div className="bg-white rounded-xl shadow-sm p-6">
        <h3 className="font-bold text-lg mb-4 flex items-center gap-2">
          <Filter className="h-5 w-5" />
          Filters
        </h3>

        {/* Categories */}
        <div className="mb-6">
          <h4 className="font-medium mb-3">Categories</h4>
          <div className="space-y-2">
            {categories.map((cat) => (
              <div key={cat._id} className="flex items-center space-x-2">
                <Checkbox
                  id={cat._id}
                  checked={selectedCategory === cat._id}
                  onCheckedChange={() =>
                    onCategoryChange(
                      selectedCategory === cat._id ? null : cat._id
                    )
                  }
                />
                <Label htmlFor={cat._id} className="cursor-pointer text-sm">
                  {cat.name}
                </Label>
              </div>
            ))}
          </div>
        </div>

        {/* Brands */}
        <div>
          <h4 className="font-medium mb-3">Brands</h4>
          <div className="space-y-2">
            {brands.map((brand) => (
              <div key={brand._id} className="flex items-center space-x-2">
                <Checkbox
                  id={brand._id}
                  checked={selectedBrands.includes(brand._id)}
                  onCheckedChange={(checked) =>
                    handleBrandToggle(brand._id, !!checked)
                  }
                />
                <Label htmlFor={brand._id} className="cursor-pointer text-sm">
                  {brand.name}
                </Label>
              </div>
            ))}
          </div>
        </div>
      </div>
    </aside>
  );
}