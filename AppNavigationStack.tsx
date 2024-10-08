import { createNativeStackNavigator } from '@react-navigation/native-stack'
import React from 'react'
import { GlobalStyles } from './constants/styles'
import DetailScreen from './screens/DetailScreen'
import SearchScreen from './screens/SearchScreen'

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
            <Stack.Screen
                name="Search"
                component={SearchScreen}
                options={{
                    title: 'Search Students',
                    headerTitleAlign: 'center',
                }}
            />
            <Stack.Screen
                name="Detail"
                component={DetailScreen as never}
                options={{
                    title: 'Student Details',
                    headerBackTitle: 'Search',
                    headerTitleAlign: 'center',
                }}
            />
        </Stack.Navigator>
    )
}
