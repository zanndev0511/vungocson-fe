export interface SidebarAccountProps {
  activeTab: int;
  setActiveTab : (index: number) => void
  isOpen?: boolean;
  onClose?: () => void;
  className?: string;
}
export {};