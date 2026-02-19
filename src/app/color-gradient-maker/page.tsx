"use client";

import { useState, useMemo } from "react";
import ToolLayout from "@/components/ToolLayout";

interface GradientStop { color: string; position: number; }

export default function ColorGradientMaker() {
    const [stops, setStops] = useState<GradientStop[]>([
        { color: "#667eea", position: 0 },
        { color: "#764ba2", position: 100 },
    ]);
    const [angle, setAngle] = useState(135);
    const [type, setType] = useState<"linear" | "radial" | "conic">("linear");
    const [copied, setCopied] = useState(false);

    const addStop = () => {
        const mid = Math.round((stops[stops.length - 2]?.position || 0 + (stops[stops.length - 1]?.position || 100)) / 2);
        setStops([...stops, { color: "#ffffff", position: mid }].sort((a, b) => a.position - b.position));
    };
    const removeStop = (i: number) => { if (stops.length <= 2) return; setStops(stops.filter((_, idx) => idx !== i)); };
    const updateStop = (i: number, field: keyof GradientStop, val: string | number) => { const s = [...stops]; s[i] = { ...s[i], [field]: val }; setStops(s); };

    const gradientCSS = useMemo(() => {
        const stopsStr = stops.map((s) => `${s.color} ${s.position}%`).join(", ");
        if (type === "linear") return `linear-gradient(${angle}deg, ${stopsStr})`;
        if (type === "radial") return `radial-gradient(circle, ${stopsStr})`;
        return `conic-gradient(from ${angle}deg, ${stopsStr})`;
    }, [stops, angle, type]);

    const cssCode = `background: ${gradientCSS};`;
    const handleCopy = () => { navigator.clipboard.writeText(cssCode); setCopied(true); setTimeout(() => setCopied(false), 1500); };

    const presets = [
        { name: "Sunset", stops: [{ color: "#f12711", position: 0 }, { color: "#f5af19", position: 100 }], angle: 135 },
        { name: "Ocean", stops: [{ color: "#2193b0", position: 0 }, { color: "#6dd5ed", position: 100 }], angle: 135 },
        { name: "Purple", stops: [{ color: "#667eea", position: 0 }, { color: "#764ba2", position: 100 }], angle: 135 },
        { name: "Forest", stops: [{ color: "#11998e", position: 0 }, { color: "#38ef7d", position: 100 }], angle: 135 },
        { name: "Peach", stops: [{ color: "#ffecd2", position: 0 }, { color: "#fcb69f", position: 100 }], angle: 135 },
        { name: "Neon", stops: [{ color: "#ff0099", position: 0 }, { color: "#493240", position: 50 }, { color: "#00d2ff", position: 100 }], angle: 90 },
        { name: "Midnight", stops: [{ color: "#232526", position: 0 }, { color: "#414345", position: 100 }], angle: 180 },
        { name: "Aurora", stops: [{ color: "#00c6ff", position: 0 }, { color: "#0072ff", position: 50 }, { color: "#7c3aed", position: 100 }], angle: 135 },
    ];

    return (
        <ToolLayout title="Color Gradient Maker" description="Create beautiful CSS gradients with a visual editor. Linear, radial, and conic gradients with live preview." relatedTools={["css-gradient-generator", "color-picker", "color-palette-generator"]}>
            <div className="mb-4 flex flex-wrap gap-2">
                {presets.map((p) => (
                    <button key={p.name} onClick={() => { setStops(p.stops); setAngle(p.angle); }} className="rounded-lg px-2 py-1 text-xs font-medium border border-gray-300 dark:border-gray-600 text-gray-700 dark:text-gray-300 hover:bg-gray-50 dark:hover:bg-gray-800 flex items-center gap-1.5">
                        <span className="inline-block h-3 w-3 rounded-full" style={{ background: `linear-gradient(90deg, ${p.stops.map(s => s.color).join(", ")})` }} />{p.name}
                    </button>
                ))}
            </div>

            <div className="grid gap-6 lg:grid-cols-2">
                <div>
                    <div className="rounded-xl shadow-lg" style={{ background: gradientCSS, height: 280 }} />
                    <div className="mt-4 flex items-center gap-3">
                        {(["linear", "radial", "conic"] as const).map((t) => (
                            <button key={t} onClick={() => setType(t)} className={`rounded-lg px-3 py-1.5 text-xs font-medium capitalize ${type === t ? "bg-blue-600 text-white" : "border border-gray-300 dark:border-gray-600 text-gray-700 dark:text-gray-300"}`}>{t}</button>
                        ))}
                        {type !== "radial" && (
                            <div className="flex items-center gap-2 ml-auto">
                                <label className="text-xs text-gray-600 dark:text-gray-400">Angle:</label>
                                <input type="range" min={0} max={360} value={angle} onChange={(e) => setAngle(Number(e.target.value))} className="w-24 accent-blue-600" />
                                <span className="text-xs font-mono text-gray-600 dark:text-gray-400 w-8">{angle}°</span>
                            </div>
                        )}
                    </div>
                </div>

                <div className="space-y-3">
                    <h3 className="text-sm font-bold text-gray-700 dark:text-gray-300">Color Stops</h3>
                    {stops.map((stop, i) => (
                        <div key={i} className="flex items-center gap-2">
                            <input type="color" value={stop.color} onChange={(e) => updateStop(i, "color", e.target.value)} className="h-8 w-8 cursor-pointer rounded border-0" />
                            <input value={stop.color} onChange={(e) => updateStop(i, "color", e.target.value)} className="w-20 rounded border border-gray-300 dark:border-gray-600 bg-white dark:bg-gray-900 px-2 py-1 text-xs font-mono" />
                            <input type="range" min={0} max={100} value={stop.position} onChange={(e) => updateStop(i, "position", Number(e.target.value))} className="flex-1 accent-blue-600" />
                            <span className="text-xs font-mono text-gray-500 w-8">{stop.position}%</span>
                            {stops.length > 2 && <button onClick={() => removeStop(i)} className="text-xs text-red-400 hover:text-red-600">×</button>}
                        </div>
                    ))}
                    <button onClick={addStop} className="w-full rounded-lg border border-dashed border-gray-300 dark:border-gray-600 py-1.5 text-xs text-gray-500 hover:bg-gray-50 dark:hover:bg-gray-800">+ Add Color Stop</button>

                    <div className="mt-4">
                        <div className="flex items-center justify-between mb-2"><h3 className="text-sm font-bold text-gray-700 dark:text-gray-300">CSS Code</h3><button onClick={handleCopy} className="rounded-md bg-blue-600 px-3 py-1 text-xs font-medium text-white hover:bg-blue-700">{copied ? "Copied!" : "Copy CSS"}</button></div>
                        <pre className="rounded-lg bg-gray-900 p-3 text-xs text-green-400 font-mono overflow-x-auto">{cssCode}</pre>
                    </div>
                </div>
            </div>

            <div className="mt-12 space-y-6 text-gray-600 dark:text-gray-400 text-sm leading-relaxed border-t border-gray-200 dark:border-gray-700 pt-8">
                <h2 className="text-xl font-bold text-gray-800 dark:text-gray-200">About This Tool</h2>
                <p>Create beautiful CSS gradients with a visual editor. Choose from linear, radial, or conic gradient types. Add multiple color stops, adjust positions and angles. Use presets for quick inspiration or build your own custom gradient.</p>
            </div>
        </ToolLayout>
    );
}
