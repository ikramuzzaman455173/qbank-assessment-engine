import { createFileRoute, redirect } from "@tanstack/react-router";

export const Route = createFileRoute("/_authenticated/attempts/$attemptId/")({
  beforeLoad: ({ params }) => {
    throw redirect({
      to: "/attempts/$attemptId/result",
      params: { attemptId: params.attemptId },
      replace: true,
    });
  },
  component: () => null,
});
