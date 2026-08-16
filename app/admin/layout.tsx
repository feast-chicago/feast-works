import AdminSidebar from "@/components/AdminSidebar";
import { cn } from "@/lib/utils";

export default function AdminLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <div
      className={cn(
        "mx-auto flex size-full flex-1 flex-col overflow-hidden md:flex-row bg-sidebar",
      )}
    >
      <AdminSidebar />
      <main className="w-full bg-background md:border-l md:rounded-tl-4xl overflow-hidden p-10">
        {children}
      </main>
    </div>
  );
}
