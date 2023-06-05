import { useContext, useState, useMemo } from "react";
import { View, StyleSheet } from "react-native";
import { Button, Snackbar, Text, useTheme } from "react-native-paper";

import {
    Transactions as ITransaction,
    Habits as IHabit,
    HabitCategories as IHabitCategory
} from "../../types/entities";
import { AccountContext } from "../../context/AccountContext";

import { CustomModal } from "./CustomModal";
import { HorizontalContainer } from "../layout/HorizontalContainer";
import HabitItem from "../../screens/habits/questionnaire/HabitItem";
import { FEEDBACK } from "../../screens/habits/questionnaire/Questionnaire";

interface IHabitModal {
    visible: boolean;
    onDismiss: () => void;
    transaction: ITransaction;
    habitCategory: IHabitCategory;
    checkedHabit: string;
    setCheckedHabit: any;
    initialHabit: string;
    hasChanges: boolean;
    setHasChanges: any;
}

const HabitModal = ({
    visible,
    onDismiss,
    transaction,
    habitCategory,
    checkedHabit,
    setCheckedHabit,
    initialHabit,
    hasChanges,
    setHasChanges
}: IHabitModal) => {
    const { colors, roundness } = useTheme();
    const styles = makeStyles(colors, roundness);
    const { setHabit, fetchAccountData } = useContext(AccountContext);
    const [isLoading, setIsLoading] = useState<boolean>(false);
    const [error, setError] = useState<boolean>(false);

    const CO2Score = useMemo(
        () => computeTransactionCO2(transaction, habitCategory, checkedHabit, initialHabit),
        [checkedHabit]
    );
    return (
        <View>
            <CustomModal
                title="Specify expense"
                titleDescription="Here you can set the habit for specifically this expense only:"
                visible={visible}
                onDismiss={onDismiss}
            >
                {transaction && (
                    <View style={styles.body}>
                        <Text variant="bodyMedium" style={{ textAlign: "center" }}>
                            {transaction.description}
                        </Text>
                        <Text
                            variant="bodyMedium"
                            style={{
                                textAlign: "center",
                                marginTop: 6
                            }}
                        >
                            {transaction.amount} €
                        </Text>

                        <View style={{ marginTop: 32, marginBottom: 18 }}>
                            <HorizontalContainer>
                                <Text variant="displayMedium" style={{ fontWeight: "600" }}>
                                    {CO2Score}
                                </Text>
                                <Text variant="titleLarge" style={{ marginLeft: 4, paddingTop: 10 }}>
                                    {"kg CO\u2082"}
                                </Text>
                            </HorizontalContainer>
                        </View>
                        <Text style={{ marginBottom: 14 }}>
                            {habitCategory.ID === "3466da2d-747e-49bb-ab4d-52cab3769ece" // id of dietary habit
                                ? "According to what dietary preferences did you buy groceries or eat food?"
                                : "With what type of fuel did you fill up your car at the petrol station, or did you just buy food there?"}
                        </Text>
                        <View>
                            {habitCategory.options?.map((habit: IHabit) => (
                                <HabitItem
                                    habit={habit}
                                    isChecked={habit.ID == checkedHabit}
                                    setCheckedHabit={(habitID: string) => {
                                        setCheckedHabit(habitID);
                                        setHasChanges(true);
                                    }}
                                    key={habit.ID}
                                />
                            ))}
                        </View>
                        <Button
                            disabled={!hasChanges || isLoading}
                            mode="text"
                            loading={isLoading}
                            onPress={async () => {
                                setIsLoading(true);
                                const response = await setHabit(habitCategory.ID, checkedHabit, transaction.ID);
                                if (response.ok) {
                                    setHasChanges(false);
                                    await fetchAccountData().catch(console.log);
                                    onDismiss();
                                } else {
                                    setError(true);
                                }
                                setIsLoading(false);
                            }}
                            style={{ marginTop: 20 }}
                        >
                            Save habit
                        </Button>
                    </View>
                )}
            </CustomModal>
            <Snackbar
                onDismiss={() => {
                    setError(false);
                }}
                duration={3000}
                visible={error}
            >
                {FEEDBACK["error"]}
            </Snackbar>
        </View>
    );
};

export default HabitModal;

const makeStyles = (colors: any, roundness: any) =>
    StyleSheet.create({
        body: {
            backgroundColor: colors.surface,
            padding: 16,
            borderRadius: roundness,
            marginTop: 16,
            marginBottom: 26
        }
    });

// used to live update the CO2 score of transaction when selecting different habit
const computeTransactionCO2 = (
    transaction: ITransaction,
    habitCategory: IHabitCategory,
    checkedHabit: string,
    initialHabit: string
): string => {
    let co2 = transaction.CO2Score || 0;
    const options = habitCategory.options;
    const currentFactor = options?.find((option) => option.ID == checkedHabit)?.factor || 1;
    const initialFactor = options?.find((option) => option.ID == initialHabit)?.factor || 1;
    co2 = (co2 / initialFactor) * currentFactor;
    return co2.toFixed(2);
};
