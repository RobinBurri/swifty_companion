import React, {
  createContext,
  ReactNode,
  useEffect,
  useRef,
  useState,
} from 'react'
import { LOG_TOKEN } from '../constants/tokenLog'
import Token from '../models/Token'
import getAccessToken from '../utils/getAccessToken'

type AuthContextType = {
    token: Token | null
    setToken: (token: Token) => void
    getToken: () => Token | null
    isLoading: boolean
}

type AuthContextProviderProps = {
    children: ReactNode
}

export const AuthContext = createContext<AuthContextType | undefined>(undefined)

export const AuthContextProvider = ({ children }: AuthContextProviderProps) => {
    const [authToken, setAuthToken] = useState<Token | null>(null)
    const [isLoading, setIsLoading] = useState(true)
    const intervalRef = useRef<NodeJS.Timeout | null>(null)
    // Load the token for the first time
    useEffect(() => {
        async function loadToken() {
            try {
                const token = await getAccessToken()
                if (token) {
                    setAuthToken(token)
                    if (LOG_TOKEN) {
                        console.log('Token loaded:', token.getToken())
                        console.log('Token expires in:', token.getExpiresIn())
                    }
                }
            } catch (error) {
                console.error('Failed to load access token:', error)
            } finally {
                setIsLoading(false)
            }
        }
        loadToken()
    }, [getAccessToken, setAuthToken])

    // Check if the token is expiring soon and refresh it
    useEffect(() => {
        const checkAndRefreshToken = async () => {
            if (authToken && authToken.isTokenExpiringSoon()) {
                try {
                    const token = await getAccessToken()
                    if (token) {
                        setAuthToken(token)
                        if (LOG_TOKEN) {
                            console.log('Token refreshed:', token.getToken())
                        }
                    }
                } catch (error) {
                    console.error('Error refreshing token:', error)
                }
            }
        }

        const startTokenCheckInterval = () => {
            if (authToken) {
                intervalRef.current = setInterval(() => {
                    checkAndRefreshToken()
                }, 10000)
            }
        }

        if (!isLoading) {
            startTokenCheckInterval()
        }

        return () => {
            if (intervalRef.current) {
                clearInterval(intervalRef.current)
            }
        }
    }, [authToken, isLoading])

    const value = {
        token: authToken,
        setToken: (token: Token) => setAuthToken(token),
        getToken: () => authToken,
        isLoading,
    }

    return <AuthContext.Provider value={value}>{children}</AuthContext.Provider>
}
