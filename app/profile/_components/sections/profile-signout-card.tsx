import { LogOut } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";

interface ProfileSignoutCardProps {
  onSignOut: () => void;
}

export function ProfileSignoutCard({ onSignOut }: ProfileSignoutCardProps) {
  return (
    <Card className="border-destructive/20">
      <CardContent className="p-4">
        <Button
          variant="ghost"
          className="w-full text-destructive hover:text-destructive hover:bg-destructive/10"
          onClick={onSignOut}
          data-testid="sign-out"
        >
          <LogOut className="w-4 h-4 mr-2" />
          Keluar Akun
        </Button>
      </CardContent>
    </Card>
  );
}
