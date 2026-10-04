import {
  Award,
  BarChart3,
  BookOpen,
  ClipboardList,
  LayoutDashboard,
  Settings,
  Target,
  type LucideIcon,
} from "lucide-react";

import { ROUTES } from "@/constants/routes";

export interface NavItem {
  label: string;
  to: string;
  icon: LucideIcon;
  description: string;
}

/** Primary navigation for the authenticated application shell. */
export const primaryNavigation: readonly NavItem[] = [
  {
    label: "Dashboard",
    to: ROUTES.dashboard,
    icon: LayoutDashboard,
    description: "Overview of your study activity",
  },
  {
    label: "Question Banks",
    to: ROUTES.questionBanks,
    icon: BookOpen,
    description: "Create and manage your question banks",
  },
  {
    label: "Tests",
    to: ROUTES.tests,
    icon: ClipboardList,
    description: "Generate and review exam-style tests",
  },
  {
    label: "Results",
    to: ROUTES.results,
    icon: Award,
    description: "Review test scores and past attempts",
  },
  {
    label: "Practice",
    to: ROUTES.practiceConfig,
    icon: Target,
    description: "Focused practice on weak questions",
  },
  {
    label: "Analytics",
    to: ROUTES.analytics,
    icon: BarChart3,
    description: "Progress and mastery insights",
  },
  {
    label: "Settings",
    to: ROUTES.settings,
    icon: Settings,
    description: "Account and application preferences",
  },
] as const;
