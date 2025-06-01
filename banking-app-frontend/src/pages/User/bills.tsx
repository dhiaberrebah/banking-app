import { Layout } from "../../components/layout"
import { BillPayment } from "../../components/bill-payment"
import { BillsList } from "../../components/bill-list"

export default function Bills() {
  return (
    <Layout>
      <div className="space-y-6">
        <h1 className="text-3xl font-bold tracking-tight">Bill Payments</h1>
        <BillPayment />
        <BillsList />
      </div>
    </Layout>
  )
}
