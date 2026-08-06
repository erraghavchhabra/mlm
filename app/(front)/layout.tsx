// app/(front)/layout.tsx
import FrontNavbar from "@/components/layout/FrontNavbar";
import FrontFooter from "@/components/layout/FrontFooter";
export default function FrontLayout({ children }: { children: React.ReactNode }) {
  return (
    <>
      <FrontNavbar />
      {children}
      <FrontFooter />
    </>
  );
}