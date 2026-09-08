import { MessageSquare } from 'lucide-react'
import { EmptyPageState } from './EmptyPageState'

export function AssistantPage() {
  return <EmptyPageState icon={MessageSquare} title="Assistant workspace" detail="The troubleshooting workflow will be connected in Step 2." />
}
