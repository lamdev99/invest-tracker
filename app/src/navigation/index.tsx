import React from 'react';
import { createBottomTabNavigator } from '@react-navigation/bottom-tabs';
import { NavigationContainer } from '@react-navigation/native';
import { SafeAreaProvider } from 'react-native-safe-area-context';

import { Home, PiggyBank, TrendingUp, Coins } from 'lucide-react-native';
import { useTranslation } from 'react-i18next';

import { createNativeStackNavigator } from '@react-navigation/native-stack';

// Placeholder Screens
import { DashboardScreen } from '../modules/dashboard/DashboardScreen';
import { SavingsScreen } from '../modules/savings/SavingsScreen';
import { DepositDetailScreen } from '../modules/savings/DepositDetailScreen';
import { AddEditDepositScreen } from '../modules/savings/AddEditDepositScreen';
import { StocksScreen } from '../modules/stocks/StocksScreen';
import { StockDetailScreen } from '../modules/stocks/StockDetailScreen';
import { AddEditStockScreen } from '../modules/stocks/AddEditStockScreen';
import { GoldScreen } from '../modules/gold/GoldScreen';
import { GoldDetailScreen } from '../modules/gold/GoldDetailScreen';
import { AddEditGoldScreen } from '../modules/gold/AddEditGoldScreen';
import { colors } from '../theme/colors';

const Tab = createBottomTabNavigator();
const Stack = createNativeStackNavigator();

const SavingsStack = () => {
  const { t } = useTranslation();
  return (
    <Stack.Navigator
      screenOptions={{
        headerStyle: { backgroundColor: colors.surface },
        headerTitleStyle: { color: colors.text },
        headerTintColor: colors.primary,
      }}
    >
      <Stack.Screen 
        name="SavingsList" 
        component={SavingsScreen} 
        options={{ title: t('navigation.savings') }} 
      />
      <Stack.Screen 
        name="DepositDetail" 
        component={DepositDetailScreen} 
        options={{ title: 'Deposit Details' }} 
      />
      <Stack.Screen 
        name="AddEditDeposit" 
        component={AddEditDepositScreen} 
        options={({ route }: any) => ({ 
          title: route.params?.depositId ? 'Edit Deposit' : 'Add Deposit' 
        })} 
      />
    </Stack.Navigator>
  );
};

const StocksStack = () => {
  const { t } = useTranslation();
  return (
    <Stack.Navigator
      screenOptions={{
        headerStyle: { backgroundColor: colors.surface },
        headerTitleStyle: { color: colors.text },
        headerTintColor: colors.primary,
      }}
    >
      <Stack.Screen 
        name="StockList" 
        component={StocksScreen} 
        options={{ title: t('navigation.stocks') }} 
      />
      <Stack.Screen 
        name="StockDetail" 
        component={StockDetailScreen} 
        options={{ title: 'Stock Details' }} 
      />
      <Stack.Screen 
        name="AddEditStock" 
        component={AddEditStockScreen} 
        options={({ route }: any) => ({ 
          title: route.params?.positionId ? 'Edit Position' : 'Add Position' 
        })} 
      />
    </Stack.Navigator>
  );
};

const GoldStack = () => {

  const { t } = useTranslation();
  return (
    <Stack.Navigator
      screenOptions={{
        headerStyle: { backgroundColor: colors.surface },
        headerTitleStyle: { color: colors.text },
        headerTintColor: colors.primary,
      }}
    >
      <Stack.Screen 
        name="GoldList" 
        component={GoldScreen} 
        options={{ title: t('navigation.gold') }} 
      />
      <Stack.Screen 
        name="GoldDetail" 
        component={GoldDetailScreen} 
        options={{ title: 'Gold Details' }} 
      />
      <Stack.Screen 
        name="AddEditGold" 
        component={AddEditGoldScreen} 
        options={({ route }: any) => ({ 
          title: route.params?.holdingId ? 'Edit Gold Holding' : 'Add Gold Holding' 
        })} 
      />
    </Stack.Navigator>
  );
};

export const RootNavigation = () => {
  const { t } = useTranslation();

  return (
    <SafeAreaProvider>
      <NavigationContainer>
        <Tab.Navigator
          screenOptions={{
            tabBarActiveTintColor: colors.primary,
            tabBarInactiveTintColor: colors.secondary,
            headerShown: false,
          }}
        >
          <Tab.Screen
            name="DashboardTab"
            component={DashboardScreen}
            options={{
              title: t('navigation.dashboard'),
              tabBarIcon: ({ color, size }) => <Home color={color} size={size} />,
              headerShown: true, // Show header for dashboard
              headerTitle: t('dashboard.title') || 'InvestTracker',
            }}
          />
          <Tab.Screen
            name="SavingsTab"
            component={SavingsStack}
            options={{
              title: t('navigation.savings'),
              tabBarIcon: ({ color, size }) => <PiggyBank color={color} size={size} />,
            }}
          />
          <Tab.Screen
            name="StocksTab"
            component={StocksStack}
            options={{
              title: t('navigation.stocks'),
              tabBarIcon: ({ color, size }) => <TrendingUp color={color} size={size} />,
            }}
          />
          <Tab.Screen
            name="GoldTab"
            component={GoldStack}
            options={{
              title: t('navigation.gold'),
              tabBarIcon: ({ color, size }) => <Coins color={color} size={size} />,
            }}
          />
        </Tab.Navigator>
      </NavigationContainer>
    </SafeAreaProvider>
  );
};
