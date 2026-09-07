import { NavLink } from "react-router-dom";
import { Library, Settings, Plus } from "lucide-react";
import { cn } from "@/lib/utils";
import { paths } from "@/routes/paths";

const tabs = [
  { to: paths.home(), label: "Collection", icon: Library, end: true },
  { to: paths.add(), label: "Add", icon: Plus, end: false },
  { to: paths.settings(), label: "Settings", icon: Settings, end: false },
];

export function MobileTabBar() {
  return (
    <nav className="md:hidden fixed inset-x-0 bottom-0 z-30 flex border-t border-sidebar-border bg-sidebar text-sidebar-foreground">
      {tabs.map(({ to, label, icon: Icon, end }) => (
        <NavLink
          key={to}
          to={to}
          end={end}
          className={({ isActive }) =>
            cn(
              "flex-1 flex flex-col items-center justify-center gap-1 py-2.5 label-caps",
              isActive ? "!text-sidebar-foreground font-semibold" : "!text-sidebar-foreground/60"
            )
          }
        >
          <Icon className="h-5 w-5" />
          <span>{label}</span>
        </NavLink>
      ))}
    </nav>
  );
}
