import React, {
  createContext,
  ReactNode,
  useCallback,
  useEffect,
  useRef,
  useState,
} from 'react'
import { Alert } from 'react-native'
import { LOG_TOKEN } from '../constants/tokenLog'
import Token from '../models/Token'
import getAccessToken from '../utils/getAccessToken'

type AuthContextType = {
    token: Token
    setToken: (token: Token) => void
    getToken: () => Token
    isLoading: boolean
    isError: boolean
    retryAuth: () => Promise<void>
}

type AuthContextProviderProps = {
    children: ReactNode
}

const placeholderToken = new Token(
  'placeholder',
  'Bearer',
  3,
  Date.now(),
  'private',
  5
)

const defaultAuthContext: AuthContextType = {
  token: placeholderToken,
  setToken: () => {},
  getToken: () => placeholderToken,
  isLoading: false,
  isError: false,
  retryAuth: async () => Promise.resolve(),
};

export const AuthContext = createContext<AuthContextType>(defaultAuthContext)

export const AuthContextProvider = ({ children }: AuthContextProviderProps) => {
    
    const [authToken, setAuthToken] = useState<Token>(placeholderToken)
    const [isLoading, setIsLoading] = useState(true)
    const [isError, setIsError] = useState(false)
    const intervalRef = useRef<NodeJS.Timeout | null>(null)

    const loadToken = useCallback(async () => {
        setIsLoading(true)
        setIsError(false)
        try {
            const token = await getAccessToken()
            if (token) {
                setAuthToken(token)
                if (LOG_TOKEN) {
                    console.log('Token loaded:', token.getToken())
                    console.log('Token expires in:', token.getExpiresIn())
                }
            } else {
                throw new Error('Failed to get access token')
            }
        } catch (error) {
            console.error('Failed to load access token:', error)
            setIsError(true)
            Alert.alert(
                'Authentication Error',
                'Failed to get access token. Please check your credentials and try again.',
                [{ text: 'OK' }]
            )
        } finally {
            setIsLoading(false)
        }
    }, [])

    // Load the token for the first time
    useEffect(() => {
        loadToken()
    }, [loadToken])

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
                    } else {
                        throw new Error('Failed to refresh token')
                    }
                } catch (error) {
                    console.error('Error refreshing token:', error)
                    setIsError(true)
                    Alert.alert(
                        'Authentication Error',
                        'Failed to refresh the access token. Please try to authenticate again.',
                        [{ text: 'OK' }]
                    )
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

        if (!isLoading && !isError) {
            startTokenCheckInterval()
        }

        return () => {
            if (intervalRef.current) {
                clearInterval(intervalRef.current)
            }
        }
    }, [authToken, isLoading, isError])

    const retryAuth = useCallback(async () => {
        await loadToken()
    }, [loadToken])

    const value = {
        token: authToken,
        setToken: (token: Token) => setAuthToken(token),
        getToken: () => authToken,
        isLoading,
        isError,
        retryAuth,
    }

    return <AuthContext.Provider value={value}>{children}</AuthContext.Provider>
}
