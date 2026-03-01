"use client";

import { useRef, useCallback } from "react";
import { useRouter } from "next/navigation";

export default function SecretAdminTap() {
  const router = useRouter();
  const clickCount = useRef(0);
  const timer = useRef<ReturnType<typeof setTimeout> | null>(null);

  const handleClick = useCallback(() => {
    clickCount.current += 1;

    if (timer.current) clearTimeout(timer.current);
    timer.current = setTimeout(() => {
      clickCount.current = 0;
    }, 2000);

    if (clickCount.current >= 5) {
      clickCount.current = 0;
      if (timer.current) clearTimeout(timer.current);
      router.push("/login");
    }
  }, [router]);

  return (
    <span
      onPointerUp={handleClick}
      style={{
        cursor: "inherit",
        userSelect: "text",
        WebkitUserSelect: "text",
        WebkitTapHighlightColor: "transparent",
        pointerEvents: "auto",
        color: "inherit",
        font: "inherit",
      }}
      tabIndex={-1}
    >
      ·
    </span>
  );
}
