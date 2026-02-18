"use client";

import { useState, useMemo } from "react";
import ToolLayout from "@/components/ToolLayout";
import CopyButton from "@/components/CopyButton";

interface License {
  id: string;
  name: string;
  summary: string;
  permissions: string[];
  conditions: string[];
  limitations: string[];
  text: string;
}

const LICENSES: License[] = [
  {
    id: "mit",
    name: "MIT License",
    summary: "Short and simple permissive license. Do almost anything with it.",
    permissions: ["Commercial use", "Modification", "Distribution", "Private use"],
    conditions: ["Include copyright", "Include license"],
    limitations: ["Liability", "Warranty"],
    text: `MIT License

Copyright (c) [year] [fullname]

Permission is hereby granted, free of charge, to any person obtaining a copy
of this software and associated documentation files (the "Software"), to deal
in the Software without restriction, including without limitation the rights
to use, copy, modify, merge, publish, distribute, sublicense, and/or sell
copies of the Software, and to permit persons to whom the Software is
furnished to do so, subject to the following conditions:

The above copyright notice and this permission notice shall be included in all
copies or substantial portions of the Software.

THE SOFTWARE IS PROVIDED "AS IS", WITHOUT WARRANTY OF ANY KIND, EXPRESS OR
IMPLIED, INCLUDING BUT NOT LIMITED TO THE WARRANTIES OF MERCHANTABILITY,
FITNESS FOR A PARTICULAR PURPOSE AND NONINFRINGEMENT. IN NO EVENT SHALL THE
AUTHORS OR COPYRIGHT HOLDERS BE LIABLE FOR ANY CLAIM, DAMAGES OR OTHER
LIABILITY, WHETHER IN AN ACTION OF CONTRACT, TORT OR OTHERWISE, ARISING FROM,
OUT OF OR IN CONNECTION WITH THE SOFTWARE OR THE USE OR OTHER DEALINGS IN THE
SOFTWARE.`,
  },
  {
    id: "apache",
    name: "Apache License 2.0",
    summary: "Permissive license with patent protection. Used by Android, Kubernetes.",
    permissions: ["Commercial use", "Modification", "Distribution", "Patent use", "Private use"],
    conditions: ["Include copyright", "Include license", "State changes", "Include NOTICE"],
    limitations: ["Liability", "Warranty", "Trademark use"],
    text: `Apache License
Version 2.0, January 2004
http://www.apache.org/licenses/

Copyright [year] [fullname]

Licensed under the Apache License, Version 2.0 (the "License");
you may not use this file except in compliance with the License.
You may obtain a copy of the License at

    http://www.apache.org/licenses/LICENSE-2.0

Unless required by applicable law or agreed to in writing, software
distributed under the License is distributed on an "AS IS" BASIS,
WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
See the License for the specific language governing permissions and
limitations under the License.`,
  },
  {
    id: "gpl3",
    name: "GNU GPL v3.0",
    summary: "Strong copyleft license. Derivatives must also be open source under GPL.",
    permissions: ["Commercial use", "Modification", "Distribution", "Patent use", "Private use"],
    conditions: ["Include copyright", "Include license", "State changes", "Disclose source", "Same license"],
    limitations: ["Liability", "Warranty"],
    text: `GNU GENERAL PUBLIC LICENSE
Version 3, 29 June 2007

Copyright (c) [year] [fullname]

This program is free software: you can redistribute it and/or modify
it under the terms of the GNU General Public License as published by
the Free Software Foundation, either version 3 of the License, or
(at your option) any later version.

This program is distributed in the hope that it will be useful,
but WITHOUT ANY WARRANTY; without even the implied warranty of
MERCHANTABILITY or FITNESS FOR A PARTICULAR PURPOSE. See the
GNU General Public License for more details.

You should have received a copy of the GNU General Public License
along with this program. If not, see <https://www.gnu.org/licenses/>.`,
  },
  {
    id: "bsd2",
    name: "BSD 2-Clause",
    summary: "Simple permissive license with only two clauses. Minimal restrictions.",
    permissions: ["Commercial use", "Modification", "Distribution", "Private use"],
    conditions: ["Include copyright", "Include license"],
    limitations: ["Liability", "Warranty"],
    text: `BSD 2-Clause License

Copyright (c) [year] [fullname]

Redistribution and use in source and binary forms, with or without
modification, are permitted provided that the following conditions are met:

1. Redistributions of source code must retain the above copyright notice, this
   list of conditions and the following disclaimer.

2. Redistributions in binary form must reproduce the above copyright notice,
   this list of conditions and the following disclaimer in the documentation
   and/or other materials provided with the distribution.

THIS SOFTWARE IS PROVIDED BY THE COPYRIGHT HOLDERS AND CONTRIBUTORS "AS IS"
AND ANY EXPRESS OR IMPLIED WARRANTIES, INCLUDING, BUT NOT LIMITED TO, THE
IMPLIED WARRANTIES OF MERCHANTABILITY AND FITNESS FOR A PARTICULAR PURPOSE ARE
DISCLAIMED. IN NO EVENT SHALL THE COPYRIGHT HOLDER OR CONTRIBUTORS BE LIABLE
FOR ANY DIRECT, INDIRECT, INCIDENTAL, SPECIAL, EXEMPLARY, OR CONSEQUENTIAL
DAMAGES (INCLUDING, BUT NOT LIMITED TO, PROCUREMENT OF SUBSTITUTE GOODS OR
SERVICES; LOSS OF USE, DATA, OR PROFITS; OR BUSINESS INTERRUPTION) HOWEVER
CAUSED AND ON ANY THEORY OF LIABILITY, WHETHER IN CONTRACT, STRICT LIABILITY,
OR TORT (INCLUDING NEGLIGENCE OR OTHERWISE) ARISING IN ANY WAY OUT OF THE USE
OF THIS SOFTWARE, EVEN IF ADVISED OF THE POSSIBILITY OF SUCH DAMAGE.`,
  },
  {
    id: "bsd3",
    name: "BSD 3-Clause",
    summary: "Like BSD 2-Clause but adds a non-endorsement clause.",
    permissions: ["Commercial use", "Modification", "Distribution", "Private use"],
    conditions: ["Include copyright", "Include license"],
    limitations: ["Liability", "Warranty"],
    text: `BSD 3-Clause License

Copyright (c) [year] [fullname]

Redistribution and use in source and binary forms, with or without
modification, are permitted provided that the following conditions are met:

1. Redistributions of source code must retain the above copyright notice, this
   list of conditions and the following disclaimer.

2. Redistributions in binary form must reproduce the above copyright notice,
   this list of conditions and the following disclaimer in the documentation
   and/or other materials provided with the distribution.

3. Neither the name of the copyright holder nor the names of its
   contributors may be used to endorse or promote products derived from
   this software without specific prior written permission.

THIS SOFTWARE IS PROVIDED BY THE COPYRIGHT HOLDERS AND CONTRIBUTORS "AS IS"
AND ANY EXPRESS OR IMPLIED WARRANTIES, INCLUDING, BUT NOT LIMITED TO, THE
IMPLIED WARRANTIES OF MERCHANTABILITY AND FITNESS FOR A PARTICULAR PURPOSE ARE
DISCLAIMED. IN NO EVENT SHALL THE COPYRIGHT HOLDER OR CONTRIBUTORS BE LIABLE
FOR ANY DIRECT, INDIRECT, INCIDENTAL, SPECIAL, EXEMPLARY, OR CONSEQUENTIAL
DAMAGES (INCLUDING, BUT NOT LIMITED TO, PROCUREMENT OF SUBSTITUTE GOODS OR
SERVICES; LOSS OF USE, DATA, OR PROFITS; OR BUSINESS INTERRUPTION) HOWEVER
CAUSED AND ON ANY THEORY OF LIABILITY, WHETHER IN CONTRACT, STRICT LIABILITY,
OR TORT (INCLUDING NEGLIGENCE OR OTHERWISE) ARISING IN ANY WAY OUT OF THE USE
OF THIS SOFTWARE, EVEN IF ADVISED OF THE POSSIBILITY OF SUCH DAMAGE.`,
  },
  {
    id: "isc",
    name: "ISC License",
    summary: "Functionally equivalent to MIT. Preferred by npm and OpenBSD.",
    permissions: ["Commercial use", "Modification", "Distribution", "Private use"],
    conditions: ["Include copyright", "Include license"],
    limitations: ["Liability", "Warranty"],
    text: `ISC License

Copyright (c) [year] [fullname]

Permission to use, copy, modify, and/or distribute this software for any
purpose with or without fee is hereby granted, provided that the above
copyright notice and this permission notice appear in all copies.

THE SOFTWARE IS PROVIDED "AS IS" AND THE AUTHOR DISCLAIMS ALL WARRANTIES WITH
REGARD TO THIS SOFTWARE INCLUDING ALL IMPLIED WARRANTIES OF MERCHANTABILITY
AND FITNESS. IN NO EVENT SHALL THE AUTHOR BE LIABLE FOR ANY SPECIAL, DIRECT,
INDIRECT, OR CONSEQUENTIAL DAMAGES OR ANY DAMAGES WHATSOEVER RESULTING FROM
LOSS OF USE, DATA OR PROFITS, WHETHER IN AN ACTION OF CONTRACT, NEGLIGENCE OR
OTHER TORTIOUS ACTION, ARISING OUT OF OR IN CONNECTION WITH THE USE OR
PERFORMANCE OF THIS SOFTWARE.`,
  },
  {
    id: "mpl2",
    name: "Mozilla Public License 2.0",
    summary: "Weak copyleft. Modified files must stay open, but can combine with proprietary code.",
    permissions: ["Commercial use", "Modification", "Distribution", "Patent use", "Private use"],
    conditions: ["Include copyright", "Include license", "Disclose source (modified files)"],
    limitations: ["Liability", "Warranty", "Trademark use"],
    text: `Mozilla Public License Version 2.0

Copyright (c) [year] [fullname]

This Source Code Form is subject to the terms of the Mozilla Public
License, v. 2.0. If a copy of the MPL was not distributed with this
file, You can obtain one at https://mozilla.org/MPL/2.0/.`,
  },
  {
    id: "unlicense",
    name: "The Unlicense",
    summary: "Dedicate your work to the public domain. No conditions whatsoever.",
    permissions: ["Commercial use", "Modification", "Distribution", "Private use"],
    conditions: [],
    limitations: ["Liability", "Warranty"],
    text: `This is free and unencumbered software released into the public domain.

Anyone is free to copy, modify, publish, use, compile, sell, or
distribute this software, either in source code form or as a compiled
binary, for any purpose, commercial or non-commercial, and by any
means.

In jurisdictions that recognize copyright laws, the author or authors
of this software dedicate any and all copyright interest in the
software to the public domain. We make this dedication for the benefit
of the public at large and to the detriment of our heirs and
successors. We intend this dedication to be an overt act of
relinquishment in perpetuity of all present and future rights to this
software under copyright law.

THE SOFTWARE IS PROVIDED "AS IS", WITHOUT WARRANTY OF ANY KIND,
EXPRESS OR IMPLIED, INCLUDING BUT NOT LIMITED TO THE WARRANTIES OF
MERCHANTABILITY, FITNESS FOR A PARTICULAR PURPOSE AND NONINFRINGEMENT.
IN NO EVENT SHALL THE AUTHORS BE LIABLE FOR ANY CLAIM, DAMAGES OR
OTHER LIABILITY, WHETHER IN AN ACTION OF CONTRACT, TORT OR OTHERWISE,
ARISING FROM, OUT OF OR IN CONNECTION WITH THE SOFTWARE OR THE USE OR
OTHER DEALINGS IN THE SOFTWARE.

For more information, please refer to <https://unlicense.org>`,
  },
];

export default function OpenSourceLicenses() {
  const [selected, setSelected] = useState<string>("mit");
  const [year, setYear] = useState(new Date().getFullYear().toString());
  const [author, setAuthor] = useState("");

  const license = LICENSES.find((l) => l.id === selected)!;

  const finalText = useMemo(() => {
    return license.text
      .replace(/\[year\]/g, year || "[year]")
      .replace(/\[fullname\]/g, author || "[fullname]");
  }, [license, year, author]);

  return (
    <ToolLayout
      title="Open Source License Chooser"
      description="Compare popular open source licenses. Understand permissions, conditions, and limitations. Copy license text instantly."
      relatedTools={["github-readme-generator", "privacy-policy-generator", "markdown-preview"]}
    >
      {/* Inputs */}
      <div className="mb-4 flex flex-wrap gap-3">
        <div className="flex items-center gap-2">
          <label className="text-sm text-gray-600">Year:</label>
          <input
            type="text"
            value={year}
            onChange={(e) => setYear(e.target.value)}
            className="w-20 rounded-md border border-gray-300 px-2 py-1 text-sm"
          />
        </div>
        <div className="flex items-center gap-2">
          <label className="text-sm text-gray-600">Author:</label>
          <input
            type="text"
            value={author}
            onChange={(e) => setAuthor(e.target.value)}
            placeholder="Your Name"
            className="w-48 rounded-md border border-gray-300 px-2 py-1 text-sm"
          />
        </div>
      </div>

      {/* License cards */}
      <div className="mb-6 grid grid-cols-2 gap-2 sm:grid-cols-4">
        {LICENSES.map((l) => (
          <button
            key={l.id}
            onClick={() => setSelected(l.id)}
            className={`cursor-pointer rounded-lg border p-3 text-left transition-colors ${
              selected === l.id
                ? "border-blue-500 bg-blue-50"
                : "border-gray-200 bg-white hover:border-blue-300"
            }`}
          >
            <div className="text-sm font-semibold text-gray-900">{l.name}</div>
          </button>
        ))}
      </div>

      {/* License details */}
      <div className="mb-4 rounded-lg border border-gray-200 bg-gray-50 p-4">
        <h3 className="mb-1 text-lg font-semibold text-gray-900">{license.name}</h3>
        <p className="mb-3 text-sm text-gray-600">{license.summary}</p>
        <div className="flex flex-wrap gap-4">
          {license.permissions.length > 0 && (
            <div>
              <div className="mb-1 text-xs font-semibold uppercase text-green-700">Permissions</div>
              <div className="flex flex-wrap gap-1">
                {license.permissions.map((p) => (
                  <span key={p} className="rounded bg-green-100 px-2 py-0.5 text-xs text-green-800">{p}</span>
                ))}
              </div>
            </div>
          )}
          {license.conditions.length > 0 && (
            <div>
              <div className="mb-1 text-xs font-semibold uppercase text-blue-700">Conditions</div>
              <div className="flex flex-wrap gap-1">
                {license.conditions.map((c) => (
                  <span key={c} className="rounded bg-blue-100 px-2 py-0.5 text-xs text-blue-800">{c}</span>
                ))}
              </div>
            </div>
          )}
          {license.limitations.length > 0 && (
            <div>
              <div className="mb-1 text-xs font-semibold uppercase text-red-700">Limitations</div>
              <div className="flex flex-wrap gap-1">
                {license.limitations.map((l) => (
                  <span key={l} className="rounded bg-red-100 px-2 py-0.5 text-xs text-red-800">{l}</span>
                ))}
              </div>
            </div>
          )}
        </div>
      </div>

      {/* License text */}
      <div className="mb-2 flex items-center justify-between">
        <span className="text-sm font-medium text-gray-700">License Text</span>
        <CopyButton text={finalText} />
      </div>
      <textarea
        readOnly
        value={finalText}
        className="h-64 w-full rounded-lg border border-gray-300 bg-white p-3 font-mono text-sm text-gray-800"
      />

      {/* SEO Content */}
      <div className="mt-8 border-t border-gray-200 pt-6 text-sm text-gray-600">
        <h2 className="mb-3 text-lg font-semibold text-gray-900">How to Choose an Open Source License</h2>
        <p className="mb-3">
          Choosing the right license depends on how you want others to use your code.
          <strong> MIT and ISC</strong> are the most permissive — anyone can do almost anything with your code.
          <strong> Apache 2.0</strong> adds patent protection.
          <strong> GPL 3.0</strong> requires derivative works to also be open source.
          <strong> The Unlicense</strong> puts your code in the public domain.
        </p>
        <h2 className="mb-3 text-lg font-semibold text-gray-900">Adding a License to Your Project</h2>
        <p>
          Create a file named LICENSE (or LICENSE.md) in your project root and paste the license text.
          Most hosting platforms like GitHub will automatically detect and display your license.
        </p>
      </div>
    </ToolLayout>
  );
}
