import { Navigate, Route, Routes } from 'react-router-dom'
import { AppLayout } from './components/layout/AppLayout'
import { AboutPage } from './pages/AboutPage'
import { AssistantPage } from './pages/AssistantPage'
import { EvaluationPage } from './pages/EvaluationPage'
import { KnowledgeBasePage } from './pages/KnowledgeBasePage'
import { MonitoringPage } from './pages/MonitoringPage'

export default function App() {
  return (
    <Routes>
      <Route element={<AppLayout />}>
        <Route path="/" element={<Navigate to="/assistant" replace />} />
        <Route path="/assistant" element={<AssistantPage />} />
        <Route path="/evaluation" element={<EvaluationPage />} />
        <Route path="/monitoring" element={<MonitoringPage />} />
        <Route path="/knowledge-base" element={<KnowledgeBasePage />} />
        <Route path="/about" element={<AboutPage />} />
      </Route>
    </Routes>
  )
}
