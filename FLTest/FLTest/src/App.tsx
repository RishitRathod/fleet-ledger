import {
  Breadcrumb,
  BreadcrumbItem,
  BreadcrumbLink,
  BreadcrumbList,
  BreadcrumbPage,
  BreadcrumbSeparator,
} from "./components/ui/breadcrumb";
import { Separator } from "./components/ui/separator";
import {
  SidebarInset,
  SidebarProvider,
  SidebarTrigger,
} from "./components/ui/sidebar";
import { AppSidebar } from "./components/admin/app-sidebar";
import { AppSidebarUser } from "./components/user/app-sidebar";
import { ThemeToggle } from "./components/theme-toggle";
import {
  BrowserRouter as Router,
  Routes,
  Route,
  useLocation,
} from "react-router-dom";
import { useState, useEffect } from "react";
import Dashboard from "./components/admin/dashboard";
import DashboardUser from "./components/user/dashboard";
import LoginPage from "./login/page";
import Signup from "./signup";
import Users from "./components/admin/users";
import { AccessoriesExpenseModal } from "./components/expenses/accessories-expense";
import { FuelExpenseModal } from "./components/expenses/fuel-expense";
import { ServiceExpenseModal } from "./components/expenses/service-expense";
import { TaxExpenseModal } from "./components/expenses/tax-expense";
import { Toaster } from "@/components/ui/toaster";
import FleetExpenses from "./components/admin/myfleet";
import TableDemoPage from "./pages/TableDemoPage";
import FuelDataTable from "./components/DataTable";
import { AddVehicleModal } from "./pages/AddVehicleModal";
import { AssignVehicleModal } from "./pages/AssignVeghicleModal"; 
import ExpenseCharts from "./components/admin/expensecharts";
import ExpenseComparison from "./pages/ExpenseComparison";
import MyFleet from "./pages/MyFleet";

function Layout({ children }: { children: React.ReactNode }) {
  const location = useLocation();
  const isLoginPage =
    location.pathname === "/" ||
    location.pathname === "/loginform" ||
    location.pathname === "/signup";

  return isLoginPage ? (
    <main className="flex items-center justify-center h-screen">
      {children}
    </main>
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
      {/* <Breadcrumbs/> */}
    </SidebarProvider>
  );
}

export default function App() {
  return (
    <Router>
      <Routes>
        <Route path="/" element={<LoginPage />} />
        <Route path="/loginform" element={<LoginPage />} />
        <Route path="/signup" element={<Signup />} />
        <Route
          path="/data"
          element={
            <Layout>
              <FuelDataTable />
            </Layout>
          }
        />
        <Route
          path="/dashboard"
          element={
            <Layout>
              <Dashboard />
            </Layout>
          }
        />
        <Route
          path="/myfleet"
          element={
            <Layout>
              <MyFleet />
            </Layout>
          }
        />
        <Route
          path="/users"
          element={
            <Layout>
              <Users />
            </Layout>
          }
        />
        <Route
          path="/charts"
          element={
            <Layout>
              <ExpenseCharts />
            </Layout>
          }
        />
        <Route
          path="/data-table"
          element={
            <Layout>
              <TableDemoPage />
            </Layout>
          }
        />
        <Route
          path="/comparison"
          element={
            <Layout>
              <ExpenseComparison />
            </Layout>
          }
        />
        <Route
          path="/user-dash"
          element={
            <SidebarProvider>
              <AppSidebarUser />
              <SidebarInset>
                <header className="flex h-16 shrink-0 items-center gap-2 transition-[width,height] ease-linear group-has-[[data-collapsible=icon]]/sidebar-wrapper:h-12">
                  <div className="flex items-center gap-2 px-4">
                    <SidebarTrigger className="-ml-1" />
                    <Separator orientation="vertical" className="mr-2 h-4" />
                    <Breadcrumb>
                      <BreadcrumbList>
                        <BreadcrumbItem className="hidden md:block">
                          <BreadcrumbLink href="/user-dash">
                            Home
                          </BreadcrumbLink>
                        </BreadcrumbItem>
                        <BreadcrumbSeparator className="hidden md:block" />
                        <BreadcrumbItem>
                          <BreadcrumbPage>Dashboard</BreadcrumbPage>
                        </BreadcrumbItem>
                      </BreadcrumbList>
                    </Breadcrumb>
                  </div>
                  <ThemeToggle />
                </header>
                <main className="p-4">
                  <DashboardUser />
                </main>
              </SidebarInset>
            </SidebarProvider>
          }
        />
      </Routes>
      <AccessoriesExpenseModal />
      <FuelExpenseModal />
      <ServiceExpenseModal />
      <TaxExpenseModal />
      <Toaster />
    </Router>
  );
}
