import { BrowserRouter } from "react-router"
import { AppRoutes } from "./routes/AppRoutes"
import { CampaignProvider } from './context/CampaignContext'
import { AuthProvider } from './providers/AuthProvider'
function App() {

  return (
    <BrowserRouter>
      <AuthProvider>
        <CampaignProvider>
          <AppRoutes />
        </CampaignProvider>
      </AuthProvider>
    </BrowserRouter>
  )
}

export default App
