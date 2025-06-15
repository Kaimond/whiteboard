"use client";
import { useState } from "react";
import { FaPencilAlt } from "react-icons/fa";
import { FaEraser } from "react-icons/fa";

export default function Toolbar({ clearCanvas, setColour, setWidth, eraser, drawing, setBackgroundColour }) {
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
                Clear Canvas
            </button>
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
        </div>
    );
}