import { createNativeStackNavigator } from '@react-navigation/native-stack'
import { GlobalStyles } from './constants/styles'
import DetailScreen from './screens/DetailScreen'
import SearchScreen from './screens/SearchScreen'
import { StudentsContextProvider } from './store/student-context'

const Stack = createNativeStackNavigator()

export default function AppNavigationStack() {
    return (
        <Stack.Navigator
            screenOptions={{
                headerStyle: {
                    backgroundColor: GlobalStyles.colors.darkGreen,
                },
                headerTintColor: GlobalStyles.colors.beige,
                contentStyle: {
                    backgroundColor: GlobalStyles.colors.lightGreen,
                },
                headerTitleStyle: {
                    fontWeight: 'bold',
                },
            }}
        >
            <StudentsContextProvider>
                <Stack.Screen
                    name="Search"
                    component={SearchScreen}
                    options={{
                        title: 'Search Students',
                    }}
                />
            </StudentsContextProvider>
            <Stack.Screen
                name="Detail"
                component={DetailScreen}
                options={{
                    title: 'Student Details',
                }}
            />
        </Stack.Navigator>
    )
}
