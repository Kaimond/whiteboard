"use client";
import React from 'react'
import { FaEye, FaEyeSlash } from "react-icons/fa";
import styles from "../Toolbar.module.css"

export default function TopToolbar({
    showToolbar,
    setShowToolbar
}) {

    const toggleToolbar = () => {
        setShowToolbar((prev) => !prev);
        console.log("Toggled toolbar visibility:", !showToolbar);
    };

    return (
        <div className={styles.topToolbar}>
            <button
                className={styles.button}
                onClick={toggleToolbar}
                style={{
                    cursor: "pointer",
                }}
                title={showToolbar ? "Hide toolbar" : "Show toolbar"}
            >
                {showToolbar ? <FaEyeSlash /> : <FaEye />}
            </button>
        </div>
    )
}