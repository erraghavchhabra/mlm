// app/(front)/layout.tsx
import FrontNavbar from "@/components/layout/FrontNavbar";
import FrontFooter from "@/components/layout/FrontFooter";
export default function FrontLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <>
      <div className="min-h-screen w-full bg-[radial-gradient(circle_at_center,#17113b_0%,#0b1026_45%,#070914_100%)] text-white overflow-hidden relative selection:bg-[#6E5CFF] selection:text-white">
        <FrontNavbar />
        {children}
        <FrontFooter />
      </div>
    </>
  );
}
