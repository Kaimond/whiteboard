"use client";
import { useEffect, useRef, useState } from "react";
import Toolbar from "./Toolbar";

export default function DrawingCanvas() {
    const canvasRef = useRef(null);
    const [activeTool, setActiveTool] = useState("draw");
    const [isDrawing, setIsDrawing] = useState(false);
    const [lastPos, setLastPos] = useState({ x: 0, y: 0 });
    const [lineColour, setLineColour] = useState("#000000");
    const [lineWidth, setLineWidth] = useState("5");
    const [backgroundColour, setBackgroundColour] = useState("white");
    const [opacity, setOpacity] = useState(1.0);
    const [history, setHistory] = useState([]);
    const [redoHistory, setRedoHistory] = useState([]);
    const [compositeOperation, setCompositeOperation] = useState("source-over");
    const hotspotX = (21.6 / 512) * 24; // Pen tip X
    const hotspotY = (362.4 / 512) * 24; // Pen tip Y
    // Pencil cursor
    const [cursorStyle, setCursorStyle] = useState(`url("data:image/svg+xml,%3Csvg xmlns='http://www.w3.org/2000/svg' width='24' height='24' viewBox='0 0 512 512'%3E%3Cpath d='M497.9 142.1l-46.1 46.1c-4.7 4.7-12.3 4.7-17 0l-111-111c-4.7-4.7-4.7-12.3 0-17l46.1-46.1c18.7-18.7 49.1-18.7 67.9 0l60.1 60.1c18.8 18.7 18.8 49.1 0 67.9zM284.2 99.8L21.6 362.4 .4 483.9c-2.9 16.4 11.4 30.6 27.8 27.8l121.5-21.3 262.6-262.6c4.7-4.7 4.7-12.3 0-17l-111-111c-4.8-4.7-12.4-4.7-17.1 0zM124.1 339.9c-5.5-5.5-5.5-14.3 0-19.8l154-154c5.5-5.5 14.3-5.5 19.8 0s5.5 14.3 0 19.8l-154 154c-5.5 5.5-14.3 5.5-19.8 0zM88 424h48v36.3l-64.5 11.3-31.1-31.1L51.7 376H88v48z' fill='black'/%3E%3C/svg%3E") ${hotspotX} ${hotspotY}, auto`);

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
        setCursorStyle(
            `url("data:image/svg+xml,%3Csvg xmlns='http://www.w3.org/2000/svg' width='24' height='24' viewBox='0 0 576 512'%3E%3Cpath d='M290.7 57.4L57.4 290.7c-25 25-25 65.5 0 90.5l80 80c12 12 28.3 18.7 45.3 18.7L288 480l9.4 0L512 480c17.7 0 32-14.3 32-32s-14.3-32-32-32l-124.1 0L518.6 285.3c25-25 25-65.5 0-90.5L381.3 57.4c-25-25-65.5-25-90.5 0zM297.4 416l-9.4 0-105.4 0-80-80L227.3 211.3 364.7 348.7 297.4 416z' fill='black'/%3E%3C/svg%3E") ${hotspotX} ${hotspotY}, auto`
        );
    };

    const drawing = () => {
        setCompositeOperation("source-over");
        setCursorStyle(
            `url("data:image/svg+xml,%3Csvg xmlns='http://www.w3.org/2000/svg' width='24' height='24' viewBox='0 0 512 512'%3E%3Cpath d='M497.9 142.1l-46.1 46.1c-4.7 4.7-12.3 4.7-17 0l-111-111c-4.7-4.7-4.7-12.3 0-17l46.1-46.1c18.7-18.7 49.1-18.7 67.9 0l60.1 60.1c18.8 18.7 18.8 49.1 0 67.9zM284.2 99.8L21.6 362.4 .4 483.9c-2.9 16.4 11.4 30.6 27.8 27.8l121.5-21.3 262.6-262.6c4.7-4.7 4.7-12.3 0-17l-111-111c-4.8-4.7-12.4-4.7-17.1 0zM124.1 339.9c-5.5-5.5-5.5-14.3 0-19.8l154-154c5.5-5.5 14.3-5.5 19.8 0s5.5 14.3 0 19.8l-154 154c-5.5 5.5-14.3 5.5-19.8 0zM88 424h48v36.3l-64.5 11.3-31.1-31.1L51.7 376H88v48z' fill='black'/%3E%3C/svg%3E") ${hotspotX} ${hotspotY}, auto`
        );
    };

    useEffect(() => {
        const handleKeydown = (event) => {
            if (event.ctrlKey && event.key === "Delete") {
                clearCanvas();
            }

            if (event.key.toLowerCase() === "d") {
                drawing();
                setActiveTool("draw");
            }

            if (event.key.toLowerCase() === "e") {
                eraser();
                setActiveTool("erase");
            }

            if (event.ctrlKey && event.key === "z") {
                undo();
            }

            if (event.ctrlKey && event.shiftKey && event.key.toLowerCase() === "z") {
                redo();
            }
        };

        window.addEventListener('keydown', handleKeydown);

        return () => {
            window.removeEventListener('keydown', handleKeydown);
        };
    }, [history, redoHistory]);

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
                activeTool={activeTool}
                setActiveTool={setActiveTool}
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
                    height: 1080,
                    cursor: cursorStyle,
                }}
            />
        </div>
    );
}