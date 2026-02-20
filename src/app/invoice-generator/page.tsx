"use client";

import { useState, useRef } from "react";
import ToolLayout from "@/components/ToolLayout";

interface LineItem {
    id: string;
    description: string;
    quantity: number;
    price: number;
}

export default function InvoiceGenerator() {
    const [companyName, setCompanyName] = useState("");
    const [companyAddress, setCompanyAddress] = useState("");
    const [clientName, setClientName] = useState("");
    const [clientAddress, setClientAddress] = useState("");
    const [invoiceNumber, setInvoiceNumber] = useState("INV-001");
    const [invoiceDate, setInvoiceDate] = useState(new Date().toISOString().split("T")[0]);
    const [dueDate, setDueDate] = useState("");
    const [currency, setCurrency] = useState("$");
    const [taxRate, setTaxRate] = useState(0);
    const [notes, setNotes] = useState("");
    const [items, setItems] = useState<LineItem[]>([{ id: "1", description: "", quantity: 1, price: 0 }]);
    const [generating, setGenerating] = useState(false);
    const previewRef = useRef<HTMLDivElement>(null);

    const addItem = () => setItems([...items, { id: Date.now().toString(), description: "", quantity: 1, price: 0 }]);
    const removeItem = (id: string) => setItems(items.filter((i) => i.id !== id));
    const updateItem = (id: string, field: keyof LineItem, value: string | number) =>
        setItems(items.map((i) => (i.id === id ? { ...i, [field]: value } : i)));

    const subtotal = items.reduce((s, i) => s + i.quantity * i.price, 0);
    const tax = subtotal * (taxRate / 100);
    const total = subtotal + tax;

    const fmt = (n: number) => currency + n.toFixed(2);

    const generatePdf = async () => {
        setGenerating(true);
        try {
            const { jsPDF } = await import("jspdf");
            const doc = new jsPDF();
            let y = 20;

            doc.setFontSize(24);
            doc.setFont("helvetica", "bold");
            doc.text("INVOICE", 20, y);

            doc.setFontSize(10);
            doc.setFont("helvetica", "normal");
            doc.text(`#${invoiceNumber}`, 160, y);
            y += 5;
            doc.text(`Date: ${invoiceDate}`, 160, y);
            if (dueDate) { y += 5; doc.text(`Due: ${dueDate}`, 160, y); }

            y = 40;
            doc.setFontSize(10);
            doc.setFont("helvetica", "bold");
            doc.text("From:", 20, y);
            doc.text("To:", 110, y);
            y += 6;
            doc.setFont("helvetica", "normal");
            if (companyName) { doc.text(companyName, 20, y); y += 5; }
            companyAddress.split("\n").forEach((line) => { doc.text(line, 20, y); y += 5; });

            y = 46;
            if (clientName) { doc.text(clientName, 110, y); y += 5; }
            clientAddress.split("\n").forEach((line) => { doc.text(line, 110, y); y += 5; });

            y = Math.max(y, 75);
            doc.setFillColor(59, 130, 246);
            doc.setTextColor(255, 255, 255);
            doc.rect(20, y, 170, 8, "F");
            doc.setFontSize(9);
            doc.setFont("helvetica", "bold");
            doc.text("Description", 22, y + 5.5);
            doc.text("Qty", 120, y + 5.5);
            doc.text("Price", 140, y + 5.5);
            doc.text("Total", 170, y + 5.5);
            y += 12;

            doc.setTextColor(0, 0, 0);
            doc.setFont("helvetica", "normal");
            items.forEach((item) => {
                doc.text(item.description || "-", 22, y);
                doc.text(item.quantity.toString(), 120, y);
                doc.text(fmt(item.price), 140, y);
                doc.text(fmt(item.quantity * item.price), 170, y);
                y += 7;
            });

            y += 5;
            doc.line(120, y, 190, y);
            y += 7;
            doc.text("Subtotal:", 140, y);
            doc.text(fmt(subtotal), 170, y);
            if (taxRate > 0) { y += 7; doc.text(`Tax (${taxRate}%):`, 140, y); doc.text(fmt(tax), 170, y); }
            y += 7;
            doc.setFont("helvetica", "bold");
            doc.setFontSize(12);
            doc.text("Total:", 140, y);
            doc.text(fmt(total), 170, y);

            if (notes) {
                y += 15;
                doc.setFontSize(9);
                doc.setFont("helvetica", "bold");
                doc.text("Notes:", 20, y);
                y += 6;
                doc.setFont("helvetica", "normal");
                doc.text(notes, 20, y);
            }

            doc.save(`invoice-${invoiceNumber}.pdf`);
        } catch (e) {
            console.error(e);
        }
        setGenerating(false);
    };

    return (
        <ToolLayout
            title="Invoice Generator Online"
            description="Create professional invoices as PDF directly in your browser. Free, no signup, private — your data stays on your device."
            relatedTools={["image-to-pdf", "word-counter", "lorem-ipsum-generator"]}
        >
            <div className="grid gap-6 lg:grid-cols-2">
                <div className="space-y-4">
                    <h3 className="text-sm font-bold text-gray-700 dark:text-gray-300 uppercase tracking-wider">Your Details</h3>
                    <input value={companyName} onChange={(e) => setCompanyName(e.target.value)} placeholder="Company / Your Name" className="w-full rounded-lg border border-gray-300 dark:border-gray-600 bg-white dark:bg-gray-900 px-3 py-2 text-sm focus:border-blue-500 focus:outline-none focus:ring-1 focus:ring-blue-500" />
                    <textarea value={companyAddress} onChange={(e) => setCompanyAddress(e.target.value)} placeholder="Address, email, phone..." rows={2} className="w-full rounded-lg border border-gray-300 dark:border-gray-600 bg-white dark:bg-gray-900 px-3 py-2 text-sm focus:border-blue-500 focus:outline-none focus:ring-1 focus:ring-blue-500" />
                </div>
                <div className="space-y-4">
                    <h3 className="text-sm font-bold text-gray-700 dark:text-gray-300 uppercase tracking-wider">Client Details</h3>
                    <input value={clientName} onChange={(e) => setClientName(e.target.value)} placeholder="Client Name" className="w-full rounded-lg border border-gray-300 dark:border-gray-600 bg-white dark:bg-gray-900 px-3 py-2 text-sm focus:border-blue-500 focus:outline-none focus:ring-1 focus:ring-blue-500" />
                    <textarea value={clientAddress} onChange={(e) => setClientAddress(e.target.value)} placeholder="Client address..." rows={2} className="w-full rounded-lg border border-gray-300 dark:border-gray-600 bg-white dark:bg-gray-900 px-3 py-2 text-sm focus:border-blue-500 focus:outline-none focus:ring-1 focus:ring-blue-500" />
                </div>
            </div>

            <div className="mt-4 grid gap-4 sm:grid-cols-4">
                <div><label className="mb-1 block text-xs font-medium text-gray-600 dark:text-gray-400">Invoice #</label><input value={invoiceNumber} onChange={(e) => setInvoiceNumber(e.target.value)} className="w-full rounded-lg border border-gray-300 dark:border-gray-600 bg-white dark:bg-gray-900 px-3 py-2 text-sm focus:border-blue-500 focus:outline-none focus:ring-1 focus:ring-blue-500" /></div>
                <div><label className="mb-1 block text-xs font-medium text-gray-600 dark:text-gray-400">Date</label><input type="date" value={invoiceDate} onChange={(e) => setInvoiceDate(e.target.value)} className="w-full rounded-lg border border-gray-300 dark:border-gray-600 bg-white dark:bg-gray-900 px-3 py-2 text-sm focus:border-blue-500 focus:outline-none focus:ring-1 focus:ring-blue-500" /></div>
                <div><label className="mb-1 block text-xs font-medium text-gray-600 dark:text-gray-400">Due Date</label><input type="date" value={dueDate} onChange={(e) => setDueDate(e.target.value)} className="w-full rounded-lg border border-gray-300 dark:border-gray-600 bg-white dark:bg-gray-900 px-3 py-2 text-sm focus:border-blue-500 focus:outline-none focus:ring-1 focus:ring-blue-500" /></div>
                <div className="grid grid-cols-2 gap-2">
                    <div><label className="mb-1 block text-xs font-medium text-gray-600 dark:text-gray-400">Currency</label><select value={currency} onChange={(e) => setCurrency(e.target.value)} className="w-full rounded-lg border border-gray-300 dark:border-gray-600 bg-white dark:bg-gray-900 px-3 py-2 text-sm"><option value="$">$ USD</option><option value="€">€ EUR</option><option value="£">£ GBP</option><option value="Kč ">Kč CZK</option></select></div>
                    <div><label className="mb-1 block text-xs font-medium text-gray-600 dark:text-gray-400">Tax %</label><input type="number" value={taxRate} onChange={(e) => setTaxRate(Number(e.target.value))} min={0} max={100} className="w-full rounded-lg border border-gray-300 dark:border-gray-600 bg-white dark:bg-gray-900 px-3 py-2 text-sm focus:border-blue-500 focus:outline-none focus:ring-1 focus:ring-blue-500" /></div>
                </div>
            </div>

            <div className="mt-6">
                <h3 className="mb-3 text-sm font-bold text-gray-700 dark:text-gray-300 uppercase tracking-wider">Line Items</h3>
                <div className="space-y-2">
                    {items.map((item) => (
                        <div key={item.id} className="flex gap-2 items-center">
                            <input value={item.description} onChange={(e) => updateItem(item.id, "description", e.target.value)} placeholder="Description" className="flex-1 rounded-lg border border-gray-300 dark:border-gray-600 bg-white dark:bg-gray-900 px-3 py-2 text-sm focus:border-blue-500 focus:outline-none focus:ring-1 focus:ring-blue-500" />
                            <input type="number" value={item.quantity} onChange={(e) => updateItem(item.id, "quantity", Number(e.target.value))} min={1} className="w-16 rounded-lg border border-gray-300 dark:border-gray-600 bg-white dark:bg-gray-900 px-2 py-2 text-sm text-center focus:border-blue-500 focus:outline-none focus:ring-1 focus:ring-blue-500" placeholder="Qty" />
                            <input type="number" value={item.price || ""} onChange={(e) => updateItem(item.id, "price", Number(e.target.value))} min={0} step={0.01} className="w-24 rounded-lg border border-gray-300 dark:border-gray-600 bg-white dark:bg-gray-900 px-2 py-2 text-sm text-right focus:border-blue-500 focus:outline-none focus:ring-1 focus:ring-blue-500" placeholder="Price" />
                            <span className="w-20 text-right text-sm font-medium text-gray-700 dark:text-gray-300">{fmt(item.quantity * item.price)}</span>
                            {items.length > 1 && <button onClick={() => removeItem(item.id)} className="text-red-500 hover:text-red-700 text-lg">×</button>}
                        </div>
                    ))}
                </div>
                <button onClick={addItem} className="mt-2 text-sm text-blue-600 hover:text-blue-700 font-medium">+ Add Item</button>
            </div>

            <div className="mt-4">
                <textarea value={notes} onChange={(e) => setNotes(e.target.value)} placeholder="Additional notes (payment terms, thank you message, etc.)" rows={2} className="w-full rounded-lg border border-gray-300 dark:border-gray-600 bg-white dark:bg-gray-900 px-3 py-2 text-sm focus:border-blue-500 focus:outline-none focus:ring-1 focus:ring-blue-500" />
            </div>

            <div className="mt-4 flex items-center justify-between rounded-lg bg-gray-50 dark:bg-gray-800 p-4" ref={previewRef}>
                <div className="space-y-1 text-sm">
                    <p className="text-gray-600 dark:text-gray-400">Subtotal: <span className="font-medium text-gray-800 dark:text-gray-200">{fmt(subtotal)}</span></p>
                    {taxRate > 0 && <p className="text-gray-600 dark:text-gray-400">Tax ({taxRate}%): <span className="font-medium text-gray-800 dark:text-gray-200">{fmt(tax)}</span></p>}
                    <p className="text-lg font-bold text-gray-800 dark:text-gray-200">Total: {fmt(total)}</p>
                </div>
                <button onClick={generatePdf} disabled={generating} className="rounded-lg bg-blue-600 px-6 py-2.5 text-sm font-medium text-white hover:bg-blue-700 disabled:opacity-50">
                    {generating ? "Generating..." : "Download PDF"}
                </button>
            </div>

            <div className="mt-12 space-y-6 text-gray-600 dark:text-gray-400 text-sm leading-relaxed border-t border-gray-200 dark:border-gray-700 pt-8">
                <h2 className="text-xl font-bold text-gray-800 dark:text-gray-200">About This Tool</h2>
                <p>Create professional invoices in seconds. Fill in your details, add line items, set tax rates, and download a clean PDF invoice. Everything runs in your browser — no signup, no account, no data stored.</p>
                <h2 className="text-lg font-bold text-gray-800 dark:text-gray-200">Frequently Asked Questions</h2>
                <div className="space-y-4">
                    <details className="group"><summary className="cursor-pointer font-medium text-gray-700 dark:text-gray-300 hover:text-blue-600 dark:hover:text-blue-400">Is my invoice data stored anywhere?</summary><p className="mt-2 pl-4">No. All data stays in your browser. When you close the page, the data is gone. The PDF is generated locally using jsPDF.</p></details>
                    <details className="group"><summary className="cursor-pointer font-medium text-gray-700 dark:text-gray-300 hover:text-blue-600 dark:hover:text-blue-400">Can I add my logo?</summary><p className="mt-2 pl-4">Logo support is coming soon. Currently the invoice uses a clean text-based design.</p></details>
                    <details className="group"><summary className="cursor-pointer font-medium text-gray-700 dark:text-gray-300 hover:text-blue-600 dark:hover:text-blue-400">What currencies are supported?</summary><p className="mt-2 pl-4">USD ($), EUR (€), GBP (£), and CZK (Kč) are available. The currency symbol is used for display only.</p></details>
                </div>
            </div>
        </ToolLayout>
    );
}
