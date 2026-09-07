import { useState } from "react";
import { Outlet, NavLink } from "react-router-dom";
import { Library, Plus, Settings } from "lucide-react";
import {
  Sidebar,
  SidebarProvider,
  SidebarHeader,
  SidebarContent,
  SidebarSeparator,
  SidebarGroup,
  SidebarGroupLabel,
  SidebarGroupContent,
  SidebarMenu,
  SidebarMenuItem,
  SidebarMenuButton,
  SidebarTrigger,
} from "@/components/ui/sidebar";
import { KolamMark } from "@/components/branding/KolamMark";
import { cn } from "@/lib/utils";
import { paths } from "@/routes/paths";
import { MobileTabBar } from "./MobileTabBar";
import { useKeerthanas } from "@/lib/keerthanas";

const navItemClass = ({ isActive }: { isActive: boolean }) =>
  cn(
    "relative flex items-center gap-2 transition-smooth",
    isActive &&
      "bg-sidebar-accent text-sidebar-accent-foreground font-medium before:absolute before:-left-2 before:top-1/2 before:h-4 before:w-[3px] before:-translate-y-1/2 before:rounded-full before:bg-sidebar-primary group-data-[collapsible=icon]:before:hidden"
  );

export function SidebarLayout() {
  const { data: keerthanas = [] } = useKeerthanas();
  const [pinned, setPinned] = useState(false);
  const [hovered, setHovered] = useState(false);
  const open = pinned || hovered;
  const togglePinned = () => setPinned((p) => !p);

  return (
    <SidebarProvider open={open}>
      <div className="flex min-h-screen w-full bg-background">
        <div
          className="contents"
          onMouseEnter={() => setHovered(true)}
          onMouseLeave={() => setHovered(false)}
        >
          <Sidebar collapsible="icon" className="hidden md:flex border-r border-sidebar-border">
            <SidebarHeader className="px-4 py-6 group-data-[collapsible=icon]:px-2">
              <div className="flex items-center justify-between gap-2 group-data-[collapsible=icon]:justify-center">
                <NavLink to={paths.home()} className="flex items-center gap-2.5 min-w-0">
                  <span className="flex h-8 w-8 items-center justify-center rounded-full border border-sidebar-foreground/40 shrink-0">
                    <KolamMark className="h-5 w-5 text-sidebar-foreground" />
                  </span>
                  <span className="leading-none group-data-[collapsible=icon]:hidden">
                    <span className="block font-display text-lg font-bold">Keerthana</span>
                    <span className="label-caps !text-sidebar-foreground/70">Collection</span>
                  </span>
                </NavLink>
                <SidebarTrigger
                  className={cn(
                    "shrink-0 group-data-[collapsible=icon]:hidden",
                    pinned && "bg-sidebar-accent text-sidebar-accent-foreground"
                  )}
                  onClick={togglePinned}
                />
              </div>
            </SidebarHeader>

            <SidebarSeparator />

            <SidebarContent className="px-2 pt-4">
              <SidebarGroup className="p-0">
                <SidebarGroupLabel className="label-caps px-2 !text-sidebar-foreground/70">Navigate</SidebarGroupLabel>
                <SidebarGroupContent>
                  <SidebarMenu>
                    <SidebarMenuItem>
                      <SidebarMenuButton asChild tooltip="Collection">
                        <NavLink to={paths.home()} end className={navItemClass}>
                          <Library className="h-4 w-4" />
                          <span>Collection</span>
                          <span className="ml-auto label-caps !text-sidebar-foreground/80 group-data-[collapsible=icon]:hidden">
                            {keerthanas.length}
                          </span>
                        </NavLink>
                      </SidebarMenuButton>
                    </SidebarMenuItem>
                    <SidebarMenuItem>
                      <SidebarMenuButton asChild tooltip="Add">
                        <NavLink to={paths.add()} className={navItemClass}>
                          <Plus className="h-4 w-4" />
                          <span>Add</span>
                        </NavLink>
                      </SidebarMenuButton>
                    </SidebarMenuItem>
                    <SidebarMenuItem>
                      <SidebarMenuButton asChild tooltip="Settings">
                        <NavLink to={paths.settings()} className={navItemClass}>
                          <Settings className="h-4 w-4" />
                          <span>Settings</span>
                        </NavLink>
                      </SidebarMenuButton>
                    </SidebarMenuItem>
                  </SidebarMenu>
                </SidebarGroupContent>
              </SidebarGroup>
            </SidebarContent>

            <div className="border-t border-sidebar-border py-3 hidden group-data-[collapsible=icon]:flex justify-center">
              <SidebarTrigger
                className={cn(pinned && "bg-sidebar-accent text-sidebar-accent-foreground")}
                onClick={togglePinned}
              />
            </div>
          </Sidebar>
        </div>

        <div className="flex-1 min-w-0 kolam-dots">
          <main className="max-w-6xl mx-auto p-6 pb-24 md:pb-6">
            <Outlet />
          </main>
        </div>
      </div>
      <MobileTabBar />
    </SidebarProvider>
  );
}
