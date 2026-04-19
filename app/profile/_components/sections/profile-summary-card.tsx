import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Separator } from "@/components/ui/separator";
import { ProfileStatItemView } from "@/app/profile/_components/atoms/profile-stat-item";
import type { ProfileStatItem, ProfileUser } from "@/app/profile/_hooks/use-profile-page-data";

interface ProfileSummaryCardProps {
  isAuthenticated: boolean;
  sessionUser: any;
  user: ProfileUser;
  userStats: ProfileStatItem[];
  onLogin: () => void;
}

export function ProfileSummaryCard({
  isAuthenticated,
  sessionUser,
  user,
  userStats,
  onLogin,
}: ProfileSummaryCardProps) {
  return (
    <Card className="mb-6">
      <CardContent className="p-6">
        <div className="flex items-center space-x-4 mb-4">
          <Avatar className="w-16 h-16">
            {sessionUser?.avatarUrl ? (
              <AvatarImage src={sessionUser.avatarUrl} alt={sessionUser.name || "User"} />
            ) : (
              <AvatarFallback className="bg-primary text-primary-foreground text-xl">
                {sessionUser?.name?.charAt(0).toUpperCase() || "U"}
              </AvatarFallback>
            )}
          </Avatar>
          <div className="flex-1">
            <h2 className="text-xl font-semibold mb-1">{user.username}</h2>
            <p className="text-sm text-muted-foreground mb-2">{user.email}</p>
            {isAuthenticated ? (
              <Badge variant="secondary">Pelajar Aktif</Badge>
            ) : (
              <Button onClick={onLogin} size="sm" className="mt-1">
                Masuk ke Akun
              </Button>
            )}
          </div>
        </div>

        <Separator className="my-4" />

        <div className="grid grid-cols-3 gap-4">
          {userStats.map((stat) => (
            <ProfileStatItemView key={stat.label} stat={stat} isAuthenticated={isAuthenticated} />
          ))}
        </div>
      </CardContent>
    </Card>
  );
}
