"use client";
import { useEffect, useRef, useState } from "react";
import io from "socket.io-client";
import Toolbar from "./Toolbar";
import TopToolbar from "./TopToolbar";
import { v4 as uuidv4 } from 'uuid';

export default function DrawingCanvas() {
    const canvasRef = useRef(null);
    const socketRef = useRef(null);
    const [showToolbar, setShowToolbar] = useState(true);
    const [activeTool, setActiveTool] = useState("draw");
    const [isDrawing, setIsDrawing] = useState(false);
    const [lastPos, setLastPos] = useState({ x: 0, y: 0 });
    const [lineColour, setLineColour] = useState("#000000");
    const [lineWidth, setLineWidth] = useState("5");
    const [backgroundColour, setBackgroundColour] = useState("white");
    const [opacity, setOpacity] = useState(1.0);
    const [history, setHistory] = useState([]);
    const [redoHistory, setRedoHistory] = useState([]);
    const [currentStroke, setCurrentStroke] = useState([]);
    const [userId, setUserId] = useState(null);
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

        // Connect to WebSocket server
        socketRef.current = io(process.env.NEXT_PUBLIC_WEBSOCKET_URL, {
          reconnection: true,
          secure: true
        });

        socketRef.current.on("connect", () => {
            console.log("Connected to server, socket ID:", socketRef.current.id);
            setUserId(socketRef.current.id);
            socketRef.current.emit("loadCanvas");
        });

        // Handle connection errors
        socketRef.current.on("connect_error", (error) => {
            console.error("Socket connection error:", error);
        });

        // Handles canvas state update from server on connect or refresh
        socketRef.current.on("canvasState", (state) => {
            setHistory([]);
            setRedoHistory([]);
            redrawCanvas(state.history);
        });

        // Handle incoming draw events 
        socketRef.current.on("drawStroke", (stroke) => {
            if (stroke.userId !== socketRef.current.id) {
                setHistory((prev) => {
                    // Avoid duplicates in history
                    if (prev.some((s) => s.id === stroke.id)) {
                        return prev;
                    }
                    return [...prev, stroke];
                });
                drawStroke(canvas.getContext("2d"), stroke);
            }
        });

        // Handle canvas clear
        socketRef.current.on("clearCanvas", () => {
            const ctx = canvasRef.current.getContext("2d");
            ctx.clearRect(0, 0, canvas.width, canvas.height);
            setHistory([]);
            setRedoHistory([]);
        });

        // Handle undo events
        socketRef.current.on("undo", (data) => {
            if (data.userId !== socketRef.current.id) {
                setHistory((prev) => {
                    const strokeIndex = prev.findIndex(
                        (stroke) => stroke.userId === data.userId && stroke.id === data.stroke.id
                    );
                    if (strokeIndex !== -1) {
                        const newHistory = [...prev];
                        const [undoneStroke] = newHistory.splice(strokeIndex, 1);
                        setRedoHistory((prevRedo) => {
                            // Avoid duplicates in redoHistory
                            if (prevRedo.some((s) => s.id === undoneStroke.id)) {
                                return prevRedo;
                            }
                            const newRedo = [...prevRedo, undoneStroke];
                            return newRedo;
                        });
                        redrawCanvas(newHistory);
                        return newHistory;
                    }
                    return prev;
                });
            }
        });

        // Handle redo events
        socketRef.current.on("redo", (data) => {
            if (data.userId !== socketRef.current.id) {
                setRedoHistory((prevRedo) => {
                    const strokeIndex = prevRedo.findIndex(
                        (stroke) => stroke.userId === data.userId && stroke.id === data.stroke.id
                    );
                    if (strokeIndex !== -1) {
                        const newRedoHistory = [...prevRedo];
                        const [redoneStroke] = newRedoHistory.splice(strokeIndex, 1);
                        setHistory((prevHistory) => {
                            // Avoid duplicates in history
                            if (prevHistory.some((s) => s.id === redoneStroke.id)) {
                                return prevHistory;
                            }
                            const newHistory = [...prevHistory, redoneStroke];
                            redrawCanvas(newHistory);
                            return newHistory;
                        });
                        return newRedoHistory;
                    }
                    return prevRedo;
                });
            }
        });

        // Cleanup on unmount
        return () => {
            socketRef.current.disconnect();
        };
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

    const redrawCanvas = (strokes) => {
        const canvas = canvasRef.current;
        const ctx = canvas.getContext("2d");
        ctx.clearRect(0, 0, canvas.width, canvas.height);
        strokes.forEach((stroke) => drawStroke(ctx, stroke));
    };

    const drawStroke = (ctx, stroke) => {
        ctx.save();
        ctx.strokeStyle = stroke.colour;
        ctx.lineWidth = stroke.width;
        ctx.globalAlpha = stroke.opacity;
        ctx.globalCompositeOperation = stroke.compositeOperation;
        ctx.beginPath();
        stroke.segments.forEach((segment, index) => {
            if (index === 0) {
                ctx.moveTo(segment.x0, segment.y0);
            }
            ctx.lineTo(segment.x1, segment.y1);
        });
        ctx.stroke();
        ctx.restore();
    };

    const undo = () => {
        if (history.length === 0) {
            return;
        }

        const lastStroke = history
            .slice()
            .reverse()
            .find((stroke) => stroke.userId === userId);

        if (!lastStroke) {
            return;
        }

        const newHistory = history.filter((stroke) => stroke !== lastStroke);
        setHistory(newHistory);
        setRedoHistory((prevRedo) => [...prevRedo, lastStroke]);
        redrawCanvas(newHistory);
        socketRef.current.emit("undo", { userId, stroke: lastStroke });
    };

    const redo = () => {
        if (redoHistory.length === 0) {
            return;
        }

        const lastStroke = redoHistory
            .slice()
            .reverse()
            .find((stroke) => stroke.userId === userId);

        if (!lastStroke) {
            return;
        }

        const newRedoHistory = redoHistory.filter((stroke) => stroke !== lastStroke);
        setRedoHistory(newRedoHistory);
        setHistory((prevHistory) => {
            if (prevHistory.some((s) => s.id === lastStroke.id)) {
                return prevHistory;
            }
            const newHistory = [...prevHistory, lastStroke];
            redrawCanvas(newHistory);
            socketRef.current.emit("redo", { userId, stroke: lastStroke });
            return newHistory;
        });
    };

    const clearCanvas = () => {
        if (window.confirm('Are you sure you want to clear canvas?')) {
            const canvas = canvasRef.current;
            const ctx = canvas.getContext("2d");
            ctx.clearRect(0, 0, canvas.width, canvas.height);
            setHistory([]); // Reset history with cleared state
            setRedoHistory([]);
            socketRef.current.emit("clearCanvas");
        }
        return;
    };

    const download = () => {
        const canvas = canvasRef.current;
        const backgroundColor = backgroundColour;

        const tempCanvas = document.createElement('canvas');
        tempCanvas.width = canvas.width;
        tempCanvas.height = canvas.height;
        const tempCtx = tempCanvas.getContext('2d');

        tempCtx.fillStyle = backgroundColor;
        tempCtx.fillRect(0, 0, tempCanvas.width, tempCanvas.height);

        tempCtx.drawImage(canvas, 0, 0);

        const dataUrl = tempCanvas.toDataURL('image/png');
        const link = document.createElement('a');
        link.download = 'Whiteboard.png';
        link.href = dataUrl;
        link.click();
    };

    const startDrawing = ({ nativeEvent }) => {
        if (nativeEvent.button !== 0) return;
        const { offsetX, offsetY } = nativeEvent;
        setIsDrawing(true);
        setLastPos({ x: offsetX, y: offsetY });
        const ctx = canvasRef.current.getContext("2d");
        ctx.beginPath();
        ctx.moveTo(offsetX, offsetY);
        setCurrentStroke([{ id: uuidv4() }]);
    };

    const stopDrawing = () => {
        if (isDrawing) {
            const canvas = canvasRef.current;
            const ctx = canvas.getContext("2d");
            ctx.stroke();
            ctx.closePath();
            if (currentStroke.length > 1) {
                const stroke = {
                    id: currentStroke[0].id,
                    segments: currentStroke,
                    colour: lineColour,
                    width: lineWidth,
                    opacity: opacity,
                    compositeOperation: compositeOperation,
                    userId: socketRef.current.id,
                };
                setHistory((prev) => {
                    if (prev.some((s) => s.id === stroke.id)) {
                        return prev;
                    }
                    return [...prev, stroke];
                });
                socketRef.current.emit("drawStroke", stroke);
            }
        }
        setIsDrawing(false);
        setCurrentStroke([]);
    };

    const draw = ({ nativeEvent }) => {
        if (!isDrawing || nativeEvent.button !== 0) return;
        const { offsetX, offsetY } = nativeEvent;
        const ctx = canvasRef.current.getContext("2d");
        ctx.lineTo(offsetX, offsetY);
        ctx.stroke();

        const segment = {
            x0: lastPos.x,
            y0: lastPos.y,
            x1: offsetX,
            y1: offsetY,
        };
        setCurrentStroke((prev) => [...prev, segment]);
        setLastPos({ x: offsetX, y: offsetY });
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
            if (event.ctrlKey && event.key === "z") {
                undo();
            }
            if (event.ctrlKey && event.shiftKey && event.key.toLowerCase() === "z") {
                redo();
            }
            if (event.ctrlKey && event.key === "Delete") {
                clearCanvas();
            }
            if (event.ctrlKey && event.altKey && event.key === "s") {
                download();
            }
            if (event.key.toLowerCase() === "d") {
                drawing();
                setActiveTool("draw");
            }
            if (event.key.toLowerCase() === "e") {
                eraser();
                setActiveTool("erase");
            }
        };

        window.addEventListener('keydown', handleKeydown);

        return () => {
            window.removeEventListener('keydown', handleKeydown);
        };
    }, [history, redoHistory, userId]);

    return (
        <div>
            <TopToolbar
                undo={undo}
                redo={redo}
                showToolbar={showToolbar}
                clearCanvas={clearCanvas}
                download={download}
                setShowToolbar={setShowToolbar}
            />
            {showToolbar && (
                <Toolbar
                    activeTool={activeTool}
                    setActiveTool={setActiveTool}
                    drawing={drawing}
                    eraser={eraser}
                    setColour={setLineColour}
                    setWidth={setLineWidth}
                    setBackgroundColour={setBackgroundColour}
                    opacity={opacity}
                    setOpacity={setOpacity}
                />
            )}
            <canvas
                ref={canvasRef}
                onMouseDown={startDrawing}
                onMouseUp={stopDrawing}
                onMouseMove={draw}
                style={{
                    backgroundColor: backgroundColour,
                    width: 1920,
                    height: 1080,
                    cursor: cursorStyle,
                }}
            />
        </div>
    );
}
