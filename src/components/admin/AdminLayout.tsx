import { Link, useLocation } from "react-router-dom";
import {
  LayoutDashboard, Package,
  Users, LogOut, Moon, Sun,
  Star, FileText, Mail, Home, MessageSquare, HelpCircle
} from "lucide-react";
import { useTheme } from "@/components/theme-provider"; // Theme එක මාරු කිරීමට
import { Button } from "@/components/ui/button";


const AdminLayout = ({ children }: { children: React.ReactNode }) => {
  const location = useLocation();
  const { theme, setTheme } = useTheme(); // දැනට තියෙන theme එක ගන්නවා




  const menuItems = [
    { label: "Dashboard", icon: LayoutDashboard, path: "/admin" },
    { label: "Inventory", icon: Package, path: "/admin/inventory" },
    { label: "Orders", icon: Package, path: "/admin/orders" },

    { label: "Customers", icon: Users, path: "/admin/users" },
    { label: "Reviews", icon: Star, path: "/admin/reviews" },
    { label: "Articles", icon: FileText, path: "/admin/articles" },
    { label: "Messages", icon: MessageSquare, path: "/admin/messages" },
    { label: "FAQ", icon: HelpCircle, path: "/admin/faq" },
    { label: "Contacts", icon: Mail, path: "/admin/contacts" },
    { label: "Home", icon: Home, path: "/" },
  ];

  return (
    <div className="flex min-h-screen bg-background text-foreground font-sans transition-colors duration-500">
      {/* Sidebar - Theme එක අනුව Border සහ Background මාරු වේ */}
      <aside className="w-72 bg-card border-r border-border flex flex-col sticky top-0 h-screen transition-all shadow-sm">
        <div className="p-8 mb-4 flex items-center justify-between">
          <div className="flex items-center gap-2">
            <div className="h-9 w-9 bg-primary rounded-xl shadow-lg shadow-primary/20 flex items-center justify-center text-primary-foreground">
              <Package className="h-5 w-5" />
            </div>
            <h2 className="text-xl font-black uppercase italic tracking-tighter">
              Admin<span className="text-primary">Panel</span>
            </h2>
          </div>
        </div>

        <nav className="flex-1 px-4 space-y-1.5">
          {menuItems.map((item) => {
            const isActive = location.pathname === item.path;
            return (
              <Link
                key={item.path}
                to={item.path}
                className={`flex items-center gap-4 px-6 py-4 rounded-[1.5rem] font-black text-[10px] uppercase tracking-[0.2em] transition-all duration-300 group ${isActive
                  ? "bg-primary text-primary-foreground shadow-[0_15px_30px_-8px_rgba(var(--primary-rgb),0.4)] translate-x-1"
                  : "text-muted-foreground hover:text-foreground hover:bg-accent"
                  }`}
              >
                <item.icon className={`h-4.5 w-4.5 ${isActive ? "scale-110" : "group-hover:scale-110"} transition-transform`} />
                {item.label}
              </Link>
            );
          })}
        </nav>

        {/* Bottom Section: Theme Toggle & Logout */}
        <div className="p-4 mt-auto border-t border-border space-y-2">
          {/* ✅ Theme Switcher Button */}
          <Button
            variant="ghost"
            onClick={() => setTheme(theme === "dark" ? "light" : "dark")}
            className="w-full flex items-center justify-start gap-4 px-6 py-4 rounded-[1.5rem] font-black text-[10px] uppercase tracking-[0.2em]"
          >
            {theme === "dark" ? <Sun className="h-4 w-4 text-yellow-500" /> : <Moon className="h-4 w-4 text-blue-500" />}
            {theme === "dark" ? "Light Mode" : "Dark Mode"}
          </Button>

          <Button
            variant="ghost"
            onClick={() => {
              console.log("Logout triggered");
              localStorage.removeItem('user');
              window.location.href = "/login";
            }}
            className="w-full flex items-center justify-start gap-4 px-6 py-4 rounded-[1.5rem] font-black text-[10px] uppercase tracking-[0.2em] text-red-500 hover:bg-red-50 dark:hover:bg-red-950/20 transition-all border border-transparent hover:border-red-200"
          >
            <LogOut className="h-4 w-4" />
            Logout
          </Button>

        </div>
      </aside>

      {/* Main Content Area */}
      <main className="flex-1 relative overflow-y-auto">
        <div className="p-8 md:p-12 max-w-[1600px] mx-auto min-h-screen">
          {children}
        </div>

        {/* Dynamic Background Glows */}
        <div className="fixed top-0 right-0 -z-10 h-[600px] w-[600px] bg-primary/5 blur-[120px] rounded-full pointer-events-none" />
      </main>
    </div>
  );
};

export default AdminLayout;