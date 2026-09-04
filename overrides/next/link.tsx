import NextLink from "next/dist/client/link";
import type { ComponentPropsWithRef } from "react";

// Site-wide: prefetch fully disabled. tsconfig maps "next/link" here, so
// every Link resolves to this override with zero per-file changes. The
// prefetch prop is intentionally not forwarded: no per-link override.
type Props = Omit<ComponentPropsWithRef<typeof NextLink>, "prefetch">;

export default function Link(props: Props) {
  return <NextLink {...props} prefetch={false} />;
}
