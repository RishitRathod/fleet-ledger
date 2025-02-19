import {
  Breadcrumb,
  BreadcrumbItem,
  BreadcrumbLink,
  BreadcrumbList,
  BreadcrumbPage,
  BreadcrumbSeparator,
} from "./components/ui/breadcrumb";
import { Separator } from "./components/ui/separator";
import { SidebarInset, SidebarProvider, SidebarTrigger } from "./components/ui/sidebar";
import { AppSidebar } from "./components/app-sidebar";
import { ThemeToggle } from "./components/theme-toggle";
import { useState, useEffect } from "react";
import { BrowserRouter as Router, Routes, Route, useLocation } from "react-router-dom";
import Dashboard from "./components/dashboard";
import  LoginPage  from "./login/page";
import Signup from "./signup";
import Users from "./components/users";

function Layout({ children }: { children: React.ReactNode }) {
  const location = useLocation();
  const [showSidebar, setShowSidebar] = useState(false);
  const isLoginPage = location.pathname === "/" || location.pathname === "/loginform" || location.pathname === "/signup";

  return isLoginPage ? (
    <main className="flex items-center justify-center h-screen">{children}</main>
  ) : (
    <SidebarProvider>
      <AppSidebar />
      <SidebarInset>
        <header className="flex h-16 shrink-0 items-center gap-2 transition-[width,height] ease-linear group-has-[[data-collapsible=icon]]/sidebar-wrapper:h-12">
          <div className="flex items-center gap-2 px-4">
            <SidebarTrigger className="-ml-1" />
            <Separator orientation="vertical" className="mr-2 h-4" />
            <Breadcrumb>
              <BreadcrumbList>
                <BreadcrumbItem className="hidden md:block">
                  <BreadcrumbLink href="/">Home</BreadcrumbLink>
                </BreadcrumbItem>
                <BreadcrumbSeparator className="hidden md:block" />
                <BreadcrumbItem>
                  <BreadcrumbPage>Current Page</BreadcrumbPage>
                </BreadcrumbItem>
              </BreadcrumbList>
            </Breadcrumb>
          </div>
          <ThemeToggle />
        </header>
        <main className="p-4">{children}</main>
      </SidebarInset>
    </SidebarProvider>
  );
}

export default function App() {
  return (
    <Router>
      <Layout>
        <Routes>
          <Route path="/" element={<LoginPage />} />
          <Route path="/dashboard" element={<Dashboard />} />
          <Route path="/loginform" element={<LoginPage />} />
          <Route path="/signup" element={<Signup />} />
          <Route path="/users" element={<Users />} />
        </Routes>
      </Layout>
    </Router>
  );
}