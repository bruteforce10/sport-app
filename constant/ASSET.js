import { Badge, Volleyball } from "lucide-react";
import {
  MdOutlineSportsSoccer,
  MdOutlineSportsBasketball,
  MdOutlineSportsTennis,
} from "react-icons/md";
import { TbSoccerField } from "react-icons/tb";

// Color mapping untuk kategori olahraga
const SPORT_COLORS = {
  Badminton: "#FF6B6B", // Merah
  Futsal: "#4ECDC4", // Cyan
  Basketball: "#45B7D1", // Biru
  Tennis: "#96CEB4", // Hijau
  Football: "#FFEAA7", // Kuning
  Volleyball: "#DDA0DD", // Ungu
};

// Icon mapping untuk kategori olahraga
const SPORT_ICONS = {
  Badminton: Badge,
  Futsal: MdOutlineSportsSoccer,
  Basketball: MdOutlineSportsBasketball,
  Tennis: MdOutlineSportsTennis,
  Football: TbSoccerField,
  Volleyball: Volleyball,
};

export { SPORT_COLORS, SPORT_ICONS };
