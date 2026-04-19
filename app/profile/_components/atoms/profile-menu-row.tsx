import type { ReactNode } from "react";
import type { LucideIcon } from "lucide-react";

interface ProfileMenuRowProps {
  title: string;
  description: string;
  icon: LucideIcon;
  action: ReactNode;
}

export function ProfileMenuRow({ title, description, icon: IconComponent, action }: ProfileMenuRowProps) {
  return (
    <div className="flex items-center justify-between">
      <div className="flex items-center space-x-3">
        <div className="w-10 h-10 bg-muted rounded-full flex items-center justify-center">
          <IconComponent className="w-5 h-5 text-muted-foreground" />
        </div>
        <div>
          <h3 className="font-medium">{title}</h3>
          <p className="text-sm text-muted-foreground">{description}</p>
        </div>
      </div>
      {action}
    </div>
  );
}
