"use client";
import { useState } from "react";

export default function Toolbar({ clearCanvas, setColour }) {
    const [selectedColour, setSelectedColour] = useState("#000000");

    const handleColourChange = (e) => {
        const newColour = e.target.value;
        setSelectedColour(newColour);
        setColour(newColour);
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
        </div>
    );
}