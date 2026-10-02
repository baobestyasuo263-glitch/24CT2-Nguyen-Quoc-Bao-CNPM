import { BrowserRouter, Routes, Route } from "react-router-dom";

// ================= KHÁCH HÀNG =================

import Home from "./pages/customer/Home";
import Login from "./pages/customer/Login";
import Register from "./pages/customer/Register";
import Products from "./pages/customer/Products";
import ProductDetail from "./pages/customer/ProductDetail";
import Cart from "./pages/customer/Cart";
import Checkout from "./pages/customer/Checkout";
import Orders from "./pages/customer/Orders";
import Profile from "./pages/customer/Profile";
import Invoice from "./pages/customer/Invoice";

// ================= NHÂN VIÊN =================

import EmployeeLogin from "./pages/employee/Login";
import Dashboard from "./pages/employee/Dashboard";
import EmployeeProducts from "./pages/employee/Products";
import EmployeeInventory from "./pages/employee/Inventory";
import EmployeeOrders from "./pages/employee/Orders";
import Customers from "./pages/employee/Customers";
import Support from "./pages/employee/Support";
import Statistics from "./pages/employee/Statistics";
import EmployeeProfile from "./pages/employee/Profile";


// ================= QUẢN LÝ =================

import AdminDashboard from "./pages/admin/Dashboard";
import AdminProducts from "./pages/admin/Products";
import AdminOrders from "./pages/admin/Orders";
import AdminCustomers from "./pages/admin/Customers";
import AdminEmployees from "./pages/admin/Employees";
import Inventory from "./pages/admin/Inventory";
import Payments from "./pages/admin/Payments";
import Promotion from "./pages/admin/Promotions";

function App() {

    return (

        <BrowserRouter>

            <Routes>

                {/* ================= KHÁCH HÀNG ================= */}

                <Route
                    path="/"
                    element={<Home />}
                />

                <Route
                    path="/login"
                    element={<Login />}
                />

                <Route
                    path="/register"
                    element={<Register />}
                />

                <Route
                    path="/products"
                    element={<Products />}
                />

                <Route
                    path="/products/:id"
                    element={<ProductDetail />}
                />

                <Route
                    path="/cart"
                    element={<Cart />}
                />

                <Route
                    path="/checkout"
                    element={<Checkout />}
                />

                <Route
                    path="/orders"
                    element={<Orders />}
                />

                <Route
                    path="/profile"
                    element={<Profile />}
                />

                <Route
                    path="/invoice"
                    element={<Invoice />}
                />


                {/* ================= NHÂN VIÊN ================= */}

                <Route
                    path="/employee/login"
                    element={<EmployeeLogin />}
                />

                <Route
                    path="/employee"
                    element={<Dashboard />}
                />

                <Route
                    path="/employee/products"
                    element={<EmployeeProducts />}
                />

                <Route 
                    path="/employee/inventory"
                    element={<EmployeeInventory />}
                />

                <Route
                    path="/employee/orders"
                    element={<EmployeeOrders />}
                />

                <Route
                    path="/employee/customers"
                    element={<Customers />}
                />

                <Route
                    path="/employee/support"
                    element={<Support />}
                />

                <Route
                    path="/employee/statistics"
                    element={<Statistics />}
                />

                <Route
                    path="/employee/profile"
                    element={<EmployeeProfile />}
                />


                {/* ================= QUẢN LÝ ================= */}

                <Route
                    path="/admin"
                    element={<AdminDashboard />}
                />

                <Route
                    path="/admin/products"
                    element={<AdminProducts />}
                />
                <Route
                    path="/admin/orders"
                    element={<AdminOrders />}
                />
                <Route
                    path="/admin/customers"
                    element={<AdminCustomers />}
                />
                <Route
                    path="/admin/employees"
                    element={<AdminEmployees />}
                />
                <Route
                    path="/admin/inventory"
                    element={<Inventory/>}
                />
                <Route
                    path="/admin/payments"
                    element={<Payments />}
                />
                <Route
                    path="/admin/promotions"
                    element={<Promotion />}
                />

            </Routes>

        </BrowserRouter>

    );

}

export default App;