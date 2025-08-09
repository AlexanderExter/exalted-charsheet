import {
  User,
  Swords,
  Shield,
  BookOpen,
  TrendingUp,
  Users,
  Scroll,
  type LucideIcon,
} from "lucide-react";
import type React from "react";
import { CoreStatsTab } from "./CoreStatsTab";
import { CombatTab } from "./CombatTab";
import { EquipmentTab } from "./EquipmentTab";
import { PowersTab } from "./PowersTab";
import { SocialTab } from "./SocialTab";
import { AdvancementTab } from "./AdvancementTab";
import { RulingsTab } from "./RulingsTab";

export interface TabConfig {
  id: string;
  label: string;
  icon: LucideIcon;
  component: React.ComponentType<any>;
}

export const tabs: TabConfig[] = [
  {
    id: "core",
    label: "Core Stats",
    icon: User,
    component: CoreStatsTab,
  },
  {
    id: "combat",
    label: "Combat",
    icon: Swords,
    component: CombatTab,
  },
  {
    id: "equipment",
    label: "Equipment",
    icon: Shield,
    component: EquipmentTab,
  },
  {
    id: "powers",
    label: "Powers",
    icon: BookOpen,
    component: PowersTab,
  },
  {
    id: "socials",
    label: "Socials",
    icon: Users,
    component: SocialTab,
  },
  {
    id: "advancement",
    label: "Advancement",
    icon: TrendingUp,
    component: AdvancementTab,
  },
  {
    id: "rulings",
    label: "Rulings",
    icon: Scroll,
    component: RulingsTab,
  },
];

export default tabs;
