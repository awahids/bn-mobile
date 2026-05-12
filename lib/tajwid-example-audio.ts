import type { TajwidExampleAPI } from "@/lib/api-core";

const verseAudioCache = new Map<string, string>();

const SURAH_NAME_TO_ID: Record<string, number> = {
  alfatihah: 1,
  alfaatiha: 1,
  albaqarah: 2,
  alanam: 6,
  qaf: 50,
  qaaf: 50,
  alinsan: 76,
  azzalzalah: 99,
  alzalzalah: 99,
  alhumazah: 104,
  alkawthar: 108,
  alkafirun: 109,
  annasr: 110,
  almasad: 111,
  alikhlas: 112,
  alfalaq: 113,
};

function normalizeSurahName(name: string) {
  return name.toLowerCase().replace(/[^a-z0-9]/g, "");
}

function resolveVerseKey(example: TajwidExampleAPI): string | null {
  if (example.verse_key && example.verse_key.includes(":")) {
    return example.verse_key;
  }

  const normalizedName = normalizeSurahName(example.surah_name);
  const surahId = SURAH_NAME_TO_ID[normalizedName];
  if (!surahId || !example.ayah_number) {
    return null;
  }

  return `${surahId}:${example.ayah_number}`;
}

export async function fetchTajwidExampleAudioUrl(example: TajwidExampleAPI): Promise<string> {
  const verseKey = resolveVerseKey(example);
  if (!verseKey) {
    throw new Error(`Cannot resolve verse key for ${example.surah_name}:${example.ayah_number}`);
  }

  const cached = verseAudioCache.get(verseKey);
  if (cached) {
    return cached;
  }

  const response = await fetch(
    `https://api.alquran.cloud/v1/ayah/${encodeURIComponent(verseKey)}/ar.alafasy`
  );
  if (!response.ok) {
    throw new Error(`Failed to fetch verse audio (${response.status})`);
  }

  const payload = await response.json();
  const audioUrl = payload?.data?.audio;
  if (typeof audioUrl !== "string" || audioUrl.length === 0) {
    throw new Error("Verse audio URL is missing");
  }

  verseAudioCache.set(verseKey, audioUrl);
  return audioUrl;
}
