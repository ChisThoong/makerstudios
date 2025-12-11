import Image from "next/image";
import Section1 from "./components/section1";
import Section2 from "./components/section2";
import Section3 from "./components/section3";
import Section4 from "./components/section4";

export default function Home() {
  return (
    <div className="min-h-screen bg-zinc-50 font-sans dark:bg-black">
      <Section1 />
      <Section2 />
      <Section3 />
      <Section4 />
    </div>
  );
}