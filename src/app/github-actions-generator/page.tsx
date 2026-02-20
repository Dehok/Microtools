"use client";

import { useState, useMemo } from "react";
import ToolLayout from "@/components/ToolLayout";

export default function GithubActionsGenerator() {
    const [name, setName] = useState("CI/CD Pipeline");
    const [trigger, setTrigger] = useState<"push" | "pr" | "schedule" | "manual">("push");
    const [branches, setBranches] = useState("main");
    const [nodeVersion, setNodeVersion] = useState("20");
    const [steps, setSteps] = useState({
        checkout: true, setup: true, install: true, lint: false,
        test: false, build: true, deploy: false, docker: false,
    });
    const [packageManager, setPackageManager] = useState<"npm" | "yarn" | "pnpm">("npm");
    const [deployTarget, setDeployTarget] = useState<"vercel" | "netlify" | "s3" | "custom">("vercel");
    const [schedule, setSchedule] = useState("0 0 * * *");
    const [copied, setCopied] = useState(false);

    const installCmd = packageManager === "npm" ? "npm ci" : packageManager === "yarn" ? "yarn install --frozen-lockfile" : "pnpm install --frozen-lockfile";
    const buildCmd = packageManager === "npm" ? "npm run build" : `${packageManager} build`;
    const lintCmd = packageManager === "npm" ? "npm run lint" : `${packageManager} lint`;
    const testCmd = packageManager === "npm" ? "npm test" : `${packageManager} test`;

    const yaml = useMemo(() => {
        const lines: string[] = [];
        lines.push(`name: ${name}`, "");
        lines.push("on:");
        if (trigger === "push") { lines.push("  push:", `    branches: [${branches}]`); }
        else if (trigger === "pr") { lines.push("  pull_request:", `    branches: [${branches}]`); }
        else if (trigger === "schedule") { lines.push("  schedule:", `    - cron: '${schedule}'`); }
        else { lines.push("  workflow_dispatch:"); }
        lines.push("", "jobs:", "  build:", "    runs-on: ubuntu-latest", "    steps:");

        if (steps.checkout) lines.push("      - uses: actions/checkout@v4");
        if (steps.setup) lines.push("      - uses: actions/setup-node@v4", "        with:", `          node-version: '${nodeVersion}'`);
        if (steps.install) lines.push(`      - run: ${installCmd}`);
        if (steps.lint) lines.push(`      - run: ${lintCmd}`);
        if (steps.test) lines.push(`      - run: ${testCmd}`);
        if (steps.build) lines.push(`      - run: ${buildCmd}`);

        if (steps.deploy) {
            lines.push("");
            if (deployTarget === "vercel") {
                lines.push("      - uses: amondnet/vercel-action@v25", "        with:", "          vercel-token: ${{ secrets.VERCEL_TOKEN }}", "          vercel-org-id: ${{ secrets.VERCEL_ORG_ID }}", "          vercel-project-id: ${{ secrets.VERCEL_PROJECT_ID }}");
            } else if (deployTarget === "netlify") {
                lines.push("      - uses: nwtgck/actions-netlify@v3", "        with:", "          publish-dir: './dist'", "          production-deploy: true", "        env:", "          NETLIFY_AUTH_TOKEN: ${{ secrets.NETLIFY_AUTH_TOKEN }}", "          NETLIFY_SITE_ID: ${{ secrets.NETLIFY_SITE_ID }}");
            } else if (deployTarget === "s3") {
                lines.push("      - uses: aws-actions/configure-aws-credentials@v4", "        with:", "          aws-access-key-id: ${{ secrets.AWS_ACCESS_KEY_ID }}", "          aws-secret-access-key: ${{ secrets.AWS_SECRET_ACCESS_KEY }}", "          aws-region: us-east-1", "      - run: aws s3 sync ./dist s3://${{ secrets.S3_BUCKET }}");
            }
        }

        if (steps.docker) {
            lines.push("", "      - uses: docker/login-action@v3", "        with:", "          username: ${{ secrets.DOCKER_USERNAME }}", "          password: ${{ secrets.DOCKER_PASSWORD }}", "      - uses: docker/build-push-action@v5", "        with:", "          push: true", "          tags: ${{ secrets.DOCKER_USERNAME }}/app:latest");
        }

        return lines.join("\n");
    }, [name, trigger, branches, nodeVersion, steps, deployTarget, schedule, installCmd, buildCmd, lintCmd, testCmd]);

    const handleCopy = () => { navigator.clipboard.writeText(yaml); setCopied(true); setTimeout(() => setCopied(false), 1500); };
    const handleDownload = () => { const blob = new Blob([yaml], { type: "text/yaml" }); const link = document.createElement("a"); link.download = "ci.yml"; link.href = URL.createObjectURL(blob); link.click(); };

    return (
        <ToolLayout title="GitHub Actions Generator" description="Generate GitHub Actions CI/CD workflows visually. Deploy to Vercel, Netlify, S3, or Docker." relatedTools={["dockerfile-generator", "yaml-formatter", "json-formatter"]}>
            <div className="grid gap-6 lg:grid-cols-2">
                <div className="space-y-3">
                    <div><label className="mb-1 block text-xs font-medium text-gray-600 dark:text-gray-400">Workflow Name</label><input value={name} onChange={(e) => setName(e.target.value)} className="w-full rounded-lg border border-gray-300 dark:border-gray-600 bg-white dark:bg-gray-900 px-3 py-2 text-sm" /></div>
                    <div><label className="mb-1 block text-xs font-medium text-gray-600 dark:text-gray-400">Trigger</label>
                        <div className="flex gap-2">{(["push", "pr", "schedule", "manual"] as const).map((t) => (<button key={t} onClick={() => setTrigger(t)} className={`rounded-lg px-3 py-1.5 text-xs font-medium ${trigger === t ? "bg-blue-600 text-white" : "border border-gray-300 dark:border-gray-600 text-gray-700 dark:text-gray-300"}`}>{t === "pr" ? "Pull Request" : t.charAt(0).toUpperCase() + t.slice(1)}</button>))}</div>
                    </div>
                    {(trigger === "push" || trigger === "pr") && <div><label className="mb-1 block text-xs font-medium text-gray-600 dark:text-gray-400">Branches</label><input value={branches} onChange={(e) => setBranches(e.target.value)} className="w-full rounded-lg border border-gray-300 dark:border-gray-600 bg-white dark:bg-gray-900 px-3 py-2 text-sm" /></div>}
                    {trigger === "schedule" && <div><label className="mb-1 block text-xs font-medium text-gray-600 dark:text-gray-400">Cron Schedule</label><input value={schedule} onChange={(e) => setSchedule(e.target.value)} className="w-full rounded-lg border border-gray-300 dark:border-gray-600 bg-white dark:bg-gray-900 px-3 py-2 text-sm font-mono" /></div>}
                    <div className="grid grid-cols-2 gap-2">
                        <div><label className="mb-1 block text-xs font-medium text-gray-600 dark:text-gray-400">Node Version</label><input value={nodeVersion} onChange={(e) => setNodeVersion(e.target.value)} className="w-full rounded-lg border border-gray-300 dark:border-gray-600 bg-white dark:bg-gray-900 px-3 py-2 text-sm" /></div>
                        <div><label className="mb-1 block text-xs font-medium text-gray-600 dark:text-gray-400">Package Manager</label>
                            <select value={packageManager} onChange={(e) => setPackageManager(e.target.value as "npm" | "yarn" | "pnpm")} className="w-full rounded-lg border border-gray-300 dark:border-gray-600 bg-white dark:bg-gray-900 px-3 py-2 text-sm"><option value="npm">npm</option><option value="yarn">yarn</option><option value="pnpm">pnpm</option></select>
                        </div>
                    </div>
                    <div><label className="mb-1 block text-xs font-medium text-gray-600 dark:text-gray-400">Steps</label>
                        <div className="grid grid-cols-2 gap-1">{Object.entries(steps).map(([key, val]) => (<label key={key} className="flex items-center gap-1.5 text-xs text-gray-700 dark:text-gray-300"><input type="checkbox" checked={val} onChange={(e) => setSteps({ ...steps, [key]: e.target.checked })} className="accent-blue-600" />{key.charAt(0).toUpperCase() + key.slice(1)}</label>))}</div>
                    </div>
                    {steps.deploy && <div><label className="mb-1 block text-xs font-medium text-gray-600 dark:text-gray-400">Deploy Target</label>
                        <select value={deployTarget} onChange={(e) => setDeployTarget(e.target.value as typeof deployTarget)} className="w-full rounded-lg border border-gray-300 dark:border-gray-600 bg-white dark:bg-gray-900 px-3 py-2 text-sm"><option value="vercel">Vercel</option><option value="netlify">Netlify</option><option value="s3">AWS S3</option><option value="custom">Custom</option></select>
                    </div>}
                </div>
                <div>
                    <div className="flex items-center justify-between mb-2"><h3 className="text-sm font-bold text-gray-700 dark:text-gray-300 uppercase tracking-wider">.github/workflows/ci.yml</h3><div className="flex gap-2"><button onClick={handleCopy} className="rounded-md bg-blue-600 px-3 py-1 text-xs font-medium text-white hover:bg-blue-700">{copied ? "Copied!" : "Copy"}</button><button onClick={handleDownload} className="rounded-md border border-gray-300 dark:border-gray-600 px-3 py-1 text-xs font-medium text-gray-600 dark:text-gray-400 hover:bg-gray-100 dark:hover:bg-gray-800">Download</button></div></div>
                    <pre className="rounded-lg bg-gray-900 p-4 text-sm text-green-400 font-mono overflow-x-auto whitespace-pre-wrap" style={{ minHeight: 300 }}>{yaml}</pre>
                </div>
            </div>

            <div className="mt-12 space-y-6 text-gray-600 dark:text-gray-400 text-sm leading-relaxed border-t border-gray-200 dark:border-gray-700 pt-8">
                <h2 className="text-xl font-bold text-gray-800 dark:text-gray-200">About This Tool</h2>
                <p>Generate GitHub Actions CI/CD workflows with a visual builder. Configure triggers, Node.js versions, package managers, and deployment targets. Export as YAML ready to use in your repository.</p>
            </div>
        </ToolLayout>
    );
}
