import { Tabs } from 'expo-router';
import { Platform, useColorScheme } from 'react-native';
import Ionicons from '@expo/vector-icons/Ionicons';
import { Colors } from '@/constants/theme';

export default function TabsLayout() {
    const colorScheme = useColorScheme();
    const colors = Colors[colorScheme || 'light'];

    return (
        <Tabs screenOptions={{
            headerShown: false,
            tabBarPosition: Platform.OS === 'web' ? 'left' : 'bottom',
            tabBarStyle: Platform.OS === 'web' ? {
                width: 60,
                minWidth: 60,
                maxWidth: 60,
                backgroundColor: colors.background,
                alignItems: 'center',
                justifyContent: 'center',
                gap: 25,
                borderRightWidth: 1,
                borderRightColor: colorScheme === 'dark' ? '#333' : '#d8d8d8',
            } : {
                width: '100%',
                backgroundColor: colors.background,
            },
            tabBarLabelStyle: {
                display: 'none',
            },
            tabBarItemStyle: Platform.OS === 'web' ? {
                minWidth: 60,
                maxWidth: 60,
                width: 60,
                height: 60,
                justifyContent: 'center',
                alignItems: 'center',
            } : {},
            tabBarActiveTintColor: colors.tabIconSelected,
            tabBarInactiveTintColor: colors.tabIconDefault,
        }}>
            <Tabs.Screen name="index" options={{
                title: '',
                tabBarIcon: ({color, focused}) =>(
                    <Ionicons
                        name={focused ? 'home-sharp' : 'home-outline'}
                        color={color}
                        size={28}
                    />
                )
            }}/>
            <Tabs.Screen name="shanyraks" options={{
                title: '',
                tabBarIcon: ({color, focused}) =>(
                    <Ionicons
                        name={focused ? 'aperture-sharp' : 'aperture-outline'}
                        color={color}
                        size={28}
                    />
                )
            }}/>
            <Tabs.Screen name="events" options={{
                title: '',
                tabBarIcon: ({color, focused}) =>(
                    <Ionicons
                        name={focused ? 'people-sharp' : 'people-outline'}
                        color={color}
                        size={28}
                    />
                )
            }}/>
            <Tabs.Screen name="projects" options={{
                title: '',
                tabBarIcon: ({color, focused}) =>(
                    <Ionicons
                        name={focused ? 'bulb-sharp' : 'bulb-outline'}
                        color={color}
                        size={28}
                    />
                )
            }}/>
            <Tabs.Screen name="goals" options={{
                title: '',
                tabBarIcon: ({color, focused}) =>(
                    <Ionicons
                        name={focused ? 'calendar-sharp' : 'calendar-outline'}
                        color={color}
                        size={28}
                    />
                )
            }}/>
            <Tabs.Screen
                name="search-team/searchTeam"
                options={{
                    href: null,
                }}
            />
        </Tabs>
    );
}