import { Link, useLocation } from "@tanstack/react-router";
import * as React from "react";

import { primaryNavigation } from "@/app/config/navigation";
import {
  Breadcrumb,
  BreadcrumbItem,
  BreadcrumbLink,
  BreadcrumbList,
  BreadcrumbPage,
  BreadcrumbSeparator,
} from "@/components/ui/breadcrumb";
import { ROUTES } from "@/constants/routes";

export function AppBreadcrumbs() {
  const location = useLocation();
  const path = location.pathname;

  // Don't show breadcrumbs on the dashboard itself to keep it clean,
  // or show just "Dashboard". We'll show "Dashboard" as the root.

  const segments = path.split("/").filter(Boolean);

  if (segments.length === 0 || path === ROUTES.dashboard) {
    return null; // Or return a single Dashboard breadcrumb if preferred.
  }

  // Helper to get a human-readable name for a path segment
  const getSegmentName = (segment: string, fullPath: string) => {
    // Check if it matches a primary navigation item
    const navItem = primaryNavigation.find(
      (item) => item.to === fullPath || item.to === `/${segment}`,
    );
    if (navItem) return navItem.label;

    // Special hardcoded routes
    if (segment === "profile") return "Profile";
    if (segment === "settings") return "Settings";

    // If it's a dynamic ID (like a UUID or number), we can just call it "Details" or similar
    if (segment.length > 15 || !isNaN(Number(segment))) {
      return "Details";
    }

    // Fallback: capitalize and replace dashes
    return segment
      .split("-")
      .map((word) => word.charAt(0).toUpperCase() + word.slice(1))
      .join(" ");
  };

  const breadcrumbItems: Array<{ name: string; path: string; isLast: boolean }> = [];
  let currentPath = "";

  segments.forEach((segment, i) => {
    currentPath += `/${segment}`;

    const isLast = i === segments.length - 1;
    const name = getSegmentName(segment, currentPath);

    breadcrumbItems.push({
      name,
      path: currentPath,
      isLast,
    });
  });

  return (
    <Breadcrumb className="hidden md:flex">
      <BreadcrumbList>
        <BreadcrumbItem>
          <BreadcrumbLink asChild>
            <Link to={ROUTES.dashboard}>Dashboard</Link>
          </BreadcrumbLink>
        </BreadcrumbItem>
        {breadcrumbItems.length > 0 && <BreadcrumbSeparator />}

        {breadcrumbItems.map((item, index) => (
          <React.Fragment key={item.path}>
            <BreadcrumbItem>
              {item.isLast ? (
                <BreadcrumbPage>{item.name}</BreadcrumbPage>
              ) : (
                <BreadcrumbLink asChild>
                  <Link to={item.path}>{item.name}</Link>
                </BreadcrumbLink>
              )}
            </BreadcrumbItem>
            {!item.isLast && <BreadcrumbSeparator />}
          </React.Fragment>
        ))}
      </BreadcrumbList>
    </Breadcrumb>
  );
}
