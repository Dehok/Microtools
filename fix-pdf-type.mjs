import { readFileSync, writeFileSync } from "fs";
const f = "src/app/pdf-to-text/page.tsx";
let c = readFileSync(f, "utf-8");
c = c.replace(
    `.map((item: { str?: string }) => ("str" in item ? item.str : ""))`,
    `// eslint-disable-next-line @typescript-eslint/no-explicit-any\n                    .map((item: any) => item.str || "")`
);
writeFileSync(f, c, "utf-8");
console.log("Fixed pdf-to-text type issue");
