const ConfirmModal = ({ visible, message, onConfirm, onCancel }) => {
    if (!visible) return null;

    return (
        <div className="confirmModal">
            <div className="confirm-msg-wrap">
                <p className="confirm-msg">{message}</p>
                <button onClick={onConfirm} style={{marginRight: '10px'}}>예</button>
                <button onClick={onCancel}>아니오</button>
            </div>
        </div>
    );
};

export default ConfirmModal;