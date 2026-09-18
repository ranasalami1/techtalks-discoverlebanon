export default function AppLayout({ children }) {
  return (
    <div className="min-h-screen w-full bg-cream">
      <main className="min-h-screen">{children}</main>
    </div>
  );
}
