import NextLink from "next/link";
import type { ComponentProps } from "react";

// Site-wide: prefetch off unless a link opts in. (A tsconfig "next/link"
// redirect was tried first, but this Next version's bundler bypasses paths
// mappings for next/link — verified: a marker prop never reached prerendered
// output. So every Link imports this wrapper directly instead.)
type Props = ComponentProps<typeof NextLink>;

export default function Link({ prefetch, ...props }: Props) {
  return <NextLink {...props} prefetch={prefetch} />;
}
