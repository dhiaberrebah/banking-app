import { Outlet } from "react-router-dom"
import AdminSidebar from "../admin compoents/sidebar"
import AdminHeader from "../admin compoents/header"

const AdminLayout = () => {
  return (
    <div className="flex h-screen">
      <AdminSidebar />
      <div className="flex-1 flex flex-col overflow-hidden">
        <AdminHeader />
        <main className="flex-1 overflow-auto bg-gray-50 p-6">
          <Outlet />
        </main>
      </div>
    </div>
  )
}

export default AdminLayout
