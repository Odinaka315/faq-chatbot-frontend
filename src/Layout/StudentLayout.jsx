import StudentNavbar from "../components/student/StudentNavbar";
import StudentFooter from "../components/student/StudentFooter";

export default function StudentLayout({ children }) {
  return (
    <div className="font-dm bg-cream text-navy min-h-screen overflow-x-hidden bg-grain flex flex-col">
      <StudentNavbar />

      <main className="flex-1">{children}</main>

      <StudentFooter />
    </div>
  );
}
