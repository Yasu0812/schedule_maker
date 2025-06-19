// ModalContext.tsx
import React, { createContext, useContext, useState, ReactNode } from 'react';
import { Modal } from './Modal';

type ModalContextType = {
    showModal: (content: () => ReactNode) => void;
    hideModal: () => void;
};

// 初期値は null で、createContext には型パラメータを与える
const ModalContext = createContext<ModalContextType | undefined>(undefined);

// Provider の Props 型
type ModalProviderProps = {
    children: ReactNode;
};

export function ModalProvider({ children }: ModalProviderProps) {
    const [modalContent, setModalContent] = useState<() => ReactNode>(() => () => null);
    const [isOpen, setIsOpen] = useState(false);

    const showModal = (content: () => ReactNode) => {
        setModalContent(() => content);
        setIsOpen(true);
    };

    const hideModal = () => {
        setIsOpen(false);
        setModalContent(() => () => null);
    };

    return (
        <ModalContext.Provider value={{ showModal, hideModal }}>
            {children}
            {isOpen && (
                <Modal onClose={hideModal}>
                    {modalContent()}
                </Modal>
            )}
        </ModalContext.Provider>
    );
}

export const useModal = () => {
    const context = useContext(ModalContext);
    if (!context) {
        throw new Error('useModal must be used within a ModalProvider');
    }
    return context;
};
