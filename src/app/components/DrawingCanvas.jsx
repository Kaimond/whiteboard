"use client";
import { useEffect, useRef, useState } from "react";

export default function DrawingCanvas() {
    const canvasRef = useRef(null);
    const [isDrawing, setIsDrawing] = useState(false);
    const [lastPos, setLastPos] = useState({ x: 0, y: 0 });

    useEffect(() => {
        const canvas = canvasRef.current;
        const ctx = canvas.getContext("2d");

        // Set canvas size
        canvas.width = 1300;
        canvas.height = 900;
        ctx.lineWidth = 5;
        ctx.lineCap = "round";
        ctx.strokeStyle = "white";
    }, []);

    const startDrawing = ({ nativeEvent }) => {
        const { offsetX, offsetY } = nativeEvent;
        setIsDrawing(true);
        setLastPos({ x: offsetX, y: offsetY });
    };

    const stopDrawing = () => {
        setIsDrawing(false);
    };

    const draw = ({ nativeEvent }) => {
        if (!isDrawing) return;
        const { offsetX, offsetY } = nativeEvent;
        const ctx = canvasRef.current.getContext("2d");
        drawLine(ctx, lastPos.x, lastPos.y, offsetX, offsetY);
        setLastPos({ x: offsetX, y: offsetY });
    };

    const drawLine = (ctx, x0, y0, x1, y1) => {
        ctx.beginPath();
        ctx.moveTo(x0, y0);
        ctx.lineTo(x1, y1);
        ctx.stroke();
        ctx.closePath();
    };

    return (
        <div>
            <canvas
                ref={canvasRef}
                onMouseDown={startDrawing}
                onMouseUp={stopDrawing}
                onMouseMove={draw}
                style={{ border: "1px solid black" }}
            />
        </div>
    );
}