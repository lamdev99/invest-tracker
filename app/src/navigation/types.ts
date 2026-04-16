import { NavigatorScreenParams } from '@react-navigation/native';

export type GoldStackParamList = {
    GoldList: undefined;
    GoldDetail: { holdingId: string };
    AddEditGold: { holdingId?: string };
};

export type StocksStackParamList = {
    StockList: undefined;
    StockDetail: { positionId: string };
    AddEditStock: { positionId?: string };
};

export type SavingsStackParamList = {
    SavingsList: undefined;
    DepositDetail: { depositId: string };
    AddEditDeposit: { depositId?: string };
};

export type RootTabParamList = {
    DashboardTab: undefined;
    SavingsTab: NavigatorScreenParams<SavingsStackParamList>;
    StocksTab: NavigatorScreenParams<StocksStackParamList>;
    GoldTab: NavigatorScreenParams<GoldStackParamList>;
};
