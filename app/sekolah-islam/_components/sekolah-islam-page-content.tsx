"use client";

import { useCallback, useEffect, useMemo, useState } from "react";
import { useRouter } from "next/navigation";
import { MapPinned, Loader2, School, UserRound, X, Wallet, Phone, Search } from "lucide-react";
import { MobilePageShell } from "@/components/shared/mobile-page-shell";
import { BottomNavigation } from "@/components/shared/bottom-navigation";
import { SekolahIslamHeader } from "./sections/sekolah-islam-header";
import { Button } from "@/components/ui/button";
import { Card } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Badge } from "@/components/ui/badge";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import api, {
  getErrorMessage,
  isApiError,
  type SchoolItem,
  type SchoolJenjang,
  type SchoolStatus,
} from "@/lib/api";
import { useAuth } from "@/hooks/use-auth";

const JENJANG_OPTIONS: SchoolJenjang[] = ["TK", "SD", "SMP", "SMA", "SMK", "MI", "MTs", "MA", "Lainnya"];
const STATUS_OPTIONS: Array<{ value: SchoolStatus; label: string }> = [
  { value: "swasta", label: "Swasta" },
  { value: "negeri", label: "Negeri" },
];

function formatRupiah(value: number): string {
  return new Intl.NumberFormat("id-ID", {
    style: "currency",
    currency: "IDR",
    maximumFractionDigits: 0,
  }).format(value);
}

export function SekolahIslamPageContent() {
  const router = useRouter();
  const { status, isAuthenticated } = useAuth();

  const [schools, setSchools] = useState<SchoolItem[]>([]);
  const [loaded, setLoaded] = useState(false);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [errorMessage, setErrorMessage] = useState("");
  const [searchQuery, setSearchQuery] = useState("");
  const [filterJenjang, setFilterJenjang] = useState<SchoolJenjang | "Semua">("Semua");
  const [modalOpen, setModalOpen] = useState(false);
  const [form, setForm] = useState({
    name: "",
    location: "",
    jenjang: "SD" as SchoolJenjang,
    statusSekolah: "swasta" as SchoolStatus,
    monthlyFee: "",
    mapUrl: "",
    contact: "",
    description: "",
  });

  const canAddSchool = status === "authenticated" && isAuthenticated;

  const loadSchools = useCallback(async () => {
    try {
      const data = await api.schools.getSchools();
      setSchools(data || []);
      setErrorMessage("");
    } catch (error) {
      setErrorMessage(getErrorMessage(error) || "Gagal memuat daftar sekolah.");
    } finally {
      setLoaded(true);
    }
  }, []);

  useEffect(() => {
    void loadSchools();
  }, [loadSchools]);

  const handleOpenAdd = () => {
    if (!canAddSchool) {
      router.push("/login");
      return;
    }
    setModalOpen(true);
  };

  const resetForm = () => {
    setForm({
      name: "",
      location: "",
      jenjang: "SD",
      statusSekolah: "swasta",
      monthlyFee: "",
      mapUrl: "",
      contact: "",
      description: "",
    });
  };

  const handleCreateSchool = async () => {
    const name = form.name.trim();
    const location = form.location.trim();
    const mapUrl = form.mapUrl.trim();
    const contact = form.contact.trim();
    const monthlyFee = Number(form.monthlyFee);

    if (!name || !location || !mapUrl || Number.isNaN(monthlyFee) || monthlyFee < 0) {
      setErrorMessage("Lengkapi data sekolah dengan benar.");
      return;
    }

    setIsSubmitting(true);
    try {
      await api.schools.createSchool({
        name,
        location,
        jenjang: form.jenjang,
        statusSekolah: form.statusSekolah,
        monthlyFee,
        mapUrl,
        contact: contact || undefined,
        description: form.description.trim() || undefined,
      });
      setModalOpen(false);
      resetForm();
      await loadSchools();
      setErrorMessage("");
    } catch (error) {
      if (isApiError(error) && error.status === 401) {
        router.push("/login");
        return;
      }
      setErrorMessage(getErrorMessage(error) || "Gagal menambahkan sekolah.");
    } finally {
      setIsSubmitting(false);
    }
  };

  const filteredSchools = useMemo(() => {
    const q = searchQuery.toLowerCase().trim();
    return schools.filter((school) => {
      const matchesQuery =
        !q || school.name.toLowerCase().includes(q) || school.location.toLowerCase().includes(q);
      const matchesJenjang = filterJenjang === "Semua" || school.jenjang === filterJenjang;
      return matchesQuery && matchesJenjang;
    });
  }, [schools, searchQuery, filterJenjang]);

  const schoolCountLabel = useMemo(() => {
    const total = filteredSchools.length;
    const grand = schools.length;
    if (total === grand) return `${total} sekolah`;
    return `${total} dari ${grand} sekolah`;
  }, [filteredSchools.length, schools.length]);

  if (!loaded) {
    return (
      <div className="flex h-screen w-full items-center justify-center bg-background gap-3">
        <Loader2 className="animate-spin text-primary" size={24} />
        <span className="text-muted-foreground font-medium">Memuat data sekolah...</span>
      </div>
    );
  }

  return (
    <MobilePageShell className="pb-24">
      <SekolahIslamHeader
        totalSchools={schools.length}
        canAdd={canAddSchool}
        onAdd={handleOpenAdd}
        onBack={() => router.push("/")}
      />

      <div className="px-6 py-8 space-y-6">
        <div className="relative overflow-hidden bg-gradient-to-br from-primary to-primary/80 rounded-[2.5rem] p-8 text-white shadow-xl shadow-primary/20">
          <div className="absolute top-0 right-0 w-32 h-32 bg-white/10 blur-3xl -mr-10 -mt-10 rounded-full" />
          <h2 className="text-2xl font-black tracking-tight leading-tight mb-2">
            Direktori Sekolah Islam
          </h2>
          <p className="text-sm font-medium opacity-90 leading-relaxed mb-5">
            Cari referensi sekolah Islam dan bantu pengguna lain dengan menambahkan data sekolah baru.
          </p>
          <div className="inline-flex items-center rounded-full bg-white/15 px-4 py-2 text-[11px] font-black uppercase tracking-widest">
            {schoolCountLabel}
          </div>
        </div>

        <div className="flex gap-3">
          <div className="relative flex-1">
            <Search size={15} className="absolute left-3 top-1/2 -translate-y-1/2 text-muted-foreground pointer-events-none" />
            <Input
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              placeholder="Cari nama atau lokasi..."
              className="rounded-xl h-11 pl-9"
            />
          </div>
          <Select
            value={filterJenjang}
            onValueChange={(value) => setFilterJenjang(value as SchoolJenjang | "Semua")}
          >
            <SelectTrigger className="rounded-xl h-11 w-[120px] shrink-0">
              <SelectValue placeholder="Jenjang" />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="Semua">Semua</SelectItem>
              {JENJANG_OPTIONS.map((jenjang) => (
                <SelectItem key={jenjang} value={jenjang}>
                  {jenjang}
                </SelectItem>
              ))}
            </SelectContent>
          </Select>
        </div>

        {!canAddSchool && (
          <Card className="glass p-5 rounded-[2rem] border-primary/10">
            <p className="text-xs font-bold text-muted-foreground uppercase tracking-widest leading-relaxed">
              Login untuk menambahkan sekolah baru.
            </p>
          </Card>
        )}

        {errorMessage && (
          <Card className="p-4 rounded-2xl border-destructive/20 bg-destructive/5 text-destructive text-sm font-medium">
            {errorMessage}
          </Card>
        )}

        <div className="space-y-4">
          {filteredSchools.length === 0 ? (
            <Card className="glass p-10 rounded-[2rem] border-none text-center">
              <div className="mx-auto mb-4 w-14 h-14 rounded-2xl bg-primary/10 flex items-center justify-center">
                <School className="text-primary" size={28} />
              </div>
              <p className="text-sm font-black uppercase tracking-widest text-foreground">
                {schools.length === 0 ? "Belum ada data sekolah" : "Tidak ada hasil yang cocok"}
              </p>
              <p className="text-xs font-medium text-muted-foreground mt-2">
                {schools.length === 0
                  ? "Jadilah yang pertama menambahkan informasi sekolah."
                  : "Coba ubah kata kunci atau filter jenjang."}
              </p>
            </Card>
          ) : (
            filteredSchools.map((school) => (
              <Card
                key={school.id}
                className="glass p-5 rounded-[2rem] border-transparent hover:border-primary/20 transition-all duration-300 border-none"
              >
                <div className="space-y-4">
                  <div>
                    <h3 className="text-lg font-black tracking-tight text-foreground">{school.name}</h3>
                    <div className="mt-2 flex items-center gap-2 text-xs text-muted-foreground font-semibold">
                      <MapPinned size={14} className="text-primary" />
                      <span>{school.location}</span>
                    </div>
                  </div>

                  <div className="grid grid-cols-1 gap-2 text-xs">
                    <div className="flex flex-wrap items-center gap-2">
                      <Badge className="rounded-full bg-primary/10 text-primary border-transparent font-bold">
                        Jenjang {school.jenjang}
                      </Badge>
                      <Badge variant="secondary" className="rounded-full font-bold uppercase tracking-wide">
                        {school.statusSekolah}
                      </Badge>
                    </div>
                    <div className="flex items-center gap-2 text-muted-foreground font-semibold">
                      <Wallet size={14} className="text-primary" />
                      <span>Biaya bulanan: {formatRupiah(school.monthlyFee)}</span>
                    </div>
                    {school.contact && (
                      <div className="flex items-center gap-2 text-muted-foreground font-semibold">
                        <Phone size={14} className="text-primary" />
                        <span>Kontak: {school.contact}</span>
                      </div>
                    )}
                    <div className="flex items-center gap-2 text-muted-foreground font-semibold">
                      <UserRound size={14} className="text-primary" />
                      <span>
                        Dibuat oleh: {school.createdBy.name}
                        {school.createdBy.username ? ` (@${school.createdBy.username})` : ""}
                      </span>
                    </div>
                  </div>

                  {school.description && (
                    <p className="text-sm text-muted-foreground leading-relaxed">{school.description}</p>
                  )}

                  <div className="pt-1">
                    <a
                      href={school.mapUrl}
                      target="_blank"
                      rel="noreferrer"
                      className="inline-flex items-center justify-center h-10 px-4 rounded-xl bg-primary/10 text-primary text-xs font-black uppercase tracking-widest hover:bg-primary/20 transition-colors"
                    >
                      Buka Peta
                    </a>
                  </div>
                </div>
              </Card>
            ))
          )}
        </div>
      </div>

      {modalOpen && (
        <div
          className="fixed inset-0 z-[60] flex items-center justify-center p-6 bg-black/80 backdrop-blur-sm"
          onClick={(event) => event.target === event.currentTarget && setModalOpen(false)}
        >
          <div className="bg-card w-full max-w-sm rounded-[2.5rem] border border-white/10 overflow-hidden shadow-2xl">
            <div className="p-8 space-y-5">
              <div className="flex items-center justify-between">
                <h3 className="text-xl font-black tracking-tight">Tambah Sekolah</h3>
                <button
                  onClick={() => setModalOpen(false)}
                  className="w-9 h-9 rounded-full bg-muted text-muted-foreground hover:bg-muted/80 transition-colors flex items-center justify-center"
                >
                  <X size={18} />
                </button>
              </div>

              <div className="space-y-4">
                <Input
                  value={form.name}
                  onChange={(event) => setForm((prev) => ({ ...prev, name: event.target.value }))}
                  placeholder="Nama sekolah"
                  className="rounded-xl h-11"
                />
                <Input
                  value={form.location}
                  onChange={(event) => setForm((prev) => ({ ...prev, location: event.target.value }))}
                  placeholder="Lokasi"
                  className="rounded-xl h-11"
                />
                <Select
                  value={form.jenjang}
                  onValueChange={(value) => setForm((prev) => ({ ...prev, jenjang: value as SchoolJenjang }))}
                >
                  <SelectTrigger className="rounded-xl h-11">
                    <SelectValue placeholder="Jenjang sekolah" />
                  </SelectTrigger>
                  <SelectContent>
                    {JENJANG_OPTIONS.map((jenjang) => (
                      <SelectItem key={jenjang} value={jenjang}>
                        {jenjang}
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
                <Select
                  value={form.statusSekolah}
                  onValueChange={(value) =>
                    setForm((prev) => ({ ...prev, statusSekolah: value as SchoolStatus }))
                  }
                >
                  <SelectTrigger className="rounded-xl h-11">
                    <SelectValue placeholder="Status sekolah" />
                  </SelectTrigger>
                  <SelectContent>
                    {STATUS_OPTIONS.map((status) => (
                      <SelectItem key={status.value} value={status.value}>
                        {status.label}
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
                <Input
                  type="number"
                  min={0}
                  value={form.monthlyFee}
                  onChange={(event) => setForm((prev) => ({ ...prev, monthlyFee: event.target.value }))}
                  placeholder="Biaya bulanan (angka)"
                  className="rounded-xl h-11"
                />
                <Input
                  type="url"
                  value={form.mapUrl}
                  onChange={(event) => setForm((prev) => ({ ...prev, mapUrl: event.target.value }))}
                  placeholder="URL map"
                  className="rounded-xl h-11"
                />
                <Input
                  value={form.contact}
                  onChange={(event) => setForm((prev) => ({ ...prev, contact: event.target.value }))}
                  placeholder="Kontak (WA/telepon/website) - opsional"
                  className="rounded-xl h-11"
                />
                <Textarea
                  value={form.description}
                  onChange={(event) => setForm((prev) => ({ ...prev, description: event.target.value }))}
                  placeholder="Deskripsi tambahan (opsional)"
                  rows={4}
                  className="rounded-xl"
                />
              </div>

              <Button
                onClick={() => void handleCreateSchool()}
                disabled={isSubmitting}
                className="w-full h-12 rounded-2xl font-black uppercase tracking-widest text-xs"
              >
                {isSubmitting ? "Menyimpan..." : "Simpan Sekolah"}
              </Button>
            </div>
          </div>
        </div>
      )}

      <BottomNavigation />
    </MobilePageShell>
  );
}
