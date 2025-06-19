import { useEffect, useRef, useState } from "react";

export function Modal(
    props: {
        onClose: () => void,
        children: React.ReactNode
    }
) {
    const { children, onClose } = props;
    const [visible, setVisible] = useState(false);
    const overlayRef = useRef<HTMLDivElement>(null);

    useEffect(() => {
        // モーダルマウント時にアニメーション表示
        requestAnimationFrame(() => setVisible(true));
    }, []);

    const handleOverlayClick = (e: React.MouseEvent<HTMLDivElement>) => {
        if (e.target === overlayRef.current) {
            // オーバーレイ部分のみクリックで閉じる
            setVisible(false);
            setTimeout(onClose, 200); // フェードアウト終了後に閉じる
        }
    };

    return (
        <div
            ref={overlayRef}
            className={`modal-overlay ${visible ? "modal-open" : "modal-close"}`}
            onClick={handleOverlayClick}
        >
            <div className="modal-content">{children}</div>
        </div>
    );
}
