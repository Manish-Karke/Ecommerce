import NextLink from "next/link";
import { Building2, LayoutDashboard, Package, Tag } from "lucide-react";
import React from "react";
//hey better to add the nextlink for LINK
export default function AdminLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <div className="flex min-h-screen">
      <div className="w-64 bg-amber-500 border-r">
        <div className="flex h-full max-h-screen flex-col-reverse gap-2">
          <div className="flex h-14 items-center border-b px-4 lg:h-[60px] lg:px-6">
            <NextLink
              href="/admin"
              className="flex items-center gap-2 font-semibold"
            >
              <LayoutDashboard className="h-6 w-6" />
              <span>Admin Panel</span>
            </NextLink>
          </div>

          <div className="flex-1">
            <nav className="grid items-start px-2 text-sm font-medium lg:px-4">
              <NextLink
                href="/admin"
                className="flex items-center gap-3 rounded-lg px-3 py-2 text-muted-foreground transition-all hover:text-primary hover:bg-muted"
              >
                <LayoutDashboard className="h-4 w-4" />
                Dashboard
              </NextLink>

              <NextLink
                href="/Admin/Brand"
                className="flex items-center gap-3 rounded-lg px-3 py-2 text-muted-foreground transition-all hover:text-primary hover:bg-muted"
              >
                <Building2 className="h-4 w-4" />
                Brands
              </NextLink>

              <NextLink
                href="/Admin/category"
                className="flex items-center gap-3 rounded-lg px-3 py-2 text-muted-foreground transition-all hover:text-primary hover:bg-muted"
              >
                <Tag className="h-4 w-4" />
                Categories
              </NextLink>

              <NextLink
                href="/Admin/product"
                className="flex items-center gap-3 rounded-lg px-3 py-2 text-muted-foreground transition-all hover:text-primary hover:bg-muted"
              >
                <Package className="h-4 w-4" />
                Products
              </NextLink>
            </nav>
          </div>
        </div>
      </div>

      {/* Main Content */}
      <div className="flex-1">
        <main className="flex flex-1 flex-col gap-4 p-4 lg:gap-6 lg:p-6">
          {children}
        </main>
      </div>
    </div>
  );
}
