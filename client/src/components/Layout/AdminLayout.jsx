import AdminHeader from "./AdminHeader";
import Footer from "./Footer";
import ScrollToTop from "./ScrollToTop";

const AdminLayout = ({ children }) => {
  return (
    <div className="min-h-screen flex flex-col bg-slate-900">
      <ScrollToTop />
      <AdminHeader />
      <main className="flex-1 bg-slate-900 px-6 py-8">{children}</main>
      <Footer />
    </div>
  );
};

export default AdminLayout;
