"use client";
import { useState, useEffect } from "react";
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

    const presetSize = [
        { size: "5", preview: "15px" },
        { size: "10", preview: "20px" },
        { size: "15", preview: "25px" },
        { size: "20", preview: "30px" },
        { size: "25", preview: "35px" },
    ];

    const handleColourChange = (colour) => {
        setSelectedColour(colour);
        setColour(colour);
    };

    const handleWidthChange = (size) => {
        setLineWidth(size);
        setWidth(size);
    };

    const handleBackgroundColourChange = (e) => {
        const newColour = e.target.value;
        setBackgroundPickerColour(newColour);
        setBackgroundColour(newColour);
    };

    const handleOpacityChange = (e) => {
        const newOpacity = e.target.value / 100;
        if (activeTool === "draw") {
            setOpacity(newOpacity);
        } else {
            setOpacity(1);
        }
    };

    useEffect(() => {
        if (activeTool === "erase") {
            setOpacity(1); // Reset opacity to 1 when switching to eraser
        }
    }, [activeTool]);

    return (
        <div className={styles.toolbar}>
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
            <div className={styles.tooltip} data-tooltip="Draw">
                <button
                    className={styles.button}
                    onClick={() => { togglePenToolbar(); setActiveTool("draw") }}
                    style={{
                        color: activeTool === "draw" ? "#526EFF" : "",
                        backgroundColor: activeTool === "draw" ? "#e7ebfb" : "",
                        borderRadius: activeTool === "draw" ? "4px" : "",
                    }}
                    title="Draw"
                >
                    <FaPencilAlt />
                </button>
            </div>
            {showPenToolbar && (
                <div className={styles.penToolbar}>
                    <div className={styles.colourContainer}>
                        {presetColours.map((colour) => (
                            <FaCircle
                                key={colour.hex}
                                onClick={() => handleColourChange(colour.hex)}
                                className={styles.presetColourButton}
                                style={{
                                    color: colour.hex,
                                    outline: selectedColour === colour.hex ? "2px solid #f3f3f3" : "",
                                    boxShadow: selectedColour === colour.hex ? "0 0 0 5px #526EFF" : "none",
                                    cursor: "pointer",
                                    borderRadius: "50%",
                                }}
                                title={`${colour.name}`}
                            />
                        ))}
                    </div>
                    <div className={styles.sizeContainer}>
                        {presetSize.map((size) => (
                            <FaCircle
                                key={size.size}
                                onClick={() => handleWidthChange(size.size)}
                                style={{
                                    fontSize: size.preview,
                                    color: selectedColour,
                                    outline: lineWidth === size.size ? "2px solid #f3f3f3" : "",
                                    boxShadow: lineWidth === size.size ? "0 0 0 5px #526EFF" : "none",
                                    cursor: "pointer",
                                    borderRadius: "50%",
                                }}
                            />
                        ))}
                    </div>
                    <div>
                        <input
                            type="range"
                            min="0"
                            max="100"
                            value={opacity * 100}
                            onChange={handleOpacityChange}
                            style={{
                                verticalAlign: "middle",
                                appearance: "none",
                                height: "10px",
                                borderRadius: "10px",
                                background: `linear-gradient(to right, rgba(0, 0, 0, 0) 0%, rgba(0, 0, 0, 1) 100%)`,
                                outline: "none",
                                boxShadow: "none",
                                cursor: "pointer",
                            }}
                        />
                    </div>
                </div>
            )}
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
        </div >
    );
}