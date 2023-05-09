import { useContext, useState, useEffect } from "react";
import { FlatList, View } from "react-native";
import { Text, Caption } from "react-native-paper";

import { AccountContext } from "../../context/AccountContext";
import {
    Transactions as ITransaction,
    Categories as ICategory,
    HabitCategories as IHabitCategory
} from "../../types/entities";

import { ScreenContainer } from "../../components/layout/ScreenContainer";
import { VerticalContainer } from "../../components/layout/VerticalContainer";
import { HorizontalContainer } from "../../components/layout/HorizontalContainer";
import { CategoryIconTabs } from "../../components/tabs/CategoryIconTabs";
import { TransactionalItem } from "../../components/list/items/TransactionalItem";
import CurrentPeriodSummary from "../../components/summary/CurrentPeriodSummary";
import HabitModal from "../../components/modals/HabitModal";

export const Expenses = ({ route }: { route: any }) => {
    const { selectedCategoryId }: { selectedCategoryId: string } = route.params;
    const { monthlySummary, getCategories, getConsideredMonth, getHabitCategories, state } = useContext(AccountContext);
    const [activeIconTab, setActiveIconTab] = useState<string>(selectedCategoryId);
    const [transactions, setTransactions] = useState<Array<ITransaction>>([]);

    const [isModalVisible, setIsModalVisible] = useState<boolean>(false);
    const [transactionInFocus, setTransactionInFocus] = useState<ITransaction>({} as ITransaction);
    const [associatedHabit, setAssociatedHabit] = useState<IHabitCategory>({} as IHabitCategory);
    const [checkedHabit, setCheckedHabit] = useState<string>("");
    const [hasChanges, setHasChanges] = useState<boolean>(false);

    const categories: Array<ICategory> = JSON.parse(JSON.stringify(getCategories()));
    if (!categories.find((category: ICategory) => category.ID === "ALL")) {
        categories.unshift({ ID: "ALL", description: "All", icon: "apps" } as ICategory);
    }

    useEffect(() => {
        let transactions: ITransaction[] = [];
        activeIconTab === "ALL"
            ? (transactions = monthlySummary.transactionSummary?.transactions)
            : (transactions = monthlySummary.categorizedSummary[activeIconTab]?.transactions);

        setTransactions(
            transactions.sort(
                (a: ITransaction, b: ITransaction) => new Date(b.date).getDate() - new Date(a.date).getDate()
            )
        );
    }, [activeIconTab, getConsideredMonth]);

    useEffect(() => {
        // ensure transaction is not just empty object ({})
        if (Object.keys(transactionInFocus).length > 0) {
            const habit = findAssociatedHabit(transactionInFocus);
            if (habit) {
                setAssociatedHabit(habit);
                setCheckedHabit(getInitialHabit(transactionInFocus, habit));
            }
        }
    }, [transactionInFocus]);

    const enableHabits = (transaction: ITransaction): boolean => {
        const habit = findAssociatedHabit(transaction);
        return habit !== null;
    };

    const findAssociatedHabit = (transaction: ITransaction): IHabitCategory | null => {
        const habits = getHabitCategories();
        for (const habit of habits) {
            const mcc = habit.mccs.find((current) => current.mcc_ID === transaction.mcc_ID);
            if (mcc) return habit;
        }
        return null;
    };

    const editHabit = (transaction: ITransaction) => {
        setIsModalVisible(true);
        setTransactionInFocus(transaction);
    };

    const resetState = () => {
        setTransactionInFocus({} as ITransaction);
        setAssociatedHabit({} as IHabitCategory);
        setCheckedHabit("");
        setHasChanges(false);
    };

    const renderItem = ({ item }: { item: ITransaction }) => {
        return <TransactionalItem item={item} enableHabits={enableHabits(item)} editHabit={editHabit} />;
    };

    const getInitialHabit = (transaction: ITransaction, associatedHabit: IHabitCategory): string => {
        const accountHabits = state.habits;
        let accountHabit = null;
        for (const ah of accountHabits) {
            if (ah.habits?.habitCategory_ID === associatedHabit.ID) accountHabit = ah;
            if (ah.transaction_ID === transaction.ID) break;
        }
        return accountHabit?.habits_ID || "";
    };

    return (
        <ScreenContainer>
            <CategoryIconTabs activeIconTab={activeIconTab} press={setActiveIconTab} styles={{ paddingTop: 16 }} />
            <View style={{ marginVertical: 8 }}>
                <Text variant="titleMedium">
                    {categories.find((category: any) => category.ID === activeIconTab)?.description} emissions
                </Text>
            </View>
            <View style={{ flex: 1 }}>
                <CurrentPeriodSummary categoryId={activeIconTab} />
                {transactions.length > 0 ? (
                    <FlatList
                        data={transactions}
                        renderItem={renderItem}
                        keyExtractor={(item: ITransaction) => item.ID}
                        initialNumToRender={30}
                        showsVerticalScrollIndicator={false}
                        ListHeaderComponentStyle={{ marginVertical: 8 }}
                        extraData={activeIconTab} // ensure FlatList rerenders when selected category changes
                    />
                ) : (
                    <VerticalContainer style={{ marginTop: 8 }}>
                        <HorizontalContainer>
                            <Text>No Expenses</Text>
                        </HorizontalContainer>
                        <HorizontalContainer>
                            <Caption>You have no expenses for this category in this period.</Caption>
                        </HorizontalContainer>
                    </VerticalContainer>
                )}
            </View>
            <HabitModal
                visible={isModalVisible}
                transaction={transactionInFocus}
                onDismiss={() => {
                    setIsModalVisible(false);
                    resetState();
                }}
                habitCategory={associatedHabit}
                checkedHabit={checkedHabit}
                setCheckedHabit={setCheckedHabit}
                hasChanges={hasChanges}
                setHasChanges={setHasChanges}
            />
        </ScreenContainer>
    );
};
