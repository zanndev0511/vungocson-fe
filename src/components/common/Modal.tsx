import React from "react";
import type { ModalProps } from "@interfaces/components/modal";
import "@styles/components/modal.scss";
import { ICONS } from "@constants/icons";

const Modal: React.FC<ModalProps> = (props) => {
  const {
    title,
    children,
    description,
    namebtn,
    isButton,
    isCancel,
    onClose,
    onClick,
  } = props;
  return (
    <div className="modal d-flex flex-col items-center justify-center">
      <div className="modal-wrap d-flex flex-col justify-center items-start">
        <div className="modal-container fullsize">
          {isCancel && (
            <img
              src={ICONS.cancel}
              alt=" "
              className="modal-cancelBtn"
              onClick={onClose}
            />
          )}

          <div className="d-flex flex-col justify-center items-center fullsize">
            <p className="text-uppercase font-size-lg text-font-semibold text-start width-fullsize">
              {title}
            </p>
            <p className="modal-desciption font-size-xs text-font-light text-start width-fullsize">
              {description}
            </p>
            <div className="modal-content  mt-3">{children}</div>
            {isButton && (
              <button
                className="modal-button text-font-light font-size-xs p-2 m-4 width-fullsize"
                onClick={onClick}
              >
                {namebtn}
              </button>
            )}
          </div>
        </div>
      </div>
    </div>
  );
};

export default Modal;
