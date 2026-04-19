import { cn } from "@/lib/utils";
import type { ProfileStatItem } from "@/app/profile/_hooks/use-profile-page-data";

interface ProfileStatItemProps {
  stat: ProfileStatItem;
  isAuthenticated: boolean;
}

export function ProfileStatItemView({ stat, isAuthenticated }: ProfileStatItemProps) {
  const IconComponent = stat.icon;

  return (
    <div className="text-center">
      <div className="flex justify-center mb-2">
        <IconComponent className={cn("w-5 h-5", isAuthenticated ? stat.color : "text-muted-foreground")} />
      </div>
      <div className={cn("text-lg font-bold", !isAuthenticated && "text-muted-foreground")}>
        {isAuthenticated ? stat.value : "-"}
      </div>
      <div className="text-xs text-muted-foreground">{stat.label}</div>
    </div>
  );
}
