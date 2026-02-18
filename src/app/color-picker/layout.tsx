import type { Metadata } from "next";
import FAQSchema from "@/components/FAQSchema";
import SchemaOrg from "@/components/SchemaOrg";

export const metadata: Metadata = {
  title: "Color Picker — HEX, RGB & HSL Converter Online",
  description: "Pick colors visually and convert between HEX, RGB, and HSL formats. Copy CSS-ready color values instantly. Free online color picker.",
  keywords: ["color picker","hex to rgb","rgb to hex","hsl converter","css color picker"],
  openGraph: {
    title: "Color Picker — HEX, RGB & HSL Converter Online | CodeUtilo",
    description: "Pick colors visually and convert between HEX, RGB, and HSL formats. Copy CSS-ready color values instantly. Free online color picker.",
    url: "https://codeutilo.com/color-picker",
    siteName: "CodeUtilo",
    type: "website",
  },
  twitter: {
    card: "summary",
    title: "Color Picker — HEX, RGB & HSL Converter Online | CodeUtilo",
    description: "Pick colors visually and convert between HEX, RGB, and HSL formats. Copy CSS-ready color values instantly. Free online color picker.",
  },
  alternates: {
    canonical: "https://codeutilo.com/color-picker",
  },
};

export default function Layout({ children }: { children: React.ReactNode }) {
  return (
    <>
      <SchemaOrg
        name="Color Picker"
        description="Pick colors visually and convert between HEX, RGB, and HSL formats. Copy CSS-ready color values instantly. Free online color picker."
        slug="color-picker"
      />
        <FAQSchema faqs={[{"question":"What is HEX color format?","answer":"HEX is a six-digit hexadecimal representation of color. The first two digits represent red, the middle two green, and the last two blue. For example, #FF5733 is a shade of orange-red."},{"question":"What is the difference between RGB and HSL?","answer":"RGB defines colors using Red, Green, and Blue channel values (0-255). HSL uses Hue (0-360°), Saturation (0-100%), and Lightness (0-100%). HSL is more intuitive for humans — you can easily make a color lighter or more saturated."},{"question":"Can I use the picked color in CSS?","answer":"Yes. All color values are displayed in CSS-ready format. Simply copy the HEX, RGB, or HSL value and paste it directly into your CSS stylesheet."},{"question":"How do I find the exact color from a website?","answer":"Use your browser's built-in color picker: right-click → Inspect → click the color swatch in the Styles panel. Or use browser extensions like ColorZilla to pick colors from any webpage."}]} />
      {children}
    </>
  );
}
