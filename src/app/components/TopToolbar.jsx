"use client";
import React from 'react'
import { FaTrash, FaUndo, FaRedo, FaEye, FaEyeSlash } from "react-icons/fa";
import { IoMdDownload } from "react-icons/io";
import styles from "../Toolbar.module.css"

export default function TopToolbar({
    undo,
    redo,
    clearCanvas,
    download,
    showToolbar,
    setShowToolbar
}) {

    const toggleToolbar = () => {
        setShowToolbar((prev) => !prev);
        console.log("Toggled toolbar visibility:", !showToolbar);
    };

    return (
        <div className={styles.topToolbar}>
            <div className={styles.tooltip} data-tooltip="Undo (Ctrl + Z)">
                <button
                    className={styles.button}
                    onClick={undo}
                >
                    <FaUndo />
                </button>
            </div>

            <div className={styles.tooltip} data-tooltip="Redo (Ctrl + Shift + Z)">
                <button
                    className={styles.button}
                    onClick={redo}
                >
                    <FaRedo />
                </button>
            </div>

            <div className={styles.tooltip} data-tooltip="Clear (Ctrl + Del)">
                <button
                    className={styles.button}
                    onClick={clearCanvas}
                >
                    <FaTrash />
                </button >
            </div>

            <div className={styles.tooltip} data-tooltip="Save image (Ctrl + Alt + S)">
                <button
                    className={styles.button}
                    onClick={download}
                >
                    <IoMdDownload />
                </button >
            </div>

            <div className={styles.tooltip} data-tooltip={showToolbar ? "Hide toolbar" : "Show toolbar"}>
                <button
                    className={styles.button}
                    onClick={toggleToolbar}
                >
                    {showToolbar ? <FaEyeSlash /> : <FaEye />}
                </button>
            </div>
        </div >
    )
}