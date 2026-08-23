import { Outlet, NavLink } from "react-router-dom";
import { Library, Settings } from "lucide-react";
import {
  Sidebar,
  SidebarProvider,
  SidebarHeader,
  SidebarContent,
  SidebarMenu,
  SidebarMenuItem,
  SidebarMenuButton,
  SidebarTrigger,
} from "@/components/ui/sidebar";
import { cn } from "@/lib/utils";
import { paths } from "@/routes/paths";
import { MobileTabBar } from "./MobileTabBar";
import { useKeerthanas } from "@/lib/keerthanas";

export function SidebarLayout() {
  const { data: keerthanas = [] } = useKeerthanas();

  return (
    <SidebarProvider defaultOpen>
      <div className="flex min-h-screen w-full bg-background">
        <Sidebar collapsible="icon" className="hidden md:flex border-r border-sidebar-border">
          <SidebarHeader className="px-4 py-6">
            <div className="flex items-center justify-between gap-2">
              <NavLink to={paths.home()} className="flex items-center gap-2.5 min-w-0">
                <span className="flex h-8 w-8 rotate-45 items-center justify-center border-2 border-sidebar-foreground shrink-0">
                  <span className="h-2.5 w-2.5 -rotate-45 rounded-full bg-sidebar-foreground" />
                </span>
                <span className="leading-none group-data-[collapsible=icon]:hidden">
                  <span className="block font-display text-lg font-bold">Keerthana</span>
                  <span className="label-caps text-sidebar-foreground/70">Collection</span>
                </span>
              </NavLink>
              <SidebarTrigger className="shrink-0 group-data-[collapsible=icon]:hidden" />
            </div>
          </SidebarHeader>

          <SidebarContent className="px-2">
            <SidebarMenu>
              <SidebarMenuItem>
                <SidebarMenuButton asChild>
                  <NavLink
                    to={paths.home()}
                    end
                    className={({ isActive }) =>
                      cn("flex items-center gap-2", isActive && "bg-sidebar-accent text-sidebar-accent-foreground font-medium")
                    }
                  >
                    <Library className="h-4 w-4" />
                    <span>Collection</span>
                    <span className="ml-auto label-caps text-sidebar-foreground/60 group-data-[collapsible=icon]:hidden">
                      {keerthanas.length}
                    </span>
                  </NavLink>
                </SidebarMenuButton>
              </SidebarMenuItem>
              <SidebarMenuItem>
                <SidebarMenuButton asChild>
                  <NavLink
                    to={paths.settings()}
                    className={({ isActive }) =>
                      cn("flex items-center gap-2", isActive && "bg-sidebar-accent text-sidebar-accent-foreground font-medium")
                    }
                  >
                    <Settings className="h-4 w-4" />
                    <span>Settings</span>
                  </NavLink>
                </SidebarMenuButton>
              </SidebarMenuItem>
            </SidebarMenu>
          </SidebarContent>

          <div className="hidden group-data-[collapsible=icon]:flex justify-center py-3">
            <SidebarTrigger />
          </div>
        </Sidebar>

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
