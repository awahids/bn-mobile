"use client";

import { Plus } from "lucide-react";
import { HeaderIconButton, StickyPageHeader } from "@/components/shared/sticky-page-header";

interface SekolahIslamHeaderProps {
  totalSchools: number;
  canAdd: boolean;
  onAdd: () => void;
  onBack: () => void;
}

export function SekolahIslamHeader({ totalSchools, canAdd, onAdd, onBack }: SekolahIslamHeaderProps) {
  return (
    <StickyPageHeader
      title="Sekolah Islam"
      subtitle={`${totalSchools} sekolah terdaftar`}
      onBack={onBack}
      rightSlot={
        <HeaderIconButton
          onClick={onAdd}
          disabled={!canAdd}
          aria-label="Tambah sekolah"
          className="border-transparent bg-primary text-primary-foreground hover:bg-primary/90 disabled:opacity-40"
        >
          <Plus className="h-5 w-5" />
        </HeaderIconButton>
      }
    />
  );
}
