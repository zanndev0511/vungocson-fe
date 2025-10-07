export interface ModalProps{
    title?: string;
    description?: string;
    children?: React.ReactNode;
    namebtn?: string;
    isButton?: boolean;
    isCancel?: boolean;
    onClose: () => void;
    onClick?: () => void;
}
export {};