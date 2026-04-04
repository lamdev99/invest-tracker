import React from 'react';
import { createBottomTabNavigator } from '@react-navigation/bottom-tabs';
import { NavigationContainer } from '@react-navigation/native';
import { Home, PiggyBank, TrendingUp, Coins } from 'lucide-react-native';
import { useTranslation } from 'react-i18next';

// Placeholder Screens
import { DashboardScreen } from '../modules/dashboard/DashboardScreen';
import { SavingsScreen } from '../modules/savings/SavingsScreen';
import { StocksScreen } from '../modules/stocks/StocksScreen';
import { GoldScreen } from '../modules/gold/GoldScreen';
import { colors } from '../theme/colors';

const Tab = createBottomTabNavigator();

export const RootNavigation = () => {
  const { t } = useTranslation();

  return (
    <NavigationContainer>
      <Tab.Navigator
        screenOptions={{
          tabBarActiveTintColor: colors.primary,
          tabBarInactiveTintColor: colors.secondary,
          headerStyle: { backgroundColor: colors.surface },
          headerTitleStyle: { color: colors.text },
        }}
      >
        <Tab.Screen
          name="Dashboard"
          component={DashboardScreen}
          options={{
            title: t('navigation.dashboard'),
            tabBarIcon: ({ color, size }) => <Home color={color} size={size} />,
          }}
        />
        <Tab.Screen
          name="Savings"
          component={SavingsScreen}
          options={{
            title: t('navigation.savings'),
            tabBarIcon: ({ color, size }) => <PiggyBank color={color} size={size} />,
          }}
        />
        <Tab.Screen
          name="Stocks"
          component={StocksScreen}
          options={{
            title: t('navigation.stocks'),
            tabBarIcon: ({ color, size }) => <TrendingUp color={color} size={size} />,
          }}
        />
        <Tab.Screen
          name="Gold"
          component={GoldScreen}
          options={{
            title: t('navigation.gold'),
            tabBarIcon: ({ color, size }) => <Coins color={color} size={size} />,
          }}
        />
      </Tab.Navigator>
    </NavigationContainer>
  );
};
