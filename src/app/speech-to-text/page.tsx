"use client";

import { useState, useRef, useCallback, useEffect } from "react";
import ToolLayout from "@/components/ToolLayout";

export default function SpeechToText() {
    const [text, setText] = useState("");
    const [listening, setListening] = useState(false);
    const [language, setLanguage] = useState("en-US");
    const [interim, setInterim] = useState("");
    const [copied, setCopied] = useState(false);
    const [supported, setSupported] = useState(true);
    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    const recognitionRef = useRef<any>(null);

    useEffect(() => {
        // eslint-disable-next-line @typescript-eslint/no-explicit-any
        const SR = (window as any).SpeechRecognition || (window as any).webkitSpeechRecognition;
        if (!SR) {
            setSupported(false);
            return;
        }
        const recognition = new SR();
        recognition.continuous = true;
        recognition.interimResults = true;
        recognition.lang = language;

        // eslint-disable-next-line @typescript-eslint/no-explicit-any
        recognition.onresult = (event: any) => {
            let final = "";
            let interimResult = "";
            for (let i = 0; i < event.results.length; i++) {
                const result = event.results[i];
                if (result.isFinal) {
                    final += result[0].transcript + " ";
                } else {
                    interimResult += result[0].transcript;
                }
            }
            if (final) setText((prev) => prev + final);
            setInterim(interimResult);
        };

        recognition.onerror = () => setListening(false);
        recognition.onend = () => setListening(false);
        recognitionRef.current = recognition;
    }, [language]);

    const toggleListening = useCallback(() => {
        if (!recognitionRef.current) return;
        if (listening) {
            recognitionRef.current.stop();
            setListening(false);
        } else {
            recognitionRef.current.lang = language;
            setText("");
            setInterim("");
            try {
                recognitionRef.current.start();
                setListening(true);
            } catch {
                setListening(false);
            }
        }
    }, [listening, language]);

    const handleCopy = () => {
        navigator.clipboard.writeText(text);
        setCopied(true);
        setTimeout(() => setCopied(false), 2000);
    };

    const wordCount = text.trim() ? text.trim().split(/\s+/).length : 0;

    if (!supported) {
        return (
            <ToolLayout title="Speech to Text Online" description="Convert speech to text using your microphone." relatedTools={["text-to-speech", "word-counter"]}>
                <div className="rounded-lg border border-red-200 dark:border-red-800 bg-red-50 dark:bg-red-950 p-6 text-center text-sm text-red-700 dark:text-red-300">
                    Your browser does not support the Web Speech Recognition API. Please use Chrome, Edge, or Safari.
                </div>
            </ToolLayout>
        );
    }

    return (
        <ToolLayout
            title="Speech to Text Online"
            description="Convert speech to text in real-time using your microphone. Supports multiple languages. Free, fast, private — runs in your browser."
            relatedTools={["text-to-speech", "word-counter", "reading-time-calculator"]}
        >
            <div className="mb-4 flex flex-wrap items-center gap-4">
                <div>
                    <label className="mb-1 block text-sm font-medium text-gray-700 dark:text-gray-300">Language</label>
                    <select value={language} onChange={(e) => setLanguage(e.target.value)} className="rounded-lg border border-gray-300 dark:border-gray-600 bg-white dark:bg-gray-900 px-3 py-2 text-sm focus:border-blue-500 focus:outline-none focus:ring-1 focus:ring-blue-500">
                        <option value="en-US">English (US)</option>
                        <option value="en-GB">English (UK)</option>
                        <option value="cs-CZ">Czech</option>
                        <option value="de-DE">German</option>
                        <option value="fr-FR">French</option>
                        <option value="es-ES">Spanish</option>
                        <option value="it-IT">Italian</option>
                        <option value="pl-PL">Polish</option>
                        <option value="pt-BR">Portuguese (BR)</option>
                        <option value="nl-NL">Dutch</option>
                        <option value="ru-RU">Russian</option>
                        <option value="uk-UA">Ukrainian</option>
                        <option value="ja-JP">Japanese</option>
                        <option value="ko-KR">Korean</option>
                        <option value="zh-CN">Chinese (Mandarin)</option>
                        <option value="ar-SA">Arabic</option>
                        <option value="hi-IN">Hindi</option>
                        <option value="tr-TR">Turkish</option>
                    </select>
                </div>
                <div className="flex items-end gap-3">
                    <button
                        onClick={toggleListening}
                        className={`rounded-lg px-6 py-2.5 text-sm font-medium text-white transition-colors ${listening ? "bg-red-500 hover:bg-red-600 animate-pulse" : "bg-blue-600 hover:bg-blue-700"}`}
                    >
                        {listening ? "⏹ Stop Recording" : "🎤 Start Recording"}
                    </button>
                </div>
            </div>

            {listening && (
                <div className="mb-4 flex items-center gap-2 rounded-lg border border-red-200 dark:border-red-800 bg-red-50 dark:bg-red-950 px-4 py-3">
                    <span className="inline-block h-3 w-3 animate-pulse rounded-full bg-red-500" />
                    <span className="text-sm text-red-700 dark:text-red-300">Listening... speak into your microphone</span>
                </div>
            )}

            <div className="relative mb-4">
                <textarea
                    value={text + (interim ? interim : "")}
                    onChange={(e) => setText(e.target.value)}
                    rows={10}
                    placeholder="Transcribed text will appear here..."
                    className="w-full rounded-lg border border-gray-300 dark:border-gray-600 bg-white dark:bg-gray-900 px-4 py-3 text-sm focus:border-blue-500 focus:outline-none focus:ring-1 focus:ring-blue-500"
                />
            </div>

            {text && (
                <div className="mb-4 flex items-center justify-between">
                    <span className="text-xs text-gray-500 dark:text-gray-400">{wordCount} words · {text.length} characters</span>
                    <div className="flex gap-2">
                        <button onClick={handleCopy} className="rounded-md bg-blue-600 px-3 py-1.5 text-xs font-medium text-white hover:bg-blue-700">{copied ? "Copied!" : "Copy Text"}</button>
                        <button onClick={() => { setText(""); setInterim(""); }} className="rounded-md border border-gray-300 dark:border-gray-600 px-3 py-1.5 text-xs font-medium text-gray-600 dark:text-gray-400 hover:bg-gray-100 dark:hover:bg-gray-800">Clear</button>
                    </div>
                </div>
            )}

            <div className="mt-12 space-y-6 text-gray-600 dark:text-gray-400 text-sm leading-relaxed border-t border-gray-200 dark:border-gray-700 pt-8">
                <h2 className="text-xl font-bold text-gray-800 dark:text-gray-200">About This Tool</h2>
                <p>Convert speech to text in real-time using your browser&#39;s Web Speech Recognition API. Just click the microphone button and start speaking — your words are transcribed instantly. Supports 18+ languages and works directly in Chrome, Edge, and Safari.</p>
                <h2 className="text-lg font-bold text-gray-800 dark:text-gray-200">Frequently Asked Questions</h2>
                <div className="space-y-4">
                    <details className="group"><summary className="cursor-pointer font-medium text-gray-700 dark:text-gray-300 hover:text-blue-600 dark:hover:text-blue-400">Which browsers support speech recognition?</summary><p className="mt-2 pl-4">Chrome and Edge have the best support. Safari has partial support. Firefox does not currently support the Web Speech Recognition API.</p></details>
                    <details className="group"><summary className="cursor-pointer font-medium text-gray-700 dark:text-gray-300 hover:text-blue-600 dark:hover:text-blue-400">Is my voice data stored anywhere?</summary><p className="mt-2 pl-4">We do not store any audio data. However, the browser&#39;s speech recognition may send audio to the browser vendor&#39;s servers for processing (Google for Chrome, Microsoft for Edge, Apple for Safari).</p></details>
                    <details className="group"><summary className="cursor-pointer font-medium text-gray-700 dark:text-gray-300 hover:text-blue-600 dark:hover:text-blue-400">How accurate is the transcription?</summary><p className="mt-2 pl-4">Accuracy depends on your microphone quality, background noise, and accent. In quiet environments with clear speech, accuracy is typically 90-95%+.</p></details>
                </div>
            </div>
        </ToolLayout>
    );
}
