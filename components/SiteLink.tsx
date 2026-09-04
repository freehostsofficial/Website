import NextLink from "next/link";
import type { ComponentProps } from "react";

// Site-wide: prefetch fully disabled. (A tsconfig "next/link" redirect was
// tried first, but this Next version's bundler bypasses paths mappings for
// next/link — verified: a marker prop never reached prerendered output. So
// every Link imports this wrapper directly instead.) The prefetch prop is
// intentionally not forwarded: there is no per-link override.
type Props = Omit<ComponentProps<typeof NextLink>, "prefetch">;

export default function Link(props: Props) {
  return <NextLink {...props} prefetch={false} />;
}
