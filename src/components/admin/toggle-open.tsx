"use client";

import { useState } from "react";
import { toggleOpen } from "@/actions/menu";
import { Button } from "@/components/ui/button";
import { toast } from "sonner";

export function ToggleOpen({ isOpen }: { isOpen: boolean }) {
  const [open, setOpen] = useState(isOpen);
  const [loading, setLoading] = useState(false);

  const handleToggle = async () => {
    setLoading(true);
    try {
      await toggleOpen(!open);
      setOpen(!open);
      toast.success(open ? "Local cerrado" : "Local abierto");
    } catch {
      toast.error("Error al cambiar estado");
    } finally {
      setLoading(false);
    }
  };

  return (
    <Button
      onClick={handleToggle}
      disabled={loading}
      variant="outline"
      className={`gap-2 font-medium ${
        open
          ? "border-green-300 text-green-700 bg-green-50 hover:bg-green-100"
          : "border-red-300 text-red-700 bg-red-50 hover:bg-red-100"
      }`}
    >
      <span
        className={`w-2.5 h-2.5 rounded-full ${
          open ? "bg-green-500 animate-pulse" : "bg-red-500"
        }`}
      />
      {open ? "Abierto" : "Cerrado"}
    </Button>
  );
}
