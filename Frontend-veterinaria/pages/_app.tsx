import React from 'react'
import type { AppProps } from 'next/app'
import { Auth0Provider } from '@auth0/auth0-react'
import '../styles/globals.css'
import { auth0Config } from '../src/config/auth0'

export default function App({ Component, pageProps }: AppProps) {
    return (
        <Auth0Provider
            domain={auth0Config.domain}
            clientId={auth0Config.clientId}
            authorizationParams={{
                redirect_uri: typeof window !== 'undefined' ? window.location.origin : '',
                audience: auth0Config.audience,
                scope: auth0Config.scope
            }}
        >
            <Component {...pageProps} />
        </Auth0Provider>
    )
} 