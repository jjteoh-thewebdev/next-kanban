"use client";

import { BoardProvider } from "@/components/context/board-context";
import { KanbanBoard } from "@/components/kanban-board";
import { useEffect, useState } from "react";

export default function Home() {
  const [isMounted, setIsMounted] = useState(false);
  const [viewportHeight, setViewportHeight] = useState("100vh");

  useEffect(() => {
    const updateHeight = () => {
      // Force update mobile height to be precise
      setViewportHeight(`${window.innerHeight}px`);

      // Trigger layout recalculation on resize
      document.body.style.height = `${window.innerHeight}px`;
    };

    const handleResize = () => {
      // Disable animations during resize
      document.documentElement.classList.add('resize-animation-stopper');

      updateHeight();

      // Re-enable animations after the resize is complete
      setTimeout(() => {
        document.documentElement.classList.remove('resize-animation-stopper');
        window.dispatchEvent(new Event('resize'));
      }, 400);
    };

    updateHeight();
    setIsMounted(true);

    window.addEventListener("resize", handleResize);
    return () => window.removeEventListener("resize", handleResize);
  }, []);

  if (!isMounted) {
    return null;
  }

  return (
    <div
      style={{
        height: viewportHeight,
        width: "100%",
        overflow: "hidden",
        display: "flex",
        flexDirection: "column"
      }}
    >
      <BoardProvider>
        <KanbanBoard />
      </BoardProvider>
    </div>
  );
}
