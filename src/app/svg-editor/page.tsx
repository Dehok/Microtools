"use client";

import { useState, useRef, useEffect, useCallback } from "react";
import ToolLayout from "@/components/ToolLayout";

interface SvgElement { id: string; type: "rect" | "circle" | "ellipse" | "line" | "text"; x: number; y: number; w: number; h: number; fill: string; stroke: string; strokeWidth: number; text?: string; }

let nextId = 1;

export default function SvgEditor() {
    const [elements, setElements] = useState<SvgElement[]>([
        { id: "el-1", type: "rect", x: 50, y: 50, w: 200, h: 120, fill: "#4f46e5", stroke: "#312e81", strokeWidth: 2 },
        { id: "el-2", type: "circle", x: 350, y: 150, w: 80, h: 80, fill: "#f59e0b", stroke: "#92400e", strokeWidth: 2 },
    ]);
    const [selected, setSelected] = useState<string | null>(null);
    const [tool, setTool] = useState<"select" | "rect" | "circle" | "ellipse" | "line" | "text">("select");
    const [canvasSize, setCanvasSize] = useState({ w: 600, h: 400 });
    const [copied, setCopied] = useState(false);
    const svgRef = useRef<SVGSVGElement>(null);
    const dragging = useRef<{ id: string; ox: number; oy: number } | null>(null);
    nextId = elements.length + 2;

    const selectedEl = elements.find((e) => e.id === selected);

    const addElement = (type: SvgElement["type"]) => {
        const id = `el-${nextId++}`;
        const newEl: SvgElement = { id, type, x: 100 + Math.random() * 200, y: 80 + Math.random() * 150, w: type === "line" ? 150 : 80, h: type === "line" ? 0 : 60, fill: type === "line" ? "none" : "#6366f1", stroke: "#312e81", strokeWidth: 2, text: type === "text" ? "Hello" : undefined };
        setElements([...elements, newEl]);
        setSelected(id);
        setTool("select");
    };

    const updateEl = (id: string, updates: Partial<SvgElement>) => setElements(elements.map((e) => (e.id === id ? { ...e, ...updates } : e)));
    const deleteEl = (id: string) => { setElements(elements.filter((e) => e.id !== id)); setSelected(null); };

    const handleMouseDown = useCallback((e: React.MouseEvent, id: string) => {
        if (tool !== "select") return;
        e.stopPropagation();
        setSelected(id);
        const svg = svgRef.current!;
        const rect = svg.getBoundingClientRect();
        const el = elements.find((el) => el.id === id)!;
        dragging.current = { id, ox: e.clientX - rect.left - el.x, oy: e.clientY - rect.top - el.y };
    }, [tool, elements]);

    const handleCanvasMouseDown = (e: React.MouseEvent) => {
        if (tool === "select") { setSelected(null); return; }
        addElement(tool);
    };

    useEffect(() => {
        const handleMove = (e: MouseEvent) => {
            if (!dragging.current || !svgRef.current) return;
            const rect = svgRef.current.getBoundingClientRect();
            const x = e.clientX - rect.left - dragging.current.ox;
            const y = e.clientY - rect.top - dragging.current.oy;
            updateEl(dragging.current.id, { x: Math.max(0, x), y: Math.max(0, y) });
        };
        const handleUp = () => { dragging.current = null; };
        window.addEventListener("mousemove", handleMove);
        window.addEventListener("mouseup", handleUp);
        return () => { window.removeEventListener("mousemove", handleMove); window.removeEventListener("mouseup", handleUp); };
    });

    const generateSvg = () => {
        const lines: string[] = [`<svg xmlns="http://www.w3.org/2000/svg" width="${canvasSize.w}" height="${canvasSize.h}" viewBox="0 0 ${canvasSize.w} ${canvasSize.h}">`];
        for (const el of elements) {
            const common = `fill="${el.fill}" stroke="${el.stroke}" stroke-width="${el.strokeWidth}"`;
            if (el.type === "rect") lines.push(`  <rect x="${el.x}" y="${el.y}" width="${el.w}" height="${el.h}" ${common} />`);
            else if (el.type === "circle") lines.push(`  <circle cx="${el.x + el.w / 2}" cy="${el.y + el.h / 2}" r="${el.w / 2}" ${common} />`);
            else if (el.type === "ellipse") lines.push(`  <ellipse cx="${el.x + el.w / 2}" cy="${el.y + el.h / 2}" rx="${el.w / 2}" ry="${el.h / 2}" ${common} />`);
            else if (el.type === "line") lines.push(`  <line x1="${el.x}" y1="${el.y}" x2="${el.x + el.w}" y2="${el.y + el.h}" stroke="${el.stroke}" stroke-width="${el.strokeWidth}" />`);
            else if (el.type === "text") lines.push(`  <text x="${el.x}" y="${el.y + 20}" font-size="20" ${common}>${el.text || ""}</text>`);
        }
        lines.push("</svg>");
        return lines.join("\n");
    };

    const svgCode = generateSvg();
    const handleCopy = () => { navigator.clipboard.writeText(svgCode); setCopied(true); setTimeout(() => setCopied(false), 1500); };
    const handleDownload = () => { const blob = new Blob([svgCode], { type: "image/svg+xml" }); const link = document.createElement("a"); link.download = "drawing.svg"; link.href = URL.createObjectURL(blob); link.click(); };

    return (
        <ToolLayout title="SVG Editor" description="Create and edit SVG graphics visually. Add shapes, colors, text. Export clean SVG code." relatedTools={["favicon-generator", "color-picker", "css-animation-generator"]}>
            <div className="mb-3 flex flex-wrap gap-2 items-center">
                {(["select", "rect", "circle", "ellipse", "line", "text"] as const).map((t) => (
                    <button key={t} onClick={() => t === "select" ? setTool("select") : addElement(t)} className={`rounded-lg px-3 py-1.5 text-xs font-medium capitalize ${tool === t && t === "select" ? "bg-blue-600 text-white" : "border border-gray-300 dark:border-gray-600 text-gray-700 dark:text-gray-300 hover:bg-gray-50 dark:hover:bg-gray-800"}`}>
                        {t === "select" ? "↖ Select" : t === "rect" ? "▭ Rect" : t === "circle" ? "● Circle" : t === "ellipse" ? "⬭ Ellipse" : t === "line" ? "╱ Line" : "T Text"}
                    </button>
                ))}
            </div>

            <div className="grid gap-4 lg:grid-cols-3">
                <div className="lg:col-span-2">
                    <div className="rounded-lg border border-gray-200 dark:border-gray-700 overflow-hidden bg-white dark:bg-gray-950" style={{ background: "repeating-conic-gradient(#f3f4f6 0% 25%, white 0% 50%) 0 0 / 20px 20px" }}>
                        <svg ref={svgRef} width={canvasSize.w} height={canvasSize.h} className="w-full" viewBox={`0 0 ${canvasSize.w} ${canvasSize.h}`} onMouseDown={handleCanvasMouseDown} style={{ cursor: tool === "select" ? "default" : "crosshair" }}>
                            {elements.map((el) => {
                                const isSelected = el.id === selected;
                                const outline = isSelected ? { strokeDasharray: "4", stroke: "#3b82f6", strokeWidth: 1, fill: "none" } : {};
                                return (
                                    <g key={el.id} onMouseDown={(e) => handleMouseDown(e, el.id)} style={{ cursor: "move" }}>
                                        {el.type === "rect" && <><rect x={el.x} y={el.y} width={el.w} height={el.h} fill={el.fill} stroke={el.stroke} strokeWidth={el.strokeWidth} />{isSelected && <rect x={el.x - 2} y={el.y - 2} width={el.w + 4} height={el.h + 4} {...outline} />}</>}
                                        {el.type === "circle" && <><circle cx={el.x + el.w / 2} cy={el.y + el.h / 2} r={el.w / 2} fill={el.fill} stroke={el.stroke} strokeWidth={el.strokeWidth} />{isSelected && <circle cx={el.x + el.w / 2} cy={el.y + el.h / 2} r={el.w / 2 + 3} {...outline} />}</>}
                                        {el.type === "ellipse" && <><ellipse cx={el.x + el.w / 2} cy={el.y + el.h / 2} rx={el.w / 2} ry={el.h / 2} fill={el.fill} stroke={el.stroke} strokeWidth={el.strokeWidth} />{isSelected && <ellipse cx={el.x + el.w / 2} cy={el.y + el.h / 2} rx={el.w / 2 + 3} ry={el.h / 2 + 3} {...outline} />}</>}
                                        {el.type === "line" && <><line x1={el.x} y1={el.y} x2={el.x + el.w} y2={el.y + el.h} stroke={el.stroke} strokeWidth={el.strokeWidth} />{isSelected && <line x1={el.x} y1={el.y} x2={el.x + el.w} y2={el.y + el.h} stroke="#3b82f6" strokeWidth={1} strokeDasharray="4" />}</>}
                                        {el.type === "text" && <><text x={el.x} y={el.y + 20} fontSize={20} fill={el.fill} stroke={el.stroke} strokeWidth={el.strokeWidth}>{el.text}</text>{isSelected && <rect x={el.x - 2} y={el.y - 2} width={100} height={28} {...outline} />}</>}
                                    </g>
                                );
                            })}
                        </svg>
                    </div>
                </div>

                <div className="space-y-3">
                    {selectedEl ? (
                        <div className="rounded-lg border border-gray-200 dark:border-gray-700 p-3 space-y-2">
                            <div className="flex items-center justify-between"><h3 className="text-xs font-bold text-gray-700 dark:text-gray-300 capitalize">{selectedEl.type}</h3><button onClick={() => deleteEl(selectedEl.id)} className="text-xs text-red-400 hover:text-red-600">Delete</button></div>
                            <div className="grid grid-cols-2 gap-1">
                                <div><label className="text-[10px] text-gray-500">X</label><input type="number" value={Math.round(selectedEl.x)} onChange={(e) => updateEl(selectedEl.id, { x: +e.target.value })} className="w-full rounded border border-gray-300 dark:border-gray-600 bg-white dark:bg-gray-900 px-1 py-0.5 text-xs" /></div>
                                <div><label className="text-[10px] text-gray-500">Y</label><input type="number" value={Math.round(selectedEl.y)} onChange={(e) => updateEl(selectedEl.id, { y: +e.target.value })} className="w-full rounded border border-gray-300 dark:border-gray-600 bg-white dark:bg-gray-900 px-1 py-0.5 text-xs" /></div>
                                <div><label className="text-[10px] text-gray-500">W</label><input type="number" value={Math.round(selectedEl.w)} onChange={(e) => updateEl(selectedEl.id, { w: +e.target.value })} className="w-full rounded border border-gray-300 dark:border-gray-600 bg-white dark:bg-gray-900 px-1 py-0.5 text-xs" /></div>
                                <div><label className="text-[10px] text-gray-500">H</label><input type="number" value={Math.round(selectedEl.h)} onChange={(e) => updateEl(selectedEl.id, { h: +e.target.value })} className="w-full rounded border border-gray-300 dark:border-gray-600 bg-white dark:bg-gray-900 px-1 py-0.5 text-xs" /></div>
                            </div>
                            <div className="flex gap-2 items-center"><label className="text-[10px] text-gray-500">Fill</label><input type="color" value={selectedEl.fill === "none" ? "#000000" : selectedEl.fill} onChange={(e) => updateEl(selectedEl.id, { fill: e.target.value })} className="h-6 w-6 rounded border-0 cursor-pointer" /><input value={selectedEl.fill} onChange={(e) => updateEl(selectedEl.id, { fill: e.target.value })} className="flex-1 rounded border border-gray-300 dark:border-gray-600 bg-white dark:bg-gray-900 px-1 py-0.5 text-xs font-mono" /></div>
                            <div className="flex gap-2 items-center"><label className="text-[10px] text-gray-500">Stroke</label><input type="color" value={selectedEl.stroke} onChange={(e) => updateEl(selectedEl.id, { stroke: e.target.value })} className="h-6 w-6 rounded border-0 cursor-pointer" /><input type="number" value={selectedEl.strokeWidth} onChange={(e) => updateEl(selectedEl.id, { strokeWidth: +e.target.value })} className="w-12 rounded border border-gray-300 dark:border-gray-600 bg-white dark:bg-gray-900 px-1 py-0.5 text-xs" /></div>
                            {selectedEl.type === "text" && <div><label className="text-[10px] text-gray-500">Text</label><input value={selectedEl.text || ""} onChange={(e) => updateEl(selectedEl.id, { text: e.target.value })} className="w-full rounded border border-gray-300 dark:border-gray-600 bg-white dark:bg-gray-900 px-2 py-1 text-xs" /></div>}
                        </div>
                    ) : <p className="text-xs text-gray-400 text-center py-4">Select an element or add one</p>}

                    <div className="flex gap-2"><button onClick={handleCopy} className="flex-1 rounded-lg bg-blue-600 px-3 py-1.5 text-xs font-medium text-white hover:bg-blue-700">{copied ? "Copied!" : "Copy SVG"}</button><button onClick={handleDownload} className="flex-1 rounded-lg border border-gray-300 dark:border-gray-600 px-3 py-1.5 text-xs text-gray-600 dark:text-gray-400 hover:bg-gray-100 dark:hover:bg-gray-800">Download</button></div>

                    <details className="rounded-lg border border-gray-200 dark:border-gray-700"><summary className="px-3 py-2 text-xs font-bold text-gray-700 dark:text-gray-300 cursor-pointer">Canvas Size</summary><div className="px-3 pb-2 flex gap-2"><input type="number" value={canvasSize.w} onChange={(e) => setCanvasSize({ ...canvasSize, w: +e.target.value })} className="w-20 rounded border border-gray-300 dark:border-gray-600 bg-white dark:bg-gray-900 px-1 py-0.5 text-xs" /><span className="text-xs text-gray-400 self-center">×</span><input type="number" value={canvasSize.h} onChange={(e) => setCanvasSize({ ...canvasSize, h: +e.target.value })} className="w-20 rounded border border-gray-300 dark:border-gray-600 bg-white dark:bg-gray-900 px-1 py-0.5 text-xs" /></div></details>
                </div>
            </div>

            <div className="mt-12 space-y-6 text-gray-600 dark:text-gray-400 text-sm leading-relaxed border-t border-gray-200 dark:border-gray-700 pt-8">
                <h2 className="text-xl font-bold text-gray-800 dark:text-gray-200">About This Tool</h2>
                <p>Create SVG graphics with a visual editor. Add rectangles, circles, ellipses, lines, and text. Customize fill color, stroke, and position. Drag elements to reposition. Export clean SVG code or download as an SVG file.</p>
            </div>
        </ToolLayout>
    );
}
