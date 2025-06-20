"use client";
import { useState } from "react";
import { FaPencilAlt, FaCircle, FaEraser, FaUndo, FaRedo, FaTrash } from "react-icons/fa";
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
    const [showPenToolbar, setShowPenToolbar] = useState(false);
    const [selectedPreset, setSelectedPreset] = useState("#000000");
    const [lineWidth, setLineWidth] = useState("5");
    const [backgroundPickerColour, setBackgroundPickerColour] = useState("#FFFFFF");

    const togglePenToolbar = () => {
        setShowPenToolbar((prev) => !prev);
        drawing();
    };

    const presetColours = [
        { name: "Black", hex: "#000000" },
        { name: "White", hex: "#FFFFFF" },
        { name: "Red", hex: "#ff0000" },
        { name: "Orange", hex: "#FFA500" },
        { name: "Green", hex: "#00ff00" },
        { name: "Blue", hex: "#0000ff" },
        { name: "Light blue", hex: "#90D5FF" },
        { name: "Purple", hex: "#800080" },
        { name: "Pink", hex: "#FF00FF" },
        { name: "Yellow", hex: "#ffff00" },
    ];

    const handleColourChange = (colour, isPreset = false) => {
        setSelectedColour(colour);
        setColour(colour);
        setSelectedPreset(isPreset ? colour : null);
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
            position: "fixed",
            width: "700px",
            left: "50%",
            transform: "translate(-50%)",
            bottom: "50px",
            marginBottom: "10px",
            backgroundColor: "#fbfbfb",
            color: "black",
            border: "solid",
            borderRadius: "7px",
            borderColor: "#e4e4e4",
            zIndex: 1,
        }}>
            <div className={styles.tooltip} data-tooltip="Clear">
                <button
                    className={styles.button}
                    onClick={clearCanvas}
                >
                    <FaTrash />
                </button >
            </div>
            <div className={styles.tooltip} data-tooltip="Undo">
                <button
                    className={styles.button}
                    onClick={undo}
                >
                    <FaUndo />
                </button>
            </div>
            <div className={styles.tooltip} data-tooltip="Redo">
                <button
                    className={styles.button}
                    onClick={redo}
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
            <div className={styles.penButtonContainer} style={{ position: "relative", display: "inline-block" }}>
                <button
                    className={styles.button}
                    onClick={togglePenToolbar}
                    style={{
                        color: activeTool === "draw" ? "#526EFF" : "",
                        backgroundColor: activeTool === "draw" ? "#e7ebfb" : "",
                        borderRadius: activeTool === "draw" ? "4px" : "",
                        backgroundColor: showPenToolbar ? "#ddd" : "#fff",
                    }}
                    title="Draw"
                >
                    <FaPencilAlt />
                </button>
                {showPenToolbar && (
                    <div
                        className={styles.penToolbar}
                        style={{
                            position: "fixed",
                            width: "700px",
                            height: "90px",
                            top: "-150%",
                            left: "50%",
                            transform: "translate(-50%)",
                            backgroundColor: "#f3f3f3",
                            border: "1px solid #dadada",
                            padding: "10px",
                            borderRadius: "7px",
                            borderColor: "#e4e4e4",
                            zIndex: -1,
                            display: "flex",
                            alignItems: "center",
                            justifyContent: "space-between",
                        }}
                    >
                        <div className={styles.colourContainer}>
                            {presetColours.map((color) => (
                                <FaCircle
                                    key={color.hex}
                                    onClick={() => handleColourChange(color.hex, true)}
                                    className={styles.presetColourButton}
                                    style={{
                                        color: color.hex,
                                        border: selectedPreset === color.hex ? "2px solid #f3f3f3" : "",
                                        boxShadow: selectedPreset === color.hex ? "0 0 0 3px #526EFF" : "none",
                                        cursor: "pointer",
                                        borderRadius: "50%",
                                    }}
                                    title={`${color.name}`}
                                />
                            ))}
                        </div>
                    </div>
                )}
            </div>
            <div className={styles.tooltip} data-tooltip="Erase">
                <button
                    className={styles.button}
                    onClick={() => { eraser(); setActiveTool("erase") }}
                    style={{
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
        </div >
    );
}