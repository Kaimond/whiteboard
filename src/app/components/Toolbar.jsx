"use client";
import { useState } from "react";
import { FaTrash } from "react-icons/fa";
import { FaPencilAlt } from "react-icons/fa";
import { FaEraser } from "react-icons/fa";
import { FaUndo } from "react-icons/fa";
import { FaRedo } from "react-icons/fa";
import styles from "../Toolbar.module.css";

export default function Toolbar({
    clearCanvas,
    setColour,
    setWidth,
    eraser,
    drawing,
    setBackgroundColour,
    opacity,
    setOpacity,
    undo,
    redo,
}) {
    const [activeTool, setActiveTool] = useState("draw");
    const [selectedColour, setSelectedColour] = useState("#000000");
    const [lineWidth, setLineWidth] = useState("5");
    const [backgroundPickerColour, setBackgroundPickerColour] = useState("#FFFFFF");

    const handleColourChange = (e) => {
        const newColour = e.target.value;
        setSelectedColour(newColour);
        setColour(newColour);
    };

    const handleWidthChange = (e) => {
        const newWidth = e.target.value;
        setLineWidth(newWidth);
        setWidth(newWidth);
    };

    const handleBackgroundColourChange = (e) => {
        const newColour = e.target.value;
        setBackgroundPickerColour(newColour);
        setBackgroundColour(newColour);
    };

    const handleOpacityChange = (e) => {
        const newOpacity = e.target.value / 100;
        setOpacity(newOpacity);
    };

    return (
        <div style={{
            marginBottom: "10px",
            backgroundColor: "#FFFFFF",
            color: "black",
            width: "800px",
            borderRadius: "10px"
        }}>
            <div className={styles.tooltip} data-tooltip="Clear">
                <button
                    onClick={clearCanvas}
                    style={{
                        padding: "8px 16px",
                        marginRight: "10px",
                        cursor: "pointer",
                        fontSize: "20px",
                    }}
                >
                    <FaTrash />
                </button >
            </div>
            <div className={styles.tooltip} data-tooltip="Undo">
                <button
                    onClick={undo}
                    style={{
                        padding: "8px 16px",
                        marginRight: "10px",
                        cursor: "pointer",
                        fontSize: "20px",
                    }}
                >
                    <FaUndo />
                </button>
            </div>
            <div className={styles.tooltip} data-tooltip="Redo">
                <button
                    onClick={redo}
                    style={{
                        padding: "8px 16px",
                        marginRight: "10px",
                        cursor: "pointer",
                        fontSize: "20px",
                    }}
                >
                    <FaRedo />
                </button>
            </div>
            Line Colour:
            <input
                type="color"
                value={selectedColour}
                onChange={handleColourChange}
                style={{ verticalAlign: "middle" }}
            />
            Line Width:
            <input
                type="number"
                value={lineWidth}
                onChange={handleWidthChange}
                min={"1"}
                max={"100"}
                style={{
                    marginLeft: "4px",
                    border: "2px solid white",
                    verticalAlign: "middle",
                }}
            />
            <div className={styles.tooltip} data-tooltip="Draw">
                <button
                    onClick={() => { drawing(); setActiveTool("draw") }}
                    style={{
                        padding: "8px",
                        marginRight: "10px",
                        cursor: "pointer",
                        fontSize: "20px",
                        color: activeTool === "draw" ? "#526EFF" : "",
                        backgroundColor: activeTool === "draw" ? "#e7ebfb" : "",
                        borderRadius: activeTool === "draw" ? "4px" : "",
                    }}
                >
                    <FaPencilAlt />
                </button>
            </div>
            <div className={styles.tooltip} data-tooltip="Erase">
                <button
                    onClick={() => { eraser(); setActiveTool("erase") }}
                    style={{
                        padding: "8px",
                        marginRight: "10px",
                        cursor: "pointer",
                        fontSize: "20px",
                        color: activeTool === "erase" ? "#526EFF" : "",
                        backgroundColor: activeTool === "erase" ? "#e7ebfb" : "",
                        borderRadius: activeTool === "erase" ? "4px" : "",
                    }}
                >
                    <FaEraser />
                </button>
            </div>
            <span>Background Colour:</span>
            <input
                type="color"
                value={backgroundPickerColour}
                onChange={handleBackgroundColourChange}
                style={{ verticalAlign: "middle" }}
            />
            <span style={{ marginRight: "10px" }}>Opacity: {(opacity * 100).toFixed(0)}%</span>
            <input
                type="range"
                min="0"
                max="100"
                value={opacity * 100}
                onChange={handleOpacityChange}
                style={{ verticalAlign: "middle" }}
            />
        </div>
    );
}