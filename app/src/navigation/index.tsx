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

import {
  GoldStackParamList,
  StocksStackParamList,
  SavingsStackParamList,
  RootTabParamList
} from './types';

const Tab = createBottomTabNavigator<RootTabParamList>();
const SavingsStackNav = createNativeStackNavigator<SavingsStackParamList>();
const StocksStackNav = createNativeStackNavigator<StocksStackParamList>();
const GoldStackNav = createNativeStackNavigator<GoldStackParamList>();

const SavingsStack = () => {
  const { t } = useTranslation();
  return (
    <SavingsStackNav.Navigator
      screenOptions={{
        headerStyle: { backgroundColor: colors.surface },
        headerTitleStyle: { color: colors.text },
        headerTintColor: colors.primary,
      }}
    >
      <SavingsStackNav.Screen
        name="SavingsList"
        component={SavingsScreen}
        options={{ title: t('navigation.savings') }}
      />
      <SavingsStackNav.Screen
        name="DepositDetail"
        component={DepositDetailScreen as any}
        options={{ title: 'Deposit Details' }}
      />
      <SavingsStackNav.Screen
        name="AddEditDeposit"
        component={AddEditDepositScreen as any}
        options={({ route }: any) => ({
          title: route.params?.depositId ? 'Edit Deposit' : 'Add Deposit'
        })}
      />
    </SavingsStackNav.Navigator>
  );
};

const StocksStack = () => {
  const { t } = useTranslation();
  return (
    <StocksStackNav.Navigator
      screenOptions={{
        headerStyle: { backgroundColor: colors.surface },
        headerTitleStyle: { color: colors.text },
        headerTintColor: colors.primary,
      }}
    >
      <StocksStackNav.Screen
        name="StockList"
        component={StocksScreen}
        options={{ title: t('navigation.stocks') }}
      />
      <StocksStackNav.Screen
        name="StockDetail"
        component={StockDetailScreen as any}
        options={{ title: 'Stock Details' }}
      />
      <StocksStackNav.Screen
        name="AddEditStock"
        component={AddEditStockScreen as any}
        options={({ route }: any) => ({
          title: route.params?.positionId ? 'Edit Position' : 'Add Position'
        })}
      />
    </StocksStackNav.Navigator>
  );
};

const GoldStack = () => {

  const { t } = useTranslation();
  return (
    <GoldStackNav.Navigator
      screenOptions={{
        headerStyle: { backgroundColor: colors.surface },
        headerTitleStyle: { color: colors.text },
        headerTintColor: colors.primary,
      }}
    >
      <GoldStackNav.Screen
        name="GoldList"
        component={GoldScreen}
        options={{ title: t('navigation.gold') }}
      />
      <GoldStackNav.Screen
        name="GoldDetail"
        component={GoldDetailScreen}
        options={{ title: 'Gold Details' }}
      />
      <GoldStackNav.Screen
        name="AddEditGold"
        component={AddEditGoldScreen}
        options={({ route }: any) => ({
          title: route.params?.holdingId ? 'Edit Gold Holding' : 'Add Gold Holding'
        })}
      />
    </GoldStackNav.Navigator>
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
