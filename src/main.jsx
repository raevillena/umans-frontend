import { StrictMode } from 'react'
import { createRoot } from 'react-dom/client'
import { Provider } from "react-redux";
import { store } from "./store/store";
import { ThemeProvider } from "@mui/material/styles";
import CssBaseline from "@mui/material/CssBaseline";
import theme from "./styles/theme";
import './index.css'
import App from './App.jsx'
import AppTheme from './shared-theme/AppTheme';
import { GoogleOAuthProvider } from "@react-oauth/google";
import AlertSnackbar from './components/AlertSnackbar.jsx';


createRoot(document.getElementById('root')).render(
  <StrictMode>
    <GoogleOAuthProvider clientId={import.meta.env.VITE_GOOGLE_CLIENT_ID}>
      <Provider store={store}>
        <ThemeProvider theme={theme}>
          <AppTheme>
            <CssBaseline />
            <AlertSnackbar />
            <App />
          </AppTheme>
        </ThemeProvider>
      </Provider>
    </GoogleOAuthProvider>
  </StrictMode>,
)
