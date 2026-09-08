import { Activity } from 'lucide-react'
import { EmptyPageState } from './EmptyPageState'

export function MonitoringPage() {
  return <EmptyPageState icon={Activity} title="Monitoring workspace" detail="Operational charts will be added in Step 5 when live metrics are available." />
}
