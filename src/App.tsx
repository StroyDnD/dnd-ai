import './App.css'
import { BrowserRouter } from "react-router"
import { AppRoutes } from "./routes/AppRoutes"
import { CampaignProvider } from './context/CampaignContext'

function App() {

  return (
    <BrowserRouter>
      <CampaignProvider>
        <AppRoutes />
      </CampaignProvider>
    </BrowserRouter>
  )
}

export default App
