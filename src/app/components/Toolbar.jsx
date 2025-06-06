"use client";
import { useState } from "react";
import { FaPencilAlt } from "react-icons/fa";
import { FaEraser } from "react-icons/fa";

export default function Toolbar({ clearCanvas, setColour, setWidth, eraser, drawing, setBackgroundColor }) {
    const [selectedColour, setSelectedColour] = useState("#ffffff");
    const [lineWidth, setLineWidth] = useState("5");
    const [backgroundPickerColor, setBackgroundPickerColor] = useState("#000000");

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

    const handleBackgroundColorChange = (e) => {
        const newColor = e.target.value;
        setBackgroundPickerColor(newColor);
        setBackgroundColor(newColor);
    };

    return (
        <div style={{ marginBottom: "10px" }}>
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
                onClick={drawing}
                style={{
                    padding: "8px 16px",
                    marginRight: "10px",
                    cursor: "pointer",
                }}
            >
                <FaPencilAlt />
            </button>
            <button
                onClick={eraser}
                style={{
                    padding: "8px 16px",
                    marginRight: "10px",
                    cursor: "pointer",
                }}
            >
                <FaEraser />
            </button>
            <span>Background Color:</span>
            <input
                type="color"
                value={backgroundPickerColor}
                onChange={handleBackgroundColorChange}
                style={{ verticalAlign: "middle" }}
            />
        </div>
    );
}