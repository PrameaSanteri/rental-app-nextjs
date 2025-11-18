import { cn } from "@/lib/utils";

const LogoIcon = (props: React.SVGProps<SVGSVGElement>) => (
  <svg
    xmlns="http://www.w3.org/2000/svg"
    viewBox="0 0 40 20"
    fill="none"
    {...props}
  >
    <path
      d="M10 20V0L0 0V20H2.5V10H7.5V20H10Z"
      fill="currentColor"
      transform="translate(5, 0)"
    />
    <path
      d="M10 20V0L0 0V20H2.5V10H7.5V20H10Z"
      fill="currentColor"
      transform="translate(25, 0)"
    />
  </svg>
);


export default function Logo({ className }: { className?: string }) {
  return (
    <div className={cn("flex flex-col items-center font-sans text-white", className)}>
        <LogoIcon className="h-5 w-10 mb-2" />
        <span className="text-4xl font-light tracking-widest">PRAMEA</span>
        <span className="text-sm font-light tracking-[0.2em]">APARTMENTS</span>
    </div>
  );
}
