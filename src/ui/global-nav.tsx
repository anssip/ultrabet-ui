'use client';

import {useSelectedLayoutSegment} from "next/navigation";
import Link from "next/link";

export default function GlobalNav() {
  return (
    <nav>
      <ul>
        <li><GlobalNavItem label="In-play" slug=""/></li>
        <li><GlobalNavItem label="Upcoming" slug="upcoming"/></li>
      </ul>
    </nav>
  )
}

function GlobalNavItem({
                         label,
                         slug,
                       }: {
  label: string
  slug: string
}) {
  const segment = useSelectedLayoutSegment();
  console.log("segment", segment);
  const isActive = slug === segment;

  // TODO: style active link
  return (
    <Link
      href={`/${slug}`}
    >
      {isActive ? <span>{">>" + label}</span> : <span>{label}</span>}
    </Link>
  );
}
