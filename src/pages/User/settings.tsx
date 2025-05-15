import { Layout } from "../../components/layout"
import { SettingsContent } from "../../components/settings-contetnt"
import { Settings as SettingsIcon } from "lucide-react"

export default function Settings() {
  return (
    <Layout>
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        <div className="flex items-center mb-8">
          <div className="bg-blue-100 p-3 rounded-full mr-4">
            <SettingsIcon className="h-8 w-8 text-blue-600" />
          </div>
          <div>
            <h1 className="text-3xl font-bold tracking-tight text-gray-900">Settings</h1>
            <p className="text-gray-600 mt-1">Manage your account preferences and security</p>
          </div>
        </div>
        <SettingsContent />
      </div>
    </Layout>
  )
}
