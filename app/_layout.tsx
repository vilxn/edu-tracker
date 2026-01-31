// app/_layout.tsx
import { Stack } from 'expo-router';

export default function RootLayout() {
    const isAuthenticated = false;


    if(isAuthenticated) {
        return(
            <Stack screenOptions={{ headerShown: false }}>
                <Stack.Screen name="tabs" options={{ headerShown: false }} />
            </Stack>
        );
    } else{
        return (
            <Stack screenOptions={{ headerShown: false }}>
                <Stack.Screen name="auth" options={{ headerShown: false }} />
            </Stack>
        )
    }

}

