"use client";

import { useState } from "react";
import ToolLayout from "@/components/ToolLayout";
import CopyButton from "@/components/CopyButton";

// --- Data arrays ---

const FIRST_NAMES = [
  "James", "Mary", "Robert", "Patricia", "John", "Jennifer", "Michael", "Linda",
  "David", "Elizabeth", "William", "Barbara", "Richard", "Susan", "Joseph", "Jessica",
  "Thomas", "Sarah", "Christopher", "Karen", "Charles", "Lisa", "Daniel", "Nancy",
  "Matthew", "Betty", "Anthony", "Margaret", "Mark", "Sandra",
];

const LAST_NAMES = [
  "Smith", "Johnson", "Williams", "Brown", "Jones", "Garcia", "Miller", "Davis",
  "Rodriguez", "Martinez", "Hernandez", "Lopez", "Gonzalez", "Wilson", "Anderson",
  "Thomas", "Taylor", "Moore", "Jackson", "Martin", "Lee", "Perez", "Thompson",
  "White", "Harris", "Sanchez", "Clark", "Ramirez", "Lewis", "Robinson",
];

const EMAIL_DOMAINS = [
  "gmail.com", "yahoo.com", "outlook.com", "hotmail.com", "protonmail.com",
  "icloud.com", "mail.com", "zoho.com", "aol.com", "fastmail.com",
];

const STREET_NAMES = [
  "Main St", "Oak Ave", "Cedar Ln", "Elm St", "Maple Dr", "Pine St",
  "Washington Blvd", "Park Ave", "Lake Rd", "Hill St", "River Rd",
  "Forest Ave", "Sunset Blvd", "Broadway", "Highland Ave", "Valley Rd",
  "Spring St", "Church St", "Mill Rd", "Meadow Ln",
];

const CITIES = [
  "New York", "Los Angeles", "Chicago", "Houston", "Phoenix", "Philadelphia",
  "San Antonio", "San Diego", "Dallas", "Austin", "Denver", "Seattle",
  "Portland", "Boston", "Nashville", "Atlanta", "Miami", "Orlando",
  "San Francisco", "Minneapolis",
];

const STATES = [
  "NY", "CA", "IL", "TX", "AZ", "PA", "FL", "OH", "GA", "NC",
  "MI", "NJ", "VA", "WA", "CO", "MA", "IN", "TN", "MO", "MD",
];

const COMPANIES = [
  "Acme Corp", "Globex Inc", "Initech", "Umbrella Corp", "Stark Industries",
  "Wayne Enterprises", "Cyberdyne Systems", "Soylent Corp", "Massive Dynamic",
  "Aperture Science", "Wonka Industries", "Oscorp", "Hooli", "Pied Piper",
  "Dunder Mifflin", "Sterling Cooper", "Prestige Worldwide", "Vandelay Industries",
  "Bluth Company", "TechNova Solutions", "Quantum Dynamics", "NexGen Systems",
  "Vertex Analytics", "CloudPeak Software", "DataStream Inc",
];

const FIELD_OPTIONS = [
  { key: "name", label: "Name" },
  { key: "email", label: "Email" },
  { key: "phone", label: "Phone" },
  { key: "address", label: "Address" },
  { key: "company", label: "Company" },
  { key: "dob", label: "Date of Birth" },
  { key: "username", label: "Username" },
  { key: "ip", label: "IP Address" },
  { key: "creditCard", label: "Credit Card (masked)" },
  { key: "uuid", label: "UUID" },
  { key: "website", label: "Website URL" },
] as const;

type FieldKey = (typeof FIELD_OPTIONS)[number]["key"];

// --- Generator helpers ---

function randInt(min: number, max: number): number {
  return min + Math.floor(Math.random() * (max - min + 1));
}

function pick<T>(arr: T[]): T {
  return arr[Math.floor(Math.random() * arr.length)];
}

function generateUUID(): string {
  return "xxxxxxxx-xxxx-4xxx-yxxx-xxxxxxxxxxxx".replace(/[xy]/g, (c) => {
    const r = (Math.random() * 16) | 0;
    const v = c === "x" ? r : (r & 0x3) | 0x8;
    return v.toString(16);
  });
}

function generateName(): { first: string; last: string } {
  return { first: pick(FIRST_NAMES), last: pick(LAST_NAMES) };
}

function generateEmail(first: string, last: string): string {
  const formats = [
    `${first.toLowerCase()}.${last.toLowerCase()}`,
    `${first.toLowerCase()}${last.toLowerCase()}`,
    `${first.toLowerCase()}_${last.toLowerCase()}`,
    `${first.toLowerCase()[0]}${last.toLowerCase()}`,
    `${first.toLowerCase()}${randInt(1, 99)}`,
  ];
  return `${pick(formats)}@${pick(EMAIL_DOMAINS)}`;
}

function generatePhone(): string {
  return `+1 (${randInt(200, 999)}) ${randInt(200, 999)}-${String(randInt(1000, 9999))}`;
}

function generateAddress(): string {
  const num = randInt(1, 9999);
  const street = pick(STREET_NAMES);
  const city = pick(CITIES);
  const state = pick(STATES);
  const zip = String(randInt(10000, 99999));
  return `${num} ${street}, ${city}, ${state} ${zip}`;
}

function generateDOB(): string {
  const year = randInt(1960, 2005);
  const month = randInt(1, 12);
  const day = randInt(1, 28);
  return `${year}-${String(month).padStart(2, "0")}-${String(day).padStart(2, "0")}`;
}

function generateUsername(first: string, last: string): string {
  const formats = [
    `${first.toLowerCase()}${randInt(1, 999)}`,
    `${first.toLowerCase()}_${last.toLowerCase()}`,
    `${last.toLowerCase()}${first.toLowerCase()[0]}${randInt(10, 99)}`,
    `${first.toLowerCase()}${last.toLowerCase()[0]}${randInt(1, 9999)}`,
  ];
  return pick(formats);
}

function generateIP(): string {
  return `${randInt(1, 255)}.${randInt(0, 255)}.${randInt(0, 255)}.${randInt(1, 254)}`;
}

function generateCreditCard(): string {
  const g1 = "****";
  const g2 = "****";
  const g3 = "****";
  const g4 = String(randInt(1000, 9999));
  return `${g1} ${g2} ${g3} ${g4}`;
}

function generateWebsite(company: string): string {
  const slug = company
    .toLowerCase()
    .replace(/[^a-z0-9]+/g, "-")
    .replace(/(^-|-$)/g, "");
  const tlds = [".com", ".io", ".co", ".net", ".org"];
  return `https://${slug}${pick(tlds)}`;
}

// --- Row generation ---

interface FakeRow {
  [key: string]: string;
}

function generateRow(fields: FieldKey[]): FakeRow {
  const row: FakeRow = {};
  const { first, last } = generateName();
  const company = pick(COMPANIES);

  for (const field of fields) {
    switch (field) {
      case "name":
        row["Name"] = `${first} ${last}`;
        break;
      case "email":
        row["Email"] = generateEmail(first, last);
        break;
      case "phone":
        row["Phone"] = generatePhone();
        break;
      case "address":
        row["Address"] = generateAddress();
        break;
      case "company":
        row["Company"] = company;
        break;
      case "dob":
        row["Date of Birth"] = generateDOB();
        break;
      case "username":
        row["Username"] = generateUsername(first, last);
        break;
      case "ip":
        row["IP Address"] = generateIP();
        break;
      case "creditCard":
        row["Credit Card"] = generateCreditCard();
        break;
      case "uuid":
        row["UUID"] = generateUUID();
        break;
      case "website":
        row["Website"] = generateWebsite(company);
        break;
    }
  }

  return row;
}

// --- Format helpers ---

function toCSV(rows: FakeRow[]): string {
  if (rows.length === 0) return "";
  const headers = Object.keys(rows[0]);
  const lines = [headers.join(",")];
  for (const row of rows) {
    lines.push(
      headers.map((h) => {
        const val = row[h] ?? "";
        return val.includes(",") ? `"${val}"` : val;
      }).join(",")
    );
  }
  return lines.join("\n");
}

function toJSON(rows: FakeRow[]): string {
  return JSON.stringify(rows, null, 2);
}

// --- Component ---

export default function FakeDataGenerator() {
  const [selectedFields, setSelectedFields] = useState<Set<FieldKey>>(
    new Set(["name", "email", "phone"])
  );
  const [count, setCount] = useState(10);
  const [format, setFormat] = useState<"json" | "csv">("json");
  const [rows, setRows] = useState<FakeRow[]>([]);
  const [rawOutput, setRawOutput] = useState("");

  const toggleField = (key: FieldKey) => {
    setSelectedFields((prev) => {
      const next = new Set(prev);
      if (next.has(key)) {
        next.delete(key);
      } else {
        next.add(key);
      }
      return next;
    });
  };

  const handleGenerate = () => {
    const fields = FIELD_OPTIONS
      .map((f) => f.key)
      .filter((k) => selectedFields.has(k));
    if (fields.length === 0) return;

    const generated = Array.from({ length: count }, () => generateRow(fields));
    setRows(generated);
    setRawOutput(format === "json" ? toJSON(generated) : toCSV(generated));
  };

  const headers = rows.length > 0 ? Object.keys(rows[0]) : [];

  return (
    <ToolLayout
      title="Fake Data Generator"
      description="Generate realistic fake test data instantly. Create names, emails, addresses, phone numbers, and more for testing and development purposes. All generated client-side."
      relatedTools={["uuid-generator", "password-generator", "lorem-ipsum-generator"]}
    >
      {/* Field selection */}
      <div className="mb-4">
        <label className="mb-2 block text-sm font-medium text-gray-700 dark:text-gray-300">
          Select fields to generate:
        </label>
        <div className="flex flex-wrap gap-3">
          {FIELD_OPTIONS.map((field) => (
            <label
              key={field.key}
              className="flex items-center gap-1.5 text-sm text-gray-600 dark:text-gray-400"
            >
              <input
                type="checkbox"
                checked={selectedFields.has(field.key)}
                onChange={() => toggleField(field.key)}
                className="rounded border-gray-300 dark:border-gray-600"
              />
              {field.label}
            </label>
          ))}
        </div>
      </div>

      {/* Count + format */}
      <div className="mb-4 flex flex-wrap items-center gap-4">
        <div className="flex items-center gap-2">
          <label className="text-sm text-gray-600 dark:text-gray-400">Rows:</label>
          <input
            type="number"
            min={1}
            max={100}
            value={count}
            onChange={(e) =>
              setCount(Math.max(1, Math.min(100, Number(e.target.value))))
            }
            className="w-20 rounded-md border border-gray-300 dark:border-gray-600 px-2 py-1 text-sm"
          />
        </div>
        <div className="flex items-center gap-2">
          <label className="text-sm text-gray-600 dark:text-gray-400">Format:</label>
          <select
            value={format}
            onChange={(e) => setFormat(e.target.value as "json" | "csv")}
            className="rounded-md border border-gray-300 dark:border-gray-600 px-2 py-1 text-sm"
          >
            <option value="json">JSON</option>
            <option value="csv">CSV</option>
          </select>
        </div>
      </div>

      {/* Generate + Copy */}
      <div className="mb-4 flex gap-2">
        <button
          onClick={handleGenerate}
          disabled={selectedFields.size === 0}
          className="rounded-lg bg-blue-600 px-4 py-2 text-sm font-medium text-white transition-colors hover:bg-blue-700 disabled:opacity-50 disabled:cursor-not-allowed"
        >
          Generate Data
        </button>
        <CopyButton text={rawOutput} />
      </div>

      {/* Table preview */}
      {rows.length > 0 && (
        <div className="mb-4 overflow-x-auto rounded-lg border border-gray-300 dark:border-gray-600">
          <table className="w-full text-left text-sm">
            <thead className="bg-gray-100 dark:bg-gray-800 text-xs uppercase text-gray-600 dark:text-gray-400">
              <tr>
                <th className="px-3 py-2 font-medium">#</th>
                {headers.map((h) => (
                  <th key={h} className="px-3 py-2 font-medium whitespace-nowrap">
                    {h}
                  </th>
                ))}
              </tr>
            </thead>
            <tbody className="divide-y divide-gray-200 dark:divide-gray-700">
              {rows.map((row, i) => (
                <tr key={i} className="hover:bg-gray-50 dark:bg-gray-950 dark:hover:bg-gray-800">
                  <td className="px-3 py-2 text-gray-400 dark:text-gray-500">{i + 1}</td>
                  {headers.map((h) => (
                    <td key={h} className="px-3 py-2 whitespace-nowrap">
                      {row[h]}
                    </td>
                  ))}
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      )}

      {/* Raw output */}
      {rawOutput && (
        <div className="mb-4">
          <label className="mb-1 block text-sm font-medium text-gray-700 dark:text-gray-300">
            Raw Output ({format.toUpperCase()})
          </label>
          <textarea
            value={rawOutput}
            readOnly
            className="h-64 w-full rounded-lg border border-gray-300 dark:border-gray-600 bg-gray-50 dark:bg-gray-950 p-3 font-mono text-xs"
          />
        </div>
      )}

      {/* SEO Content */}
      <div className="mt-8 border-t border-gray-200 dark:border-gray-700 pt-6 text-sm text-gray-600 dark:text-gray-400">
        <h2 className="mb-3 text-lg font-semibold text-gray-900 dark:text-gray-100">
          What is Fake Data?
        </h2>
        <p className="mb-3">
          Fake data (also called mock data or test data) is synthetically generated
          information used by developers and testers to populate databases, test
          applications, and prototype user interfaces without using real personal
          information.
        </p>
        <h2 className="mb-3 text-lg font-semibold text-gray-900 dark:text-gray-100">
          Why Use a Fake Data Generator?
        </h2>
        <p className="mb-3">
          Using fake data protects user privacy during development and testing. It
          allows you to quickly generate large datasets with realistic-looking names,
          emails, addresses, and other fields without relying on production data or
          external APIs.
        </p>
        <h2 className="mb-3 text-lg font-semibold text-gray-900 dark:text-gray-100">
          Features
        </h2>
        <ul className="list-disc pl-5 space-y-1">
          <li>Generate up to 100 rows of fake data at once</li>
          <li>Choose from 11 different field types</li>
          <li>Export as JSON or CSV format</li>
          <li>Credit card numbers are automatically masked for safety</li>
          <li>All data is generated client-side &mdash; nothing is sent to a server</li>
        </ul>
      </div>
    </ToolLayout>
  );
}
