import { create } from "zustand";
import { persist } from "zustand/middleware";

interface SideBarState {
  isOpen: boolean;
  toggleSideBar: () => void;
}

const useSideBarStore = create<SideBarState>()(
  persist(
    (set) => ({
      isOpen: false,
      toggleSideBar: () => set((state) => ({ isOpen: !state.isOpen })),
    }),
    {
      name: "sideBar",
    }
  )
);

// Export the store hook directly
export default useSideBarStore;
