"use client";

import { useState, useMemo } from "react";
import ToolLayout from "@/components/ToolLayout";

export default function DockerfileGenerator() {
    const [baseImage, setBaseImage] = useState("node:20-alpine");
    const [workdir, setWorkdir] = useState("/app");
    const [copyFiles, setCopyFiles] = useState("package*.json");
    const [installCmd, setInstallCmd] = useState("npm ci --only=production");
    const [copyAll, setCopyAll] = useState(true);
    const [buildCmd, setBuildCmd] = useState("npm run build");
    const [hasBuild, setHasBuild] = useState(true);
    const [exposePort, setExposePort] = useState("3000");
    const [startCmd, setStartCmd] = useState('["node", "server.js"]');
    const [envVars, setEnvVars] = useState("NODE_ENV=production");
    const [multiStage, setMultiStage] = useState(false);
    const [copied, setCopied] = useState(false);

    const dockerfile = useMemo(() => {
        let lines: string[] = [];

        if (multiStage) {
            lines.push(`# Build stage`);
            lines.push(`FROM ${baseImage} AS builder`);
        } else {
            lines.push(`FROM ${baseImage}`);
        }

        lines.push("", `WORKDIR ${workdir}`);

        if (copyFiles) {
            lines.push("", `# Install dependencies`);
            lines.push(`COPY ${copyFiles} ./`);
            if (installCmd) lines.push(`RUN ${installCmd}`);
        }

        if (copyAll) lines.push("", `# Copy source code`, `COPY . .`);
        if (hasBuild && buildCmd) lines.push("", `# Build`, `RUN ${buildCmd}`);

        if (multiStage) {
            lines.push("", `# Production stage`);
            lines.push(`FROM ${baseImage.split(":")[0]}:${baseImage.split(":")[1] || "latest"}`);
            lines.push(`WORKDIR ${workdir}`);
            lines.push(`COPY --from=builder ${workdir} .`);
        }

        envVars.split("\n").filter(Boolean).forEach((env) => {
            lines.push(`ENV ${env.trim()}`);
        });

        if (exposePort) lines.push("", `EXPOSE ${exposePort}`);
        if (startCmd) lines.push("", `CMD ${startCmd}`);

        return lines.join("\n");
    }, [baseImage, workdir, copyFiles, installCmd, copyAll, buildCmd, hasBuild, exposePort, startCmd, envVars, multiStage]);

    const handleCopy = () => {
        navigator.clipboard.writeText(dockerfile);
        setCopied(true);
        setTimeout(() => setCopied(false), 1500);
    };

    const handleDownload = () => {
        const blob = new Blob([dockerfile], { type: "text/plain" });
        const link = document.createElement("a");
        link.download = "Dockerfile";
        link.href = URL.createObjectURL(blob);
        link.click();
    };

    const presets = [
        { label: "Node.js", base: "node:20-alpine", copy: "package*.json", install: "npm ci --only=production", build: "npm run build", start: '["node", "server.js"]', port: "3000" },
        { label: "Python", base: "python:3.12-slim", copy: "requirements.txt", install: "pip install --no-cache-dir -r requirements.txt", build: "", start: '["python", "app.py"]', port: "8000" },
        { label: "Go", base: "golang:1.22-alpine", copy: "go.mod go.sum", install: "go mod download", build: "go build -o main .", start: '["./main"]', port: "8080" },
        { label: "Java", base: "eclipse-temurin:21-jdk-alpine", copy: "pom.xml", install: "mvn dependency:resolve", build: "mvn package -DskipTests", start: '["java", "-jar", "target/app.jar"]', port: "8080" },
    ];

    return (
        <ToolLayout
            title="Dockerfile Generator"
            description="Generate Dockerfiles with a visual builder. Presets for Node.js, Python, Go, Java. Copy or download instantly."
            relatedTools={["json-formatter", "yaml-formatter", "htaccess-generator"]}
        >
            <div className="mb-4 flex flex-wrap gap-2">
                {presets.map((p) => (
                    <button key={p.label} onClick={() => { setBaseImage(p.base); setCopyFiles(p.copy); setInstallCmd(p.install); setBuildCmd(p.build); setHasBuild(!!p.build); setStartCmd(p.start); setExposePort(p.port); }}
                        className="rounded-lg border border-gray-300 dark:border-gray-600 px-3 py-1.5 text-xs font-medium text-gray-700 dark:text-gray-300 hover:bg-gray-50 dark:hover:bg-gray-800">{p.label}</button>
                ))}
            </div>

            <div className="grid gap-6 lg:grid-cols-2">
                <div className="space-y-3">
                    <div><label className="mb-1 block text-xs font-medium text-gray-600 dark:text-gray-400">Base Image</label><input value={baseImage} onChange={(e) => setBaseImage(e.target.value)} className="w-full rounded-lg border border-gray-300 dark:border-gray-600 bg-white dark:bg-gray-900 px-3 py-2 text-sm font-mono focus:border-blue-500 focus:outline-none focus:ring-1 focus:ring-blue-500" /></div>
                    <div><label className="mb-1 block text-xs font-medium text-gray-600 dark:text-gray-400">Working Directory</label><input value={workdir} onChange={(e) => setWorkdir(e.target.value)} className="w-full rounded-lg border border-gray-300 dark:border-gray-600 bg-white dark:bg-gray-900 px-3 py-2 text-sm font-mono focus:border-blue-500 focus:outline-none focus:ring-1 focus:ring-blue-500" /></div>
                    <div><label className="mb-1 block text-xs font-medium text-gray-600 dark:text-gray-400">Copy (dependencies)</label><input value={copyFiles} onChange={(e) => setCopyFiles(e.target.value)} className="w-full rounded-lg border border-gray-300 dark:border-gray-600 bg-white dark:bg-gray-900 px-3 py-2 text-sm font-mono focus:border-blue-500 focus:outline-none focus:ring-1 focus:ring-blue-500" /></div>
                    <div><label className="mb-1 block text-xs font-medium text-gray-600 dark:text-gray-400">Install Command</label><input value={installCmd} onChange={(e) => setInstallCmd(e.target.value)} className="w-full rounded-lg border border-gray-300 dark:border-gray-600 bg-white dark:bg-gray-900 px-3 py-2 text-sm font-mono focus:border-blue-500 focus:outline-none focus:ring-1 focus:ring-blue-500" /></div>
                    <label className="flex items-center gap-2 text-sm text-gray-700 dark:text-gray-300"><input type="checkbox" checked={copyAll} onChange={(e) => setCopyAll(e.target.checked)} className="accent-blue-600" /> COPY . . (all source)</label>
                    <label className="flex items-center gap-2 text-sm text-gray-700 dark:text-gray-300"><input type="checkbox" checked={hasBuild} onChange={(e) => setHasBuild(e.target.checked)} className="accent-blue-600" /> Build step</label>
                    {hasBuild && <div><input value={buildCmd} onChange={(e) => setBuildCmd(e.target.value)} className="w-full rounded-lg border border-gray-300 dark:border-gray-600 bg-white dark:bg-gray-900 px-3 py-2 text-sm font-mono focus:border-blue-500 focus:outline-none focus:ring-1 focus:ring-blue-500" /></div>}
                    <div><label className="mb-1 block text-xs font-medium text-gray-600 dark:text-gray-400">Expose Port</label><input value={exposePort} onChange={(e) => setExposePort(e.target.value)} className="w-full rounded-lg border border-gray-300 dark:border-gray-600 bg-white dark:bg-gray-900 px-3 py-2 text-sm font-mono focus:border-blue-500 focus:outline-none focus:ring-1 focus:ring-blue-500" /></div>
                    <div><label className="mb-1 block text-xs font-medium text-gray-600 dark:text-gray-400">CMD</label><input value={startCmd} onChange={(e) => setStartCmd(e.target.value)} className="w-full rounded-lg border border-gray-300 dark:border-gray-600 bg-white dark:bg-gray-900 px-3 py-2 text-sm font-mono focus:border-blue-500 focus:outline-none focus:ring-1 focus:ring-blue-500" /></div>
                    <div><label className="mb-1 block text-xs font-medium text-gray-600 dark:text-gray-400">ENV</label><textarea value={envVars} onChange={(e) => setEnvVars(e.target.value)} rows={2} className="w-full rounded-lg border border-gray-300 dark:border-gray-600 bg-white dark:bg-gray-900 px-3 py-2 text-sm font-mono focus:border-blue-500 focus:outline-none focus:ring-1 focus:ring-blue-500" /></div>
                    <label className="flex items-center gap-2 text-sm text-gray-700 dark:text-gray-300"><input type="checkbox" checked={multiStage} onChange={(e) => setMultiStage(e.target.checked)} className="accent-blue-600" /> Multi-stage build</label>
                </div>

                <div>
                    <div className="flex items-center justify-between mb-2">
                        <h3 className="text-sm font-bold text-gray-700 dark:text-gray-300 uppercase tracking-wider">Dockerfile</h3>
                        <div className="flex gap-2">
                            <button onClick={handleCopy} className="rounded-md bg-blue-600 px-3 py-1 text-xs font-medium text-white hover:bg-blue-700">{copied ? "Copied!" : "Copy"}</button>
                            <button onClick={handleDownload} className="rounded-md border border-gray-300 dark:border-gray-600 px-3 py-1 text-xs font-medium text-gray-600 dark:text-gray-400 hover:bg-gray-100 dark:hover:bg-gray-800">Download</button>
                        </div>
                    </div>
                    <pre className="rounded-lg bg-gray-900 p-4 text-sm text-green-400 font-mono overflow-x-auto whitespace-pre-wrap" style={{ minHeight: 300 }}>{dockerfile}</pre>
                </div>
            </div>

            <div className="mt-12 space-y-6 text-gray-600 dark:text-gray-400 text-sm leading-relaxed border-t border-gray-200 dark:border-gray-700 pt-8">
                <h2 className="text-xl font-bold text-gray-800 dark:text-gray-200">About This Tool</h2>
                <p>Generate Dockerfiles quickly using a visual builder. Start with presets for Node.js, Python, Go, or Java and customize every field. Supports multi-stage builds and environment variables. Copy or download the result instantly.</p>
                <h2 className="text-lg font-bold text-gray-800 dark:text-gray-200">Frequently Asked Questions</h2>
                <div className="space-y-4">
                    <details className="group"><summary className="cursor-pointer font-medium text-gray-700 dark:text-gray-300 hover:text-blue-600 dark:hover:text-blue-400">Should I use multi-stage builds?</summary><p className="mt-2 pl-4">Multi-stage builds reduce the final image size by separating build dependencies from runtime. Recommended for compiled languages like Go and Java.</p></details>
                </div>
            </div>
        </ToolLayout>
    );
}
