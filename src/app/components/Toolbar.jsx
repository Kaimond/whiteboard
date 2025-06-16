"use client";
import { useState } from "react";
import { FaTrash } from "react-icons/fa";
import { FaPencilAlt } from "react-icons/fa";
import { FaEraser } from "react-icons/fa";

export default function Toolbar({
    clearCanvas,
    setColour,
    setWidth,
    eraser,
    drawing,
    setBackgroundColour,
    opacity,
    setOpacity,
}) {
    const [activeTool, setActiveTool] = useState("draw");
    const [selectedColour, setSelectedColour] = useState("#ffffff");
    const [lineWidth, setLineWidth] = useState("5");
    const [backgroundPickerColour, setBackgroundPickerColour] = useState("#000000");

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
        <div style={{ marginBottom: "10px", backgroundColor: "#BEBEBE", color: "black", width: "700px", borderRadius: "10px" }}>
            <button
                onClick={clearCanvas}
                style={{
                    padding: "8px 16px",
                    marginRight: "10px",
                    cursor: "pointer",
                }}
            >
                <FaTrash />
            </button>
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
                style={{ marginLeft: "4px", border: "2px solid white", verticalAlign: "middle" }}
            />
            <button
                onClick={() => { drawing(); setActiveTool("draw") }}
                style={{
                    padding: "8px",
                    marginRight: "10px",
                    cursor: "pointer",
                    border: activeTool === "draw" ? "2px solid #6C3BAA" : "",
                    borderRadius: activeTool === "draw" ? "12px" : "",
                }}
            >
                <FaPencilAlt />
            </button>
            <button
                onClick={() => { eraser(); setActiveTool("erase") }}
                style={{
                    padding: "8px",
                    marginRight: "10px",
                    cursor: "pointer",
                    border: activeTool === "erase" ? "2px solid #6C3BAA" : "",
                    borderRadius: activeTool === "erase" ? "12px" : "",
                }}
            >
                <FaEraser />
            </button>
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