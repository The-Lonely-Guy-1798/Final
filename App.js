// File: App.js
import React, { useEffect, useState, createContext, useContext, Suspense } from 'react';
import { NavigationContainer, DefaultTheme, DarkTheme } from '@react-navigation/native';
import { createBottomTabNavigator } from '@react-navigation/bottom-tabs';
import { createNativeStackNavigator } from '@react-navigation/native-stack';
import { TransitionPresets } from '@react-navigation/stack';
import { Ionicons } from '@expo/vector-icons';
import AsyncStorage from '@react-native-async-storage/async-storage';
import NetInfo from '@react-native-community/netinfo';

const SplashScreen = React.lazy(() => import('./screens/SplashScreen'));
const HomeScreen = React.lazy(() => import('./screens/HomeScreen'));
const HavenScreen = React.lazy(() => import('./screens/HavenScreen'));
const BitcoinScreen = React.lazy(() => import('./screens/BitcoinScreen'));
const UserScreen = React.lazy(() => import('./screens/UserScreen'));
const OfflineScreen = () => (
  <React.Fragment>
    <SplashScreen />
    <OfflineBanner />
  </React.Fragment>
);

const Tab = createBottomTabNavigator();
const Stack = createNativeStackNavigator();
export const ThemeContext = createContext();

function MainTabs() {
  const { isDark } = useContext(ThemeContext);

  return (
    <Tab.Navigator
      lazy={true}
      screenOptions={({ route }) => ({
        headerShown: false,
        tabBarStyle: {
          backgroundColor: isDark ? '#000' : '#fff',
          borderTopColor: isDark ? '#222' : '#ccc',
        },
        tabBarActiveTintColor: isDark ? '#fff' : '#000',
        tabBarInactiveTintColor: isDark ? '#888' : '#999',
        tabBarIcon: ({ color, size }) => {
          let iconName;
          if (route.name === 'Home') iconName = 'home-outline';
          else if (route.name === 'Haven') iconName = 'book-outline';
          else if (route.name === 'Bitcoin') iconName = 'logo-bitcoin';
          else if (route.name === 'Profile') iconName = 'person-outline';
          return <Ionicons name={iconName} size={size} color={color} />;
        },
      })}
    >
      <Tab.Screen name="Home" component={HomeScreen} />
      <Tab.Screen name="Haven" component={HavenScreen} />
      <Tab.Screen name="Bitcoin" component={BitcoinScreen} />
      <Tab.Screen name="Profile" component={UserScreen} />
    </Tab.Navigator>
  );
}

function OfflineBanner() {
  return (
    <View style={{ position: 'absolute', top: 40, alignSelf: 'center', backgroundColor: '#e74c3c', padding: 10, borderRadius: 6 }}>
      <Text style={{ color: '#fff', fontWeight: 'bold' }}>No Internet Connection</Text>
    </View>
  );
}

export default function App() {
  const [isLoading, setIsLoading] = useState(true);
  const [isDark, setIsDark] = useState(false);
  const [isOffline, setIsOffline] = useState(false);

  useEffect(() => {
    const checkTheme = async () => {
      const stored = await AsyncStorage.getItem('theme');
      setIsDark(stored === 'dark');
    };
    checkTheme();

    const unsubscribe = NetInfo.addEventListener((state) => {
      setIsOffline(!state.isConnected);
    });

    const timer = setTimeout(() => setIsLoading(false), 2000);
    return () => {
      unsubscribe();
      clearTimeout(timer);
    };
  }, []);

  return (
    <ThemeContext.Provider value={{ isDark, setIsDark }}>
      <NavigationContainer theme={isDark ? DarkTheme : DefaultTheme}>
        <Suspense fallback={null}>
          <Stack.Navigator screenOptions={{ headerShown: false, ...TransitionPresets.FadeFromBottomAndroid }}>
            {isLoading ? (
              <Stack.Screen name="Splash" component={SplashScreen} />
            ) : isOffline ? (
              <Stack.Screen name="Offline" component={OfflineScreen} />
            ) : (
              <Stack.Screen name="Main" component={MainTabs} />
            )}
          </Stack.Navigator>
        </Suspense>
      </NavigationContainer>
    </ThemeContext.Provider>
  );
}
