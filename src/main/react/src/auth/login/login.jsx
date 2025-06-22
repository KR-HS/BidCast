import React from 'react'
import { createRoot } from 'react-dom/client'
import App from './App'
import './Login.css'
import {GoogleOAuthProvider} from "@react-oauth/google";

const root = createRoot(document.getElementById('root'))
root.render(
    <GoogleOAuthProvider clientId="516264105219-ntn0f7gam2ea9i3lqtt7mjffakjpod51.apps.googleusercontent.com">
    <App />
    </GoogleOAuthProvider>
)
