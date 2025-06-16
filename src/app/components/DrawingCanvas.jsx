"use client";
import { useEffect, useRef, useState } from "react";
import Toolbar from "./Toolbar";

export default function DrawingCanvas() {
    const canvasRef = useRef(null);
    const [isDrawing, setIsDrawing] = useState(false);
    const [lastPos, setLastPos] = useState({ x: 0, y: 0 });
    const [lineColour, setLineColour] = useState("#ffffff");
    const [lineWidth, setLineWidth] = useState("5");
    const [backgroundColour, setBackgroundColour] = useState("black");
    const [opacity, setOpacity] = useState(1.0);
    const [history, setHistory] = useState([]);
    const [redoHistory, setRedoHistory] = useState([]);
    const [compositeOperation, setCompositeOperation] = useState("source-over");

    // Initialise canvas and update settings
    useEffect(() => {
        const canvas = canvasRef.current;
        const ctx = canvas.getContext("2d");

        // Set canvas size
        canvas.width = 1920;
        canvas.height = 1080;
        ctx.lineWidth = lineWidth;
        ctx.lineCap = "round";
        ctx.strokeStyle = lineColour;
        ctx.globalAlpha = opacity;
        ctx.globalCompositeOperation = compositeOperation;

        // Save initial blank state
        const initialState = canvas.toDataURL();
        setHistory([initialState]);
    }, []);

    // Update canvas context settings
    useEffect(() => {
        const canvas = canvasRef.current;
        const ctx = canvas.getContext("2d");
        ctx.strokeStyle = lineColour;
        ctx.lineWidth = lineWidth;
        ctx.globalAlpha = opacity;
        ctx.globalCompositeOperation = compositeOperation;
    }, [lineColour, lineWidth, opacity, compositeOperation]);

    const saveState = () => {
        const canvas = canvasRef.current;
        const ctx = canvas.getContext("2d");
        // Force context update
        ctx.stroke();
        const dataUrl = canvas.toDataURL();
        setHistory((prev) => {
            // Skip duplicate states
            if (prev.length > 0 && prev[prev.length - 1] === dataUrl) {
                return prev;
            }
            return [...prev, dataUrl];
        });
        setRedoHistory([]); // Clear redo history
    };

    const undo = () => {
        if (history.length <= 1) {
            return;
        }
        const canvas = canvasRef.current;
        const ctx = canvas.getContext("2d");
        const lastState = history[history.length - 1];
        const newHistory = history.slice(0, -1);

        // Save current context settings
        const savedCompositeOperation = ctx.globalCompositeOperation;
        ctx.globalCompositeOperation = "source-over"; // Reset for redraw
        setHistory(newHistory);
        setRedoHistory((prev) => [...prev, lastState]);

        const img = new Image();
        img.src = newHistory[newHistory.length - 1];
        img.onload = () => {
            ctx.clearRect(0, 0, canvas.width, canvas.height);
            ctx.drawImage(img, 0, 0);
            ctx.globalCompositeOperation = savedCompositeOperation; // Restore context
        };
        img.onerror = () => {
            ctx.globalCompositeOperation = savedCompositeOperation; // Restore context on error
        };
    };

    const redo = () => {
        if (redoHistory.length === 0) {
            return;
        }
        const canvas = canvasRef.current;
        const ctx = canvas.getContext("2d");
        const lastRedoState = redoHistory[redoHistory.length - 1];
        const newRedoHistory = redoHistory.slice(0, -1);

        // Save current context settings
        const savedCompositeOperation = ctx.globalCompositeOperation;
        ctx.globalCompositeOperation = "source-over";
        setRedoHistory(newRedoHistory);
        setHistory((prev) => [...prev, lastRedoState]);

        const img = new Image();
        img.src = lastRedoState;
        img.onload = () => {
            ctx.clearRect(0, 0, canvas.width, canvas.height);
            ctx.drawImage(img, 0, 0);
            ctx.globalCompositeOperation = savedCompositeOperation;
        };
        img.onerror = () => {
            ctx.globalCompositeOperation = savedCompositeOperation;
        };
    };

    const startDrawing = ({ nativeEvent }) => {
        const { offsetX, offsetY } = nativeEvent;
        setIsDrawing(true);
        setLastPos({ x: offsetX, y: offsetY });
    };

    const stopDrawing = () => {
        if (isDrawing) {
            const canvas = canvasRef.current;
            const ctx = canvas.getContext("2d");
            ctx.stroke();
            saveState();
        }
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
        ctx.strokeStyle = lineColour;
        ctx.lineWidth = lineWidth;
        ctx.globalAlpha = opacity;
        ctx.globalCompositeOperation = compositeOperation;
        ctx.beginPath();
        ctx.moveTo(x0, y0);
        ctx.lineTo(x1, y1);
        ctx.stroke();
        ctx.closePath();
    };

    const clearCanvas = () => {
        const canvas = canvasRef.current;
        const ctx = canvas.getContext("2d");
        ctx.clearRect(0, 0, canvas.width, canvas.height);
        const dataUrl = canvas.toDataURL();
        setHistory([dataUrl]); // Reset history with cleared state
        setRedoHistory([]);
    };

    const eraser = () => {
        setCompositeOperation("destination-out");
    };

    const drawing = () => {
        setCompositeOperation("source-over");
    };

    return (
        <div>
            <Toolbar
                clearCanvas={clearCanvas}
                setColour={setLineColour}
                setWidth={setLineWidth}
                eraser={eraser}
                drawing={drawing}
                setBackgroundColour={setBackgroundColour}
                opacity={opacity}
                setOpacity={setOpacity}
                undo={undo}
                redo={redo}
            />
            <canvas
                ref={canvasRef}
                onMouseDown={startDrawing}
                onMouseUp={stopDrawing}
                onMouseMove={draw}
                style={{
                    border: "1px solid black",
                    backgroundColor: backgroundColour,
                    width: 1920,
                    height: 1080
                }}
            />
        </div>
    );
}