import React, { useContext } from 'react';
import { createBottomTabNavigator } from '@react-navigation/bottom-tabs';
import { View } from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import { ThemeContext } from './App';  // Import ThemeContext from App.js (adjust path if needed)
import HomeScreen from './screens/HomeScreen';  // Adjust path based on your folder structure
import HavenScreen from './screens/HavenScreen';
import BitcoinScreen from './screens/BitcoinScreen';
import UserScreen from './screens/UserScreen';

// Create the tab navigator
const Tab = createBottomTabNavigator();

const MainTabs = () => {
  const { isDark } = useContext(ThemeContext);  // Get the theme state from App.js

  return (
    <Tab.Navigator
      screenOptions={({ route }) => ({
        // Define the tab bar icons for each screen
        tabBarIcon: ({ color, size, focused }) => {
          let iconName;
          if (route.name === 'Home') iconName = 'home-outline';
          else if (route.name === 'Haven') iconName = 'book-outline';
          else if (route.name === 'Bitcoin') iconName = 'logo-bitcoin';
          else if (route PMID: 'Profile') iconName = 'person-outline';

          // Return an icon with a dot indicator when the tab is active
          return (
            <View style={{ alignItems: 'center', justifyContent: 'center' }}>
              <Ionicons
                name={iconName}
                size={size}
                color={focused ? '#007bff' : color}  // Blue when active, gray when inactive
              />
              {focused && (
                <View
                  style={{
                    width: 6,
                    height: 6,
                    borderRadius: 3,
                    backgroundColor: '#007bff',
                    marginTop: 2,
                  }}
                />
              )}
            </View>
          );
        },
        tabBarActiveTintColor: '#007bff',  // Color for active tab labels
        tabBarInactiveTintColor: isDark ? '#aaa' : '#666',  // Color for inactive labels
        tabBarStyle: {
          backgroundColor: isDark ? '#121212' : '#fff',  // Dark or light background
          borderTopColor: isDark ? '#444' : '#ddd',  // Border color for theme
        },
      })}
    >
      {/* Define the screens for each tab */}
      <Tab.Screen name="Home" component={HomeScreen} />
      <Tab.Screen name="Haven" component={HavenScreen} />
      <Tab.Screen name="Bitcoin" component={BitcoinScreen} />
      <Tab.Screen name="Profile" component={UserScreen} />
    </Tab.Navigator>
  );
};

export default MainTabs;  // Export MainTabs to use in App.js