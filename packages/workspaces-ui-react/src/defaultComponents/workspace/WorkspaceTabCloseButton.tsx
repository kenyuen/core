import React, { useEffect, useRef, useState } from "react";
import { WorkspaceTabCloseButtonProps } from "../../types/internal";

const WorkspaceTabCloseButton: React.FC<WorkspaceTabCloseButtonProps> = ({ close }) => {

    const closeBtn = useRef<HTMLDivElement>(null);
    useEffect(() => {
        if (closeBtn.current) {
            const listener = (e: Event) => {
                e.stopImmediatePropagation();
                e.stopPropagation();
                close();
            };
            closeBtn.current.addEventListener("mousedown", listener);
            closeBtn.current.addEventListener("click", listener);
        }
    }, [closeBtn]);

    return <div title="close" ref={closeBtn} className="lm_close_tab"></div>
};

export default WorkspaceTabCloseButton;