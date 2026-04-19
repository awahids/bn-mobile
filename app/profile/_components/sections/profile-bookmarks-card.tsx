import { Bookmark, BookOpen, Trash2 } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";

interface ProfileBookmarksCardProps {
  bookmarks: any[];
  isDeleting: boolean;
  onDelete: (bookmarkId: string) => void;
  onGoQuran: () => void;
}

export function ProfileBookmarksCard({
  bookmarks,
  isDeleting,
  onDelete,
  onGoQuran,
}: ProfileBookmarksCardProps) {
  return (
    <Card className="mb-6">
      <CardHeader>
        <CardTitle className="flex items-center space-x-2">
          <Bookmark className="w-5 h-5" />
          <span>Bookmark Tersimpan</span>
        </CardTitle>
      </CardHeader>
      <CardContent className="space-y-3">
        {bookmarks.map((bookmark) => {
          const [surahId, ayahNumber] = bookmark.contentId.split(":");
          const isVerse = ayahNumber !== undefined;

          return (
            <div
              key={bookmark.id}
              className="flex items-center justify-between p-3 rounded-lg bg-muted/50 hover:bg-muted/70 transition-colors"
              data-testid={`bookmark-item-${bookmark.id}`}
            >
              <div className="flex items-center space-x-3">
                <div className="w-10 h-10 bg-chart-2/20 rounded-full flex items-center justify-center">
                  <BookOpen className="w-5 h-5 text-chart-2" />
                </div>
                <div>
                  <h3 className="font-medium">{isVerse ? `Al-Fatihah Ayat ${ayahNumber}` : `Surah ${surahId}`}</h3>
                  <p className="text-sm text-muted-foreground">{bookmark.note || (isVerse ? `Ayat ${ayahNumber}` : "Surah")}</p>
                  <p className="text-xs text-muted-foreground">{new Date(bookmark.createdAt).toLocaleDateString("id-ID")}</p>
                </div>
              </div>
              <Button
                variant="ghost"
                size="icon"
                onClick={() => onDelete(bookmark.id)}
                disabled={isDeleting}
                data-testid={`delete-bookmark-${bookmark.id}`}
              >
                <Trash2 className="w-4 h-4 text-muted-foreground hover:text-destructive" />
              </Button>
            </div>
          );
        })}

        <Button variant="outline" className="w-full mt-4" onClick={onGoQuran} data-testid="view-all-bookmarks">
          Lihat Al-Qur&apos;an
        </Button>
      </CardContent>
    </Card>
  );
}
