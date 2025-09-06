import "./index.css";
import "@fontsource/roboto/300.css";
import "@fontsource/roboto/400.css";
import "@fontsource/roboto/500.css";
import "@fontsource/roboto/700.css";

// Configure dayjs with timezone support
import dayjs from "dayjs";
import relativeTime from "dayjs/plugin/relativeTime";
import timezone from "dayjs/plugin/timezone";
import utc from "dayjs/plugin/utc";

dayjs.extend(utc);
dayjs.extend(timezone);
dayjs.extend(relativeTime);

// Set default timezone
const DEFAULT_TIMEZONE = "Asia/Manila";
dayjs.tz.setDefault(DEFAULT_TIMEZONE);

import {
  AUTH0_AUDIENCE,
  AUTH0_CLIENT_ID,
  AUTH0_DOMAIN,
  AUTH0_REDIRECT_URL,
  AUTH0_SCOPE,
} from "@auth/constants/auth";
import { Auth0Provider } from "@auth0/auth0-react";
import { CssBaseline } from "@mui/material";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { ReactQueryDevtools } from "@tanstack/react-query-devtools";
import React from "react";
import ReactDOM from "react-dom/client";

import App from "./App.tsx";
import ThemeContextProvider from "./components/ThemeContextProvider.tsx";
import ToolbarContextProvider from "./components/ToolbarContextProvider.tsx";
import { TimezoneProvider } from "./modules/shared/contexts/TimezoneContext.tsx";
const queryClient = new QueryClient();

ReactDOM.createRoot(document.getElementById("root")!).render(
  <React.StrictMode>
    <ThemeContextProvider>
      <CssBaseline />
      <Auth0Provider
        domain={AUTH0_DOMAIN}
        clientId={AUTH0_CLIENT_ID}
        authorizationParams={{
          redirect_uri: AUTH0_REDIRECT_URL,
          audience: AUTH0_AUDIENCE,
          scope: AUTH0_SCOPE,
        }}
        cacheLocation="localstorage"
      >
        <QueryClientProvider client={queryClient}>
          <TimezoneProvider>
            <ToolbarContextProvider>
              <App />
            </ToolbarContextProvider>
          </TimezoneProvider>
          <ReactQueryDevtools initialIsOpen={false} />
        </QueryClientProvider>
      </Auth0Provider>
    </ThemeContextProvider>
  </React.StrictMode>,
);
