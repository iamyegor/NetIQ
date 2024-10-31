import { DialogDescription } from "@/components/ui/dialog.tsx";
import { Drawer, DrawerContent, DrawerHeader, DrawerTitle } from "@/components/ui/drawer";
import useUiStore from "@/lib/zustand/ui/useUiStore";
import SidebarContents from "@/pages/ChatPage/Sidbar/SidebarContents/SidebarContents.tsx";
import { useSwipeable } from "react-swipeable";
import { useMediaQuery } from "react-responsive";

export default function Sidebar() {
    const { isSidebarExpanded, toggleSidebarExpanded } = useUiStore();

    const isMdScreen = useMediaQuery({ minWidth: 768 });

    const handlers = useSwipeable({
        onSwipedRight: () => toggleSidebarExpanded(),
        delta: 30,
        trackMouse: true,
    });

    return (
        <aside className="ease-in-out flex">
            {isMdScreen ? (
                <SidebarContents />
            ) : (
                <>
                    <div {...handlers} className="fixed left-0 top-0 bottom-0 w-16 bg-primary/10" />
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
            )}
        </aside>
    );
}
