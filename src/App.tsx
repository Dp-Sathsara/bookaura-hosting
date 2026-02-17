import { useEffect } from "react";
import { BrowserRouter as Router, Routes, Route, useLocation } from "react-router-dom";
import { ThemeProvider } from "./components/theme-provider";
import { Toaster } from "@/components/ui/sonner";
import CheckoutPage from "./components/CheckoutPage";

// ✅ User Pages & Components
import { AuthProvider } from "./context/AuthContext";
import { ProtectedRoute } from "./components/ProtectedRoute";
import Navbar from "./components/Navbar";
import { LoginForm } from "./components/LoginForm";
import { RegisterForm } from "./components/RegisterForm";
import { ForgotPasswordForm } from "./components/ForgotPasswordForm";
import BookDetails from "./components/BookDetails";
import CategoryPage from "./components/CategoryPage";
import ProfileSettings from "./components/ProfileSettings";
import MyOrders from "./components/MyOrders";
import Footer from "./components/Footer";
import Home from "./pages/Home"; // ✅ Import Home Page
import BrowseCollection from "./pages/BrowseCollection"; // ✅ Import Browse Collection Page
import CategoriesPage from "./pages/CategoriesPage";
import ReviewsPage from "./pages/ReviewsPage";
import ArticlesPage from "./pages/ArticlesPage";
import ContactPage from "./pages/ContactPage";
import AudioBookPlayer from "./pages/AudioBookPlayer";
import FAQPage from "./pages/FAQPage";
import AboutPage from "./pages/AboutPage";


// ✅ Admin Components & Pages
import AdminLayout from "./components/admin/AdminLayout";
import AdminDashboard from "./components/admin/AdminDashboard";
import AdminInventory from "./components/admin/AdminInventory";

import AdminUsers from "./components/admin/AdminUsers";
import AdminReviews from "./components/admin/AdminReviews";
import AdminArticles from "./components/admin/AdminArticles";
import AdminContactMessages from "./components/admin/AdminContactMessages";
import AdminMessages from "@/components/admin/AdminMessages"; // Updated import name and path
import AdminOrders from "@/components/admin/AdminOrders"; // ✅ Import AdminOrders
import AdminFAQ from "@/components/admin/AdminFAQ"; // Placeholder until created
import ScrollToTop from "./components/ScrollToTop"; // ✅ Import ScrollToTop
import OrderSuccessPage from "./pages/OrderSuccessPage"; // ✅ Import OrderSuccessPage

const Layout = () => {
  const location = useLocation();

  const hideNavbarRoutes = ["/login", "/register", "/forgot-password"];
  const isAdminRoute = location.pathname.startsWith("/admin");

  // ✅ Navbar සහ Footer පෙන්විය යුතුද යන්න තීරණය කිරීම
  const shouldShowHeaderFooter = !hideNavbarRoutes.includes(location.pathname) && !isAdminRoute;

  // Handle hash scrolling for Browse Collection interaction
  useEffect(() => {
    if (location.hash === '#browse-collection') {
      const element = document.getElementById('browse-collection');
      if (element) {
        setTimeout(() => {
          element.scrollIntoView({ behavior: 'smooth' });
        }, 100);
      }
    }
  }, [location]);

  return (
    <div className={`min-h-screen flex flex-col ${isAdminRoute ? 'bg-background' : 'bg-gradient-to-br from-blue-50 via-white to-white dark:from-slate-950 dark:via-slate-900 dark:to-black'} text-foreground transition-colors duration-300 font-sans`}>

      {/* Scroll To Top */}
      <ScrollToTop />

      {/* Navbar එක පෙන්වීම */}
      {shouldShowHeaderFooter && <Navbar setSearchQuery={() => { }} />}

      {/* ප්‍රධාන Content එක */}
      <div className="flex-grow">
        <Routes>
          <Route path="/" element={<Home />} />
          <Route path="/browse-collection" element={<BrowseCollection />} />
          <Route path="/categories" element={<CategoriesPage />} />
          <Route path="/book/:id" element={<BookDetails />} />
          <Route path="/category/:category" element={<CategoryPage />} />
          <Route path="/category/:category" element={<CategoryPage />} />
          <Route path="/checkout" element={<CheckoutPage />} />
          <Route path="/order-success" element={<OrderSuccessPage />} /> { /* ✅ Add Order Success Route */}
          <Route path="/profile" element={<ProfileSettings />} />
          <Route path="/orders" element={<MyOrders />} />
          <Route path="/reviews" element={<ReviewsPage />} />
          <Route path="/articles" element={<ArticlesPage />} />
          <Route path="/contact" element={<ContactPage />} />
          <Route path="/audio-books" element={<AudioBookPlayer />} />
          <Route path="/faq" element={<FAQPage />} />
          <Route path="/about" element={<AboutPage />} />


          {/* Admin Routes */}
          <Route path="/admin" element={<ProtectedRoute role="ADMIN"><AdminLayout><AdminDashboard /></AdminLayout></ProtectedRoute>} />
          <Route path="/admin/inventory" element={<ProtectedRoute role="ADMIN"><AdminLayout><AdminInventory /></AdminLayout></ProtectedRoute>} />
          <Route path="/admin/orders" element={<ProtectedRoute role="ADMIN"><AdminLayout><AdminOrders /></AdminLayout></ProtectedRoute>} />
          <Route path="/admin/messages" element={<ProtectedRoute role="ADMIN"><AdminLayout><AdminMessages /></AdminLayout></ProtectedRoute>} />
          <Route path="/admin/faq" element={<ProtectedRoute role="ADMIN"><AdminLayout><AdminFAQ /></AdminLayout></ProtectedRoute>} />

          <Route path="/admin/users" element={<ProtectedRoute role="ADMIN"><AdminLayout><AdminUsers /></AdminLayout></ProtectedRoute>} />
          <Route path="/admin/reviews" element={<ProtectedRoute role="ADMIN"><AdminLayout><AdminReviews /></AdminLayout></ProtectedRoute>} />
          <Route path="/admin/articles" element={<ProtectedRoute role="ADMIN"><AdminLayout><AdminArticles /></AdminLayout></ProtectedRoute>} />
          <Route path="/admin/contacts" element={<ProtectedRoute role="ADMIN"><AdminLayout><AdminContactMessages /></AdminLayout></ProtectedRoute>} />

          {/* Auth Routes */}
          <Route path="/login" element={<div className="flex items-center justify-center min-h-[80vh] px-4"><LoginForm /></div>} />
          <Route path="/register" element={<div className="flex items-center justify-center min-h-[80vh] px-4"><RegisterForm /></div>} />
          <Route path="/forgot-password" element={<div className="flex items-center justify-center min-h-[80vh] px-4"><ForgotPasswordForm /></div>} />
        </Routes>
      </div>

      {/* Footer එක පෙන්වීම (Navbar පේන පේජ් වලට පමණක්) */}
      {shouldShowHeaderFooter && <Footer />}
      <Toaster />
    </div>
  );
};

function App() {
  return (
    <ThemeProvider defaultTheme="light" storageKey="vite-ui-theme">
      <Router>
        <AuthProvider>
          <Layout />
        </AuthProvider>
      </Router>
    </ThemeProvider>
  );
}

export default App;