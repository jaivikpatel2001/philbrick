import type { ReactNode } from "react";
import { isReleased } from "@/lib/release";
import { ComingSoon } from "./ComingSoon";

interface ReleaseGateProps {
  /** The route this page serves, e.g. "/about" or "/products/ard". */
  route: string;
  /** Optional friendly section name for the Coming Soon screen. */
  label?: string;
  children: ReactNode;
}

/**
 * Centralised production release gate. Wrap a page's real content in this and
 * it renders the content when the route is released (or in development), or the
 * animated Coming Soon screen otherwise. Pages never implement gating logic
 * themselves — they only declare their route.
 */
export function ReleaseGate({ route, label, children }: ReleaseGateProps) {
  if (isReleased(route)) return <>{children}</>;
  return <ComingSoon route={route} label={label} />;
}
