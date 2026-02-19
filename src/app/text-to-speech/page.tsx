"use client";

import { useState, useRef, useEffect, useCallback } from "react";
import ToolLayout from "@/components/ToolLayout";

export default function TextToSpeech() {
    const [text, setText] = useState("Hello! This is a text to speech demonstration. Paste any text here and click Speak.");
    const [voices, setVoices] = useState<SpeechSynthesisVoice[]>([]);
    const [selectedVoice, setSelectedVoice] = useState("");
    const [rate, setRate] = useState(1);
    const [pitch, setPitch] = useState(1);
    const [speaking, setSpeaking] = useState(false);
    const [paused, setPaused] = useState(false);
    const utterRef = useRef<SpeechSynthesisUtterance | null>(null);

    useEffect(() => {
        const loadVoices = () => {
            const v = speechSynthesis.getVoices();
            setVoices(v);
            if (v.length > 0 && !selectedVoice) {
                const def = v.find((x) => x.default) || v[0];
                setSelectedVoice(def.name);
            }
        };
        loadVoices();
        speechSynthesis.onvoiceschanged = loadVoices;
        return () => { speechSynthesis.cancel(); };
    }, [selectedVoice]);

    const speak = useCallback(() => {
        if (!text.trim()) return;
        speechSynthesis.cancel();
        const utter = new SpeechSynthesisUtterance(text);
        const voice = voices.find((v) => v.name === selectedVoice);
        if (voice) utter.voice = voice;
        utter.rate = rate;
        utter.pitch = pitch;
        utter.onend = () => { setSpeaking(false); setPaused(false); };
        utter.onerror = () => { setSpeaking(false); setPaused(false); };
        utterRef.current = utter;
        speechSynthesis.speak(utter);
        setSpeaking(true);
        setPaused(false);
    }, [text, voices, selectedVoice, rate, pitch]);

    const pause = () => { speechSynthesis.pause(); setPaused(true); };
    const resume = () => { speechSynthesis.resume(); setPaused(false); };
    const stop = () => { speechSynthesis.cancel(); setSpeaking(false); setPaused(false); };

    const wordCount = text.trim() ? text.trim().split(/\s+/).length : 0;
    const estimatedTime = Math.ceil(wordCount / (150 * rate));

    return (
        <ToolLayout
            title="Text to Speech Online"
            description="Convert text to speech directly in your browser. Choose from multiple voices, adjust speed and pitch. Free, private, no signup."
            relatedTools={["speech-to-text", "word-counter", "reading-time-calculator"]}
        >
            <div className="mb-4 grid gap-4 sm:grid-cols-2 lg:grid-cols-4">
                <div className="sm:col-span-2 lg:col-span-2">
                    <label className="mb-1 block text-sm font-medium text-gray-700 dark:text-gray-300">Voice</label>
                    <select value={selectedVoice} onChange={(e) => setSelectedVoice(e.target.value)} className="w-full rounded-lg border border-gray-300 dark:border-gray-600 bg-white dark:bg-gray-900 px-3 py-2 text-sm focus:border-blue-500 focus:outline-none focus:ring-1 focus:ring-blue-500">
                        {voices.map((v) => (<option key={v.name} value={v.name}>{v.name} ({v.lang})</option>))}
                    </select>
                </div>
                <div>
                    <label className="mb-1 block text-sm font-medium text-gray-700 dark:text-gray-300">Speed: {rate}x</label>
                    <input type="range" min={0.25} max={3} step={0.25} value={rate} onChange={(e) => setRate(Number(e.target.value))} className="w-full accent-blue-600" />
                </div>
                <div>
                    <label className="mb-1 block text-sm font-medium text-gray-700 dark:text-gray-300">Pitch: {pitch}</label>
                    <input type="range" min={0.5} max={2} step={0.1} value={pitch} onChange={(e) => setPitch(Number(e.target.value))} className="w-full accent-blue-600" />
                </div>
            </div>

            <textarea
                value={text}
                onChange={(e) => setText(e.target.value)}
                rows={8}
                placeholder="Enter or paste text to convert to speech..."
                className="mb-4 w-full rounded-lg border border-gray-300 dark:border-gray-600 bg-white dark:bg-gray-900 px-4 py-3 text-sm focus:border-blue-500 focus:outline-none focus:ring-1 focus:ring-blue-500"
            />

            <div className="mb-4 flex flex-wrap items-center gap-3">
                {!speaking ? (
                    <button onClick={speak} disabled={!text.trim()} className="rounded-lg bg-blue-600 px-6 py-2.5 text-sm font-medium text-white hover:bg-blue-700 disabled:opacity-50">▶ Speak</button>
                ) : (
                    <>
                        {paused ? (
                            <button onClick={resume} className="rounded-lg bg-blue-600 px-6 py-2.5 text-sm font-medium text-white hover:bg-blue-700">▶ Resume</button>
                        ) : (
                            <button onClick={pause} className="rounded-lg bg-yellow-500 px-6 py-2.5 text-sm font-medium text-white hover:bg-yellow-600">⏸ Pause</button>
                        )}
                        <button onClick={stop} className="rounded-lg bg-red-500 px-6 py-2.5 text-sm font-medium text-white hover:bg-red-600">⏹ Stop</button>
                    </>
                )}
                <span className="text-xs text-gray-500 dark:text-gray-400">{wordCount} words · ~{estimatedTime} min</span>
            </div>

            <div className="mt-12 space-y-6 text-gray-600 dark:text-gray-400 text-sm leading-relaxed border-t border-gray-200 dark:border-gray-700 pt-8">
                <h2 className="text-xl font-bold text-gray-800 dark:text-gray-200">About This Tool</h2>
                <p>Convert any text to natural-sounding speech using your browser&#39;s built-in Web Speech API. Choose from all available system voices, adjust speaking speed and pitch, and listen instantly. No installation or signup required — it works entirely offline once the page loads.</p>
                <h2 className="text-lg font-bold text-gray-800 dark:text-gray-200">Frequently Asked Questions</h2>
                <div className="space-y-4">
                    <details className="group"><summary className="cursor-pointer font-medium text-gray-700 dark:text-gray-300 hover:text-blue-600 dark:hover:text-blue-400">What languages are supported?</summary><p className="mt-2 pl-4">The available voices depend on your operating system and browser. Most modern systems include voices for English, Spanish, French, German, Chinese, Japanese, and many more.</p></details>
                    <details className="group"><summary className="cursor-pointer font-medium text-gray-700 dark:text-gray-300 hover:text-blue-600 dark:hover:text-blue-400">Can I download the audio?</summary><p className="mt-2 pl-4">The Web Speech API plays audio directly and does not support file downloads. For audio file generation, a server-side TTS service would be needed.</p></details>
                    <details className="group"><summary className="cursor-pointer font-medium text-gray-700 dark:text-gray-300 hover:text-blue-600 dark:hover:text-blue-400">Does this work offline?</summary><p className="mt-2 pl-4">Yes, once the page is loaded, text-to-speech works offline using your system&#39;s built-in speech synthesis engine.</p></details>
                </div>
            </div>
        </ToolLayout>
    );
}
