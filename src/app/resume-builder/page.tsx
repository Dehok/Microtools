"use client";

import { useState } from "react";
import ToolLayout from "@/components/ToolLayout";

interface Education { school: string; degree: string; year: string; }
interface Experience { company: string; role: string; period: string; desc: string; }

export default function ResumeBuilder() {
    const [name, setName] = useState("John Doe");
    const [email, setEmail] = useState("john@example.com");
    const [phone, setPhone] = useState("+1 234 567 890");
    const [location, setLocation] = useState("New York, NY");
    const [summary, setSummary] = useState("Experienced software engineer with 5+ years building scalable web applications.");
    const [skills, setSkills] = useState("JavaScript, TypeScript, React, Node.js, Python, SQL, Git, Docker");
    const [education, setEducation] = useState<Education[]>([{ school: "MIT", degree: "B.S. Computer Science", year: "2018" }]);
    const [experience, setExperience] = useState<Experience[]>([
        { company: "Acme Corp", role: "Senior Software Engineer", period: "2021 – Present", desc: "Led frontend architecture migration to Next.js. Reduced bundle size by 40%." },
        { company: "StartupXYZ", role: "Software Engineer", period: "2018 – 2021", desc: "Built REST APIs and React dashboards serving 50K+ daily users." },
    ]);
    const [accentColor, setAccentColor] = useState("#2563eb");
    const [template, setTemplate] = useState<"classic" | "modern" | "minimal">("modern");

    const addEducation = () => setEducation([...education, { school: "", degree: "", year: "" }]);
    const addExperience = () => setExperience([...experience, { company: "", role: "", period: "", desc: "" }]);
    const removeEducation = (i: number) => setEducation(education.filter((_, idx) => idx !== i));
    const removeExperience = (i: number) => setExperience(experience.filter((_, idx) => idx !== i));
    const updateEdu = (i: number, field: keyof Education, val: string) => { const e = [...education]; e[i] = { ...e[i], [field]: val }; setEducation(e); };
    const updateExp = (i: number, field: keyof Experience, val: string) => { const e = [...experience]; e[i] = { ...e[i], [field]: val }; setExperience(e); };

    const downloadPDF = async () => {
        const { jsPDF } = await import("jspdf");
        const doc = new jsPDF({ unit: "mm", format: "a4" });
        const w = 210; let y = 20;
        const hexToRgb = (hex: string) => [parseInt(hex.slice(1, 3), 16), parseInt(hex.slice(3, 5), 16), parseInt(hex.slice(5, 7), 16)] as [number, number, number];
        const [r, g, b] = hexToRgb(accentColor);

        if (template === "modern") {
            doc.setFillColor(r, g, b); doc.rect(0, 0, w, 45, "F");
            doc.setTextColor(255, 255, 255);
            doc.setFontSize(24); doc.text(name, 15, 18);
            doc.setFontSize(10); doc.text([email, phone, location].filter(Boolean).join("  |  "), 15, 26);
            doc.setFontSize(9); doc.text(doc.splitTextToSize(summary, w - 30), 15, 34);
            y = 55;
        } else if (template === "minimal") {
            doc.setTextColor(40, 40, 40); doc.setFontSize(22); doc.text(name, 15, y); y += 7;
            doc.setFontSize(9); doc.setTextColor(100, 100, 100); doc.text([email, phone, location].filter(Boolean).join("  •  "), 15, y); y += 4;
            doc.setDrawColor(r, g, b); doc.setLineWidth(0.5); doc.line(15, y, w - 15, y); y += 6;
            doc.setTextColor(60, 60, 60); doc.setFontSize(9); doc.text(doc.splitTextToSize(summary, w - 30), 15, y); y += Math.ceil(summary.length / 90) * 4 + 4;
        } else {
            doc.setTextColor(40, 40, 40); doc.setFontSize(20); doc.text(name, w / 2, y, { align: "center" }); y += 7;
            doc.setFontSize(9); doc.setTextColor(100, 100, 100); doc.text([email, phone, location].filter(Boolean).join("  |  "), w / 2, y, { align: "center" }); y += 6;
            doc.setTextColor(60, 60, 60); doc.setFontSize(9); doc.text(doc.splitTextToSize(summary, w - 30), 15, y); y += Math.ceil(summary.length / 90) * 4 + 6;
        }

        const section = (title: string) => {
            doc.setFontSize(12); doc.setTextColor(r, g, b); doc.text(title.toUpperCase(), 15, y); y += 2;
            doc.setDrawColor(r, g, b); doc.setLineWidth(0.3); doc.line(15, y, w - 15, y); y += 5;
            doc.setTextColor(40, 40, 40);
        };

        section("Experience");
        for (const exp of experience) {
            if (y > 270) { doc.addPage(); y = 20; }
            doc.setFontSize(11); doc.text(exp.role, 15, y);
            doc.setFontSize(9); doc.setTextColor(100, 100, 100); doc.text(exp.period, w - 15, y, { align: "right" }); y += 4;
            doc.setTextColor(r, g, b); doc.text(exp.company, 15, y); y += 4;
            doc.setTextColor(60, 60, 60); doc.setFontSize(9);
            const lines = doc.splitTextToSize(exp.desc, w - 30);
            doc.text(lines, 15, y); y += lines.length * 4 + 4;
            doc.setTextColor(40, 40, 40);
        }

        section("Education");
        for (const edu of education) {
            if (y > 270) { doc.addPage(); y = 20; }
            doc.setFontSize(11); doc.text(edu.degree, 15, y);
            doc.setFontSize(9); doc.setTextColor(100, 100, 100); doc.text(edu.year, w - 15, y, { align: "right" }); y += 4;
            doc.setTextColor(r, g, b); doc.text(edu.school, 15, y); y += 6;
            doc.setTextColor(40, 40, 40);
        }

        section("Skills");
        doc.setFontSize(9); doc.setTextColor(60, 60, 60);
        doc.text(doc.splitTextToSize(skills, w - 30), 15, y);

        doc.save("resume.pdf");
    };

    return (
        <ToolLayout title="Resume Builder Online" description="Build a professional resume and download as PDF. Free, private — no signup required." relatedTools={["invoice-generator", "signature-generator", "terms-of-service-generator"]}>
            <div className="grid gap-6 lg:grid-cols-2">
                <div className="space-y-4">
                    <div className="flex gap-2 mb-2">
                        {(["classic", "modern", "minimal"] as const).map((t) => (
                            <button key={t} onClick={() => setTemplate(t)} className={`rounded-lg px-3 py-1.5 text-xs font-medium capitalize ${template === t ? "bg-blue-600 text-white" : "border border-gray-300 dark:border-gray-600 text-gray-700 dark:text-gray-300"}`}>{t}</button>
                        ))}
                        <input type="color" value={accentColor} onChange={(e) => setAccentColor(e.target.value)} className="h-7 w-7 cursor-pointer rounded border-0 ml-auto" />
                    </div>
                    <div className="grid grid-cols-2 gap-2">
                        <input value={name} onChange={(e) => setName(e.target.value)} placeholder="Full Name" className="rounded-lg border border-gray-300 dark:border-gray-600 bg-white dark:bg-gray-900 px-3 py-2 text-sm" />
                        <input value={email} onChange={(e) => setEmail(e.target.value)} placeholder="Email" className="rounded-lg border border-gray-300 dark:border-gray-600 bg-white dark:bg-gray-900 px-3 py-2 text-sm" />
                        <input value={phone} onChange={(e) => setPhone(e.target.value)} placeholder="Phone" className="rounded-lg border border-gray-300 dark:border-gray-600 bg-white dark:bg-gray-900 px-3 py-2 text-sm" />
                        <input value={location} onChange={(e) => setLocation(e.target.value)} placeholder="Location" className="rounded-lg border border-gray-300 dark:border-gray-600 bg-white dark:bg-gray-900 px-3 py-2 text-sm" />
                    </div>
                    <textarea value={summary} onChange={(e) => setSummary(e.target.value)} rows={2} placeholder="Professional summary..." className="w-full rounded-lg border border-gray-300 dark:border-gray-600 bg-white dark:bg-gray-900 px-3 py-2 text-sm" />

                    <div>
                        <div className="flex items-center justify-between mb-2"><h3 className="text-sm font-bold text-gray-700 dark:text-gray-300">Experience</h3><button onClick={addExperience} className="text-xs text-blue-600 hover:text-blue-800">+ Add</button></div>
                        {experience.map((exp, i) => (
                            <div key={i} className="mb-3 rounded-lg border border-gray-200 dark:border-gray-700 p-3 space-y-1 relative">
                                <button onClick={() => removeExperience(i)} className="absolute top-2 right-2 text-xs text-red-400 hover:text-red-600">×</button>
                                <div className="grid grid-cols-2 gap-1">
                                    <input value={exp.role} onChange={(e) => updateExp(i, "role", e.target.value)} placeholder="Role" className="rounded border border-gray-300 dark:border-gray-600 bg-white dark:bg-gray-900 px-2 py-1 text-xs" />
                                    <input value={exp.company} onChange={(e) => updateExp(i, "company", e.target.value)} placeholder="Company" className="rounded border border-gray-300 dark:border-gray-600 bg-white dark:bg-gray-900 px-2 py-1 text-xs" />
                                </div>
                                <input value={exp.period} onChange={(e) => updateExp(i, "period", e.target.value)} placeholder="Period" className="w-full rounded border border-gray-300 dark:border-gray-600 bg-white dark:bg-gray-900 px-2 py-1 text-xs" />
                                <textarea value={exp.desc} onChange={(e) => updateExp(i, "desc", e.target.value)} rows={2} placeholder="Description..." className="w-full rounded border border-gray-300 dark:border-gray-600 bg-white dark:bg-gray-900 px-2 py-1 text-xs" />
                            </div>
                        ))}
                    </div>

                    <div>
                        <div className="flex items-center justify-between mb-2"><h3 className="text-sm font-bold text-gray-700 dark:text-gray-300">Education</h3><button onClick={addEducation} className="text-xs text-blue-600 hover:text-blue-800">+ Add</button></div>
                        {education.map((edu, i) => (
                            <div key={i} className="mb-2 flex gap-1 items-center">
                                <input value={edu.school} onChange={(e) => updateEdu(i, "school", e.target.value)} placeholder="School" className="flex-1 rounded border border-gray-300 dark:border-gray-600 bg-white dark:bg-gray-900 px-2 py-1 text-xs" />
                                <input value={edu.degree} onChange={(e) => updateEdu(i, "degree", e.target.value)} placeholder="Degree" className="flex-1 rounded border border-gray-300 dark:border-gray-600 bg-white dark:bg-gray-900 px-2 py-1 text-xs" />
                                <input value={edu.year} onChange={(e) => updateEdu(i, "year", e.target.value)} placeholder="Year" className="w-16 rounded border border-gray-300 dark:border-gray-600 bg-white dark:bg-gray-900 px-2 py-1 text-xs" />
                                <button onClick={() => removeEducation(i)} className="text-xs text-red-400 hover:text-red-600">×</button>
                            </div>
                        ))}
                    </div>

                    <div><label className="mb-1 block text-sm font-bold text-gray-700 dark:text-gray-300">Skills</label><textarea value={skills} onChange={(e) => setSkills(e.target.value)} rows={2} placeholder="Comma-separated skills..." className="w-full rounded-lg border border-gray-300 dark:border-gray-600 bg-white dark:bg-gray-900 px-3 py-2 text-sm" /></div>

                    <button onClick={downloadPDF} className="w-full rounded-lg bg-blue-600 px-6 py-2.5 text-sm font-medium text-white hover:bg-blue-700">Download PDF</button>
                </div>

                <div className="rounded-lg border border-gray-200 dark:border-gray-700 bg-white p-6 text-gray-900 shadow-sm" style={{ minHeight: 500, fontSize: 11 }}>
                    {template === "modern" && <div className="rounded-t-lg px-4 py-3 -mx-6 -mt-6 mb-4" style={{ backgroundColor: accentColor }}><h2 className="text-xl font-bold text-white">{name}</h2><p className="text-xs text-white/80">{[email, phone, location].filter(Boolean).join(" | ")}</p></div>}
                    {template !== "modern" && <><h2 className={`text-xl font-bold ${template === "classic" ? "text-center" : ""}`} style={{ color: accentColor }}>{name}</h2><p className={`text-xs text-gray-500 mb-3 ${template === "classic" ? "text-center" : ""}`}>{[email, phone, location].filter(Boolean).join(" • ")}</p></>}
                    <p className="text-xs text-gray-600 mb-3">{summary}</p>
                    <h3 className="text-xs font-bold uppercase tracking-wider mb-1" style={{ color: accentColor }}>Experience</h3><hr className="mb-2" style={{ borderColor: accentColor }} />
                    {experience.map((exp, i) => (<div key={i} className="mb-2"><div className="flex justify-between"><span className="font-semibold text-xs">{exp.role}</span><span className="text-xs text-gray-400">{exp.period}</span></div><p className="text-xs" style={{ color: accentColor }}>{exp.company}</p><p className="text-xs text-gray-600">{exp.desc}</p></div>))}
                    <h3 className="text-xs font-bold uppercase tracking-wider mb-1 mt-3" style={{ color: accentColor }}>Education</h3><hr className="mb-2" style={{ borderColor: accentColor }} />
                    {education.map((edu, i) => (<div key={i} className="mb-1"><div className="flex justify-between"><span className="font-semibold text-xs">{edu.degree}</span><span className="text-xs text-gray-400">{edu.year}</span></div><p className="text-xs" style={{ color: accentColor }}>{edu.school}</p></div>))}
                    <h3 className="text-xs font-bold uppercase tracking-wider mb-1 mt-3" style={{ color: accentColor }}>Skills</h3><hr className="mb-2" style={{ borderColor: accentColor }} />
                    <p className="text-xs text-gray-600">{skills}</p>
                </div>
            </div>

            <div className="mt-12 space-y-6 text-gray-600 dark:text-gray-400 text-sm leading-relaxed border-t border-gray-200 dark:border-gray-700 pt-8">
                <h2 className="text-xl font-bold text-gray-800 dark:text-gray-200">About This Tool</h2>
                <p>Build a professional resume with our free online builder. Choose from 3 templates, customize colors, add experience and education, then download as a polished PDF. Everything runs in your browser — your data is never stored.</p>
                <h2 className="text-lg font-bold text-gray-800 dark:text-gray-200">Frequently Asked Questions</h2>
                <div className="space-y-4">
                    <details className="group"><summary className="cursor-pointer font-medium text-gray-700 dark:text-gray-300 hover:text-blue-600 dark:hover:text-blue-400">Is my data saved?</summary><p className="mt-2 pl-4">No. All data stays in your browser. Nothing is uploaded or stored on any server. When you close the tab, the data is gone.</p></details>
                    <details className="group"><summary className="cursor-pointer font-medium text-gray-700 dark:text-gray-300 hover:text-blue-600 dark:hover:text-blue-400">Can I customize the template?</summary><p className="mt-2 pl-4">Yes! Choose from Classic, Modern, or Minimal templates. You can also change the accent color to match your personal brand.</p></details>
                </div>
            </div>
        </ToolLayout>
    );
}
