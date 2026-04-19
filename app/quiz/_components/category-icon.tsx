import { BookOpen, Globe, Languages, MapPin } from "lucide-react";

interface CategoryIconProps {
  icon: string;
  className?: string;
}

export const CategoryIcon = ({ icon, className }: CategoryIconProps) => {
  switch (icon) {
    case "Languages":
      return <Languages className={className} />;
    case "BookOpen":
      return <BookOpen className={className} />;
    case "Mosque":
      return <MapPin className={className} />;
    case "Globe":
      return <Globe className={className} />;
    default:
      return null;
  }
};
