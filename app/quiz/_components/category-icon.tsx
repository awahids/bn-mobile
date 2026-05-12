import { BookOpen, Globe, Languages, MapPin, Scale, Star } from "lucide-react";

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
    case "Scale":
      return <Scale className={className} />;
    case "Star":
      return <Star className={className} />;
    default:
      return null;
  }
};
