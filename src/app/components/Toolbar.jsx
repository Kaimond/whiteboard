"use client";
import { useState } from "react";

export default function Toolbar({ clearCanvas, setColour, setWidth, eraser, drawing }) {
    const [selectedColour, setSelectedColour] = useState("#ffffff");
    const [lineWidth, setLineWidth] = useState("5");

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
                onClick={eraser}
                style={{
                    padding: "8px 16px",
                    marginRight: "10px",
                    cursor: "pointer",
                }}
            >
                Eraser
            </button>
            <button
                onClick={drawing}
                style={{
                    padding: "8px 16px",
                    marginRight: "10px",
                    cursor: "pointer",
                }}
            >
                Draw
            </button>
        </div>
    );
}