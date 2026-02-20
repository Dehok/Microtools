"use client";

import { useState, useMemo } from "react";
import ToolLayout from "@/components/ToolLayout";

interface Service { name: string; image: string; ports: string; env: string; volumes: string; depends: string; }

export default function DockerComposeGenerator() {
    const [services, setServices] = useState<Service[]>([
        { name: "app", image: "node:20-alpine", ports: "3000:3000", env: "NODE_ENV=production", volumes: "./:/app", depends: "" },
        { name: "db", image: "postgres:16-alpine", ports: "5432:5432", env: "POSTGRES_PASSWORD=secret\nPOSTGRES_DB=myapp", volumes: "pgdata:/var/lib/postgresql/data", depends: "" },
    ]);
    const [version] = useState("3.8");
    const [copied, setCopied] = useState(false);

    const addService = () => setServices([...services, { name: "service" + (services.length + 1), image: "", ports: "", env: "", volumes: "", depends: "" }]);
    const removeService = (i: number) => setServices(services.filter((_, idx) => idx !== i));
    const update = (i: number, field: keyof Service, val: string) => { const s = [...services]; s[i] = { ...s[i], [field]: val }; setServices(s); };

    const presets: { label: string; service: Service }[] = [
        { label: "PostgreSQL", service: { name: "db", image: "postgres:16-alpine", ports: "5432:5432", env: "POSTGRES_PASSWORD=secret\nPOSTGRES_DB=myapp", volumes: "pgdata:/var/lib/postgresql/data", depends: "" } },
        { label: "MySQL", service: { name: "mysql", image: "mysql:8", ports: "3306:3306", env: "MYSQL_ROOT_PASSWORD=secret\nMYSQL_DATABASE=myapp", volumes: "mysqldata:/var/lib/mysql", depends: "" } },
        { label: "Redis", service: { name: "redis", image: "redis:7-alpine", ports: "6379:6379", env: "", volumes: "redisdata:/data", depends: "" } },
        { label: "MongoDB", service: { name: "mongo", image: "mongo:7", ports: "27017:27017", env: "MONGO_INITDB_ROOT_USERNAME=root\nMONGO_INITDB_ROOT_PASSWORD=secret", volumes: "mongodata:/data/db", depends: "" } },
        { label: "Nginx", service: { name: "nginx", image: "nginx:alpine", ports: "80:80", env: "", volumes: "./nginx.conf:/etc/nginx/nginx.conf", depends: "app" } },
    ];

    const yaml = useMemo(() => {
        const lines: string[] = [`version: '${version}'`, "", "services:"];
        const volumes = new Set<string>();

        for (const svc of services) {
            if (!svc.name) continue;
            lines.push(`  ${svc.name}:`);
            if (svc.image) lines.push(`    image: ${svc.image}`);
            if (svc.ports) {
                lines.push("    ports:");
                svc.ports.split("\n").filter(Boolean).forEach((p) => lines.push(`      - "${p.trim()}"`));
            }
            if (svc.env) {
                lines.push("    environment:");
                svc.env.split("\n").filter(Boolean).forEach((e) => lines.push(`      - ${e.trim()}`));
            }
            if (svc.volumes) {
                lines.push("    volumes:");
                svc.volumes.split("\n").filter(Boolean).forEach((v) => {
                    lines.push(`      - ${v.trim()}`);
                    const parts = v.trim().split(":");
                    if (parts[0] && !parts[0].startsWith(".") && !parts[0].startsWith("/")) volumes.add(parts[0]);
                });
            }
            if (svc.depends) {
                lines.push("    depends_on:");
                svc.depends.split(",").filter(Boolean).forEach((d) => lines.push(`      - ${d.trim()}`));
            }
            lines.push("");
        }

        if (volumes.size > 0) {
            lines.push("volumes:");
            volumes.forEach((v) => lines.push(`  ${v}:`));
        }

        return lines.join("\n");
    }, [services, version]);

    const handleCopy = () => { navigator.clipboard.writeText(yaml); setCopied(true); setTimeout(() => setCopied(false), 1500); };
    const handleDownload = () => { const blob = new Blob([yaml], { type: "text/yaml" }); const link = document.createElement("a"); link.download = "docker-compose.yml"; link.href = URL.createObjectURL(blob); link.click(); };

    return (
        <ToolLayout title="Docker Compose Generator" description="Generate docker-compose.yml files visually. Presets for PostgreSQL, MySQL, Redis, MongoDB, and Nginx." relatedTools={["dockerfile-generator", "github-actions-generator", "yaml-formatter"]}>
            <div className="mb-3 flex flex-wrap gap-2">
                <span className="text-xs text-gray-500 dark:text-gray-400 self-center mr-1">Add:</span>
                {presets.map((p) => (<button key={p.label} onClick={() => setServices([...services, p.service])} className="rounded-lg border border-gray-300 dark:border-gray-600 px-2.5 py-1 text-xs font-medium text-gray-700 dark:text-gray-300 hover:bg-gray-50 dark:hover:bg-gray-800">{p.label}</button>))}
                <button onClick={addService} className="rounded-lg border border-blue-300 dark:border-blue-700 px-2.5 py-1 text-xs font-medium text-blue-600 dark:text-blue-400 hover:bg-blue-50 dark:hover:bg-blue-950">+ Custom</button>
            </div>
            <div className="grid gap-6 lg:grid-cols-2">
                <div className="space-y-3">
                    {services.map((svc, i) => (
                        <div key={i} className="rounded-lg border border-gray-200 dark:border-gray-700 p-3 space-y-1 relative">
                            <button onClick={() => removeService(i)} className="absolute top-2 right-2 text-xs text-red-400 hover:text-red-600">×</button>
                            <div className="grid grid-cols-2 gap-1">
                                <div><label className="text-[10px] text-gray-500">Name</label><input value={svc.name} onChange={(e) => update(i, "name", e.target.value)} className="w-full rounded border border-gray-300 dark:border-gray-600 bg-white dark:bg-gray-900 px-2 py-1 text-xs font-mono" /></div>
                                <div><label className="text-[10px] text-gray-500">Image</label><input value={svc.image} onChange={(e) => update(i, "image", e.target.value)} className="w-full rounded border border-gray-300 dark:border-gray-600 bg-white dark:bg-gray-900 px-2 py-1 text-xs font-mono" /></div>
                            </div>
                            <div className="grid grid-cols-2 gap-1">
                                <div><label className="text-[10px] text-gray-500">Ports</label><input value={svc.ports} onChange={(e) => update(i, "ports", e.target.value)} placeholder="8080:80" className="w-full rounded border border-gray-300 dark:border-gray-600 bg-white dark:bg-gray-900 px-2 py-1 text-xs font-mono" /></div>
                                <div><label className="text-[10px] text-gray-500">Depends On</label><input value={svc.depends} onChange={(e) => update(i, "depends", e.target.value)} placeholder="db,redis" className="w-full rounded border border-gray-300 dark:border-gray-600 bg-white dark:bg-gray-900 px-2 py-1 text-xs font-mono" /></div>
                            </div>
                            <div><label className="text-[10px] text-gray-500">Environment</label><textarea value={svc.env} onChange={(e) => update(i, "env", e.target.value)} rows={2} className="w-full rounded border border-gray-300 dark:border-gray-600 bg-white dark:bg-gray-900 px-2 py-1 text-xs font-mono" /></div>
                            <div><label className="text-[10px] text-gray-500">Volumes</label><input value={svc.volumes} onChange={(e) => update(i, "volumes", e.target.value)} className="w-full rounded border border-gray-300 dark:border-gray-600 bg-white dark:bg-gray-900 px-2 py-1 text-xs font-mono" /></div>
                        </div>
                    ))}
                </div>
                <div>
                    <div className="flex items-center justify-between mb-2"><h3 className="text-sm font-bold text-gray-700 dark:text-gray-300 uppercase tracking-wider">docker-compose.yml</h3><div className="flex gap-2"><button onClick={handleCopy} className="rounded-md bg-blue-600 px-3 py-1 text-xs font-medium text-white hover:bg-blue-700">{copied ? "Copied!" : "Copy"}</button><button onClick={handleDownload} className="rounded-md border border-gray-300 dark:border-gray-600 px-3 py-1 text-xs font-medium text-gray-600 dark:text-gray-400 hover:bg-gray-100 dark:hover:bg-gray-800">Download</button></div></div>
                    <pre className="rounded-lg bg-gray-900 p-4 text-sm text-green-400 font-mono overflow-x-auto whitespace-pre-wrap" style={{ minHeight: 300 }}>{yaml}</pre>
                </div>
            </div>

            <div className="mt-12 space-y-6 text-gray-600 dark:text-gray-400 text-sm leading-relaxed border-t border-gray-200 dark:border-gray-700 pt-8">
                <h2 className="text-xl font-bold text-gray-800 dark:text-gray-200">About This Tool</h2>
                <p>Generate Docker Compose files with a visual editor. Use presets for popular services like PostgreSQL, MySQL, Redis, MongoDB, and Nginx, or create custom services. Automatic volume detection and depends_on configuration.</p>
            </div>
        </ToolLayout>
    );
}
