import { createFileRoute, redirect } from "@tanstack/react-router";
import { ROUTES } from "@/constants/routes";

export const Route = createFileRoute("/_authenticated/attempts/")({
  beforeLoad: () => {
    throw redirect({ to: ROUTES.tests, replace: true });
  },
  component: () => null,
});
