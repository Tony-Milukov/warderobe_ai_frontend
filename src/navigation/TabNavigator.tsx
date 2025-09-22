import React from 'react';
import { TouchableOpacity, Alert } from 'react-native';
import { createBottomTabNavigator } from '@react-navigation/bottom-tabs';
import { Ionicons } from '@expo/vector-icons';
import { useTheme } from '@/hooks';
import { useAuthStore } from '@/store';

// Import screens (we'll create these next)
import WardrobeScreen from '@/screens/WardrobeScreen';
import AddItemScreen from '@/screens/AddItemScreen';
import GenerateOutfitScreen from '@/screens/GenerateOutfitScreen';

export type TabParamList = {
  Wardrobe: undefined;
  AddItem: undefined;
  GenerateOutfit: undefined;
};

const Tab = createBottomTabNavigator<TabParamList>();

export const TabNavigator: React.FC = () => {
  const { theme } = useTheme();
  const { logout } = useAuthStore();

  const handleLogout = () => {
    Alert.alert('Sign Out', 'Are you sure you want to sign out?', [
      { text: 'Cancel', style: 'cancel' },
      { text: 'Sign Out', style: 'destructive', onPress: () => logout() },
    ]);
  };

  const LogoutButton = () => (
    <TouchableOpacity
      onPress={handleLogout}
      style={{ marginRight: 16, padding: 8 }}
    >
      <Ionicons name="log-out-outline" size={24} color={theme.colors.text} />
    </TouchableOpacity>
  );

  return (
    <Tab.Navigator
      screenOptions={({ route }) => ({
        tabBarIcon: ({ focused, color, size }) => {
          let iconName: keyof typeof Ionicons.glyphMap;

          if (route.name === 'Wardrobe') {
            iconName = focused ? 'shirt' : 'shirt-outline';
          } else if (route.name === 'AddItem') {
            iconName = focused ? 'camera' : 'camera-outline';
          } else if (route.name === 'GenerateOutfit') {
            iconName = focused ? 'sparkles' : 'sparkles-outline';
          } else {
            iconName = 'help-outline';
          }

          return <Ionicons name={iconName} size={size} color={color} />;
        },
        tabBarActiveTintColor: theme.colors.primary,
        tabBarInactiveTintColor: theme.colors.textSecondary,
        tabBarStyle: {
          backgroundColor: theme.colors.background,
          borderTopColor: theme.colors.border,
          borderTopWidth: 1,
          height: 60,
          paddingBottom: 8,
          paddingTop: 8,
        },
        headerStyle: {
          backgroundColor: theme.colors.background,
          borderBottomColor: theme.colors.border,
          borderBottomWidth: 1,
        },
        headerTintColor: theme.colors.text,
        headerTitleStyle: {
          fontWeight: '600',
        },
      })}
    >
      <Tab.Screen
        name="Wardrobe"
        component={WardrobeScreen}
        options={{
          title: 'My Wardrobe',
          headerRight: () => <LogoutButton />,
        }}
      />
      <Tab.Screen
        name="AddItem"
        component={AddItemScreen}
        options={{
          title: 'Add Item',
        }}
      />
      <Tab.Screen
        name="GenerateOutfit"
        component={GenerateOutfitScreen}
        options={{
          title: 'Generate Outfit',
        }}
      />
    </Tab.Navigator>
  );
};
