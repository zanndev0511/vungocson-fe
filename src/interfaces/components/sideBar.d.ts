export interface SidebarProps {
  isOpen: boolean;
  onClose: () => void;
}
export interface MenuSideBar {
  id?: string;
  title: string;
  url: string;
  status: "inactive" | "active";
  order: number;
}
