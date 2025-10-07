export interface TabsProps {
  tabs: Tab[];
  onTabChange?: (index: number) => void;
}

interface Tab {
  label: string;
  content: React.ReactNode;
}

export {};