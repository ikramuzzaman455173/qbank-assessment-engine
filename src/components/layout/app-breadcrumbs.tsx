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

interface BreadcrumbItemData {
  name: string;
  path: string;
  isLast: boolean;
  isClickable: boolean;
}

export function AppBreadcrumbs() {
  const location = useLocation();
  const path = location.pathname;

  const segments = path.split("/").filter(Boolean);

  if (segments.length === 0 || path === ROUTES.dashboard) {
    return null;
  }

  const breadcrumbItems: BreadcrumbItemData[] = [];

  // Special case 1: Test attempt result page (/attempts/$id/result)
  // Instead of broken "Attempts > Details > Result", provide clean "Tests > Test Result"
  if (segments[0] === "attempts" && segments[segments.length - 1] === "result") {
    breadcrumbItems.push(
      {
        name: "Tests",
        path: ROUTES.tests,
        isLast: false,
        isClickable: true,
      },
      {
        name: "Test Result",
        path,
        isLast: true,
        isClickable: false,
      },
    );
  }
  // Special case 2: Taking a test (/tests/$id/attempt)
  else if (segments[0] === "tests" && segments[segments.length - 1] === "attempt") {
    const testId = segments[1];
    breadcrumbItems.push(
      {
        name: "Tests",
        path: ROUTES.tests,
        isLast: false,
        isClickable: true,
      },
      {
        name: "Test Details",
        path: testId ? ROUTES.test(testId) : ROUTES.tests,
        isLast: false,
        isClickable: true,
      },
      {
        name: "Take Test",
        path,
        isLast: true,
        isClickable: false,
      },
    );
  }
  // Standard segmentation with intelligent name and clickability detection
  else {
    let currentPath = "";

    segments.forEach((segment, i) => {
      currentPath += `/${segment}`;
      const isLast = i === segments.length - 1;

      // Determine human-readable label
      const navItem = primaryNavigation.find(
        (item) => item.to === currentPath || item.to === `/${segment}`,
      );

      let name = navItem?.label;
      let isClickable = !isLast;

      if (!name) {
        if (segment === "profile") name = "Profile";
        else if (segment === "settings") name = "Settings";
        else if (segment === "create") name = "Create";
        else if (segment === "import") name = "Import";
        else if (segment === "result") name = "Result";
        else if (segment.length > 15 || !isNaN(Number(segment))) {
          name = "Details";
          // If it's a dynamic ID under a known list route like /question-banks/$id or /tests/$id, it is clickable
          const parent = segments[i - 1];
          if (parent !== "question-banks" && parent !== "tests") {
            isClickable = false;
          }
        } else {
          name = segment
            .split("-")
            .map((word) => word.charAt(0).toUpperCase() + word.slice(1))
            .join(" ");
        }
      }

      breadcrumbItems.push({
        name,
        path: currentPath,
        isLast,
        isClickable,
      });
    });
  }

  return (
    <Breadcrumb className="hidden md:flex">
      <BreadcrumbList>
        <BreadcrumbItem>
          <BreadcrumbLink asChild>
            <Link to={ROUTES.dashboard}>Dashboard</Link>
          </BreadcrumbLink>
        </BreadcrumbItem>
        {breadcrumbItems.length > 0 && <BreadcrumbSeparator />}

        {breadcrumbItems.map((item) => (
          <React.Fragment key={item.name + item.path}>
            <BreadcrumbItem>
              {item.isLast ? (
                <BreadcrumbPage>{item.name}</BreadcrumbPage>
              ) : item.isClickable ? (
                <BreadcrumbLink asChild>
                  <Link to={item.path}>{item.name}</Link>
                </BreadcrumbLink>
              ) : (
                <span className="text-muted-foreground select-none">{item.name}</span>
              )}
            </BreadcrumbItem>
            {!item.isLast && <BreadcrumbSeparator />}
          </React.Fragment>
        ))}
      </BreadcrumbList>
    </Breadcrumb>
  );
}
