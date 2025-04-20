import {
    Drawer,
    DrawerContent,
    DrawerDescription,
    DrawerHeader,
    DrawerTitle,
} from "@/components/ui/drawer";
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
                        <DrawerTitle>Chats navigation</DrawerTitle>
                        <DrawerDescription>Chats</DrawerDescription>
                    </DrawerHeader>
                    <DrawerContent className="h-[100dvh] top-0 left-0 right-auto mt-0 w-min rounded-none text-white">
                        <SidebarContents />
                    </DrawerContent>
                </Drawer>
            </>
        </aside>
    );
}
