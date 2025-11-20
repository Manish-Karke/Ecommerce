
"use client"
import {
  Card,
  CardContent,
  CardHeader,
  CardDescription,
  CardTitle,
} from "@/components/ui/card";
import { products } from "@/lib/data";
import axios from "axios";
import { Building2, Package, Tag, TrendingUp } from "lucide-react";
import React, { useEffect, useState } from "react";

interface Stats {
  brands: number;
  categories: number;
  products: number;
  featured: number;
}

export default function AdminDashboard() {
  const [stats, setStats] = useState<Stats>({
    brands: 0,
    categories: 0,
    products: 0,
    featured: 0,
  });

  useEffect(() => {
    const fetchStats = async () => {
      try {
        const [brandRes, categoryRes, productRes] = await Promise.all([
          axios.get("/api/brands"),
          axios.get("/api/categories"),
          axios.get("/api/products"),
        ]);

        setStats({
          brands: brandRes.data.length,
          categories: categoryRes.data.length,
          products: productRes.data.length,
          featured: productRes.data.filter((p: any) => p.isFeatured).length,
        });
      } catch (error) {
        // Handle error as needed
        console.error("Failed to fetch stats:", error);
      }
    };

    fetchStats();
  }, []);

  return (
    <div className="space-y-6">
      <div>
        <h1 className="text--3xl font-bold">Admin Dashboard</h1>
        <p className="text-muted-foreground">
          Manage your brands, categories, and products
        </p>
      </div>
      <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-4">
        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Total Brands</CardTitle>
            <Building2 className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">12</div>
            <p className="text-xs text-muted-foreground">+2 from last month</p>
          </CardContent>
        </Card>
        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">
              Total Categories
            </CardTitle>
            <Tag className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">45</div>
            <p className="text-xs text-muted-foreground">+5 from last month</p>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">
              Total Products
            </CardTitle>
            <Package className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">234</div>
            <p className="text-xs text-muted-foreground">+18 from last month</p>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">
              Featured Items
            </CardTitle>
            <TrendingUp className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">28</div>
            <p className="text-xs text-muted-foreground">+3 from last month</p>
          </CardContent>
        </Card>
      </div>

      <div className="grid gap-4 md:grid-cols-2">
        <Card>
          <CardHeader>
            <CardTitle>Quick Actions</CardTitle>
            <CardDescription>Common administrative tasks</CardDescription>
          </CardHeader>
          <CardContent className="space-y-2">
            <div className="text-sm">
              <p>• Add new brand first</p>
              <p>• Then create categories under brands</p>
              <p>• Finally add products to categories</p>
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardHeader>
            <CardTitle>Recent Activity</CardTitle>
            <CardDescription>Latest changes to your inventory</CardDescription>
          </CardHeader>
          <CardContent className="space-y-2">
            <div className="text-sm space-y-1">
              <p>• New brand "TechCorp" added</p>
              <p>• Category "Electronics" updated</p>
              <p>• 5 products marked as featured</p>
            </div>
          </CardContent>
        </Card>
      </div>
    </div>
  );
}
