import AppShell from "@/components/AppShell";

// Place pages (and their 404) share the sidebar + shared navbar, like the Settings section.
export default function PlacesLayout({ children }) {
  return <AppShell>{children}</AppShell>;
}
