import { DialogDescription } from "@/components/ui/dialog.tsx";
import { Drawer, DrawerContent, DrawerHeader, DrawerTitle } from "@/components/ui/drawer";
import useUiStore from "@/lib/zustand/ui/useUiStore";
import SidebarContents from "@/pages/ChatPage/Sidbar/SidebarContents/SidebarContents.tsx";

export default function Sidebar() {
    const { isSidebarExpanded, toggleSidebarExpanded } = useUiStore();

    return (
        <aside className="ease-in-out flex">
            <>
                <Drawer
                    open={isSidebarExpanded}
                    onOpenChange={() => toggleSidebarExpanded()}
                    direction="left"
                >
                    <DrawerHeader className="absolute -top-[9999px] -left-[9999px]">
                        <DrawerTitle>Навигация по чатам</DrawerTitle>
                        <DialogDescription>Чаты</DialogDescription>
                    </DrawerHeader>
                    <DrawerContent className="h-screen top-0 left-0 right-auto mt-0 w-min rounded-none text-white">
                        <SidebarContents />
                    </DrawerContent>
                </Drawer>
            </>
        </aside>
    );
}
