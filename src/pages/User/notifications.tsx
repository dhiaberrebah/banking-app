import { Layout } from "../../components/layout"
import { NotificationsContent } from "../../components/notification-content"

export default function Notifications() {
  return (
    <Layout>
      <div className="space-y-6">
        <h1 className="text-3xl font-bold tracking-tight">Notifications</h1>
        <NotificationsContent />
      </div>
    </Layout>
  )
}
