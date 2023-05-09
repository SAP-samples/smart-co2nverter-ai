import { useContext, useState } from "react";
import { Snackbar, Text } from "react-native-paper";
import { ScrollView, View } from "react-native";

import { HabitCategories as IHabitCategory } from "../../types/entities";
import { AccountContext } from "../../context/AccountContext";

import { ScreenContainer } from "../../components/layout/ScreenContainer";
import Questionnaire from "./questionnaire/Questionnaire";
import { CustomModal } from "../../components/modals/CustomModal";

const Habits = () => {
    const { getHabitCategories } = useContext(AccountContext);
    const [showModal, setShowModal] = useState<boolean>(false);
    const [gptError, setGptError] = useState<boolean>(false);
    const [recommendation, setRecommendation] = useState<{ title: string; description: string; content: string }>({
        title: "",
        description: "",
        content: ""
    });
    const habitCategories: Array<IHabitCategory> = getHabitCategories();
    return (
        <ScreenContainer>
            <ScrollView contentContainerStyle={{ paddingVertical: 8 }} showsVerticalScrollIndicator={false}>
                <Text variant="titleMedium" style={{ marginTop: 16 }}>
                    Spending habits
                </Text>
                <Text variant="bodyMedium" style={{ marginTop: 8 }}>
                    Improve the accuracy of your overall footprint by answering the available questions.
                </Text>
                <View style={{ marginTop: 12 }}>
                    {habitCategories.map((habitCategory) => (
                        <Questionnaire
                            habitCategory={habitCategory}
                            key={habitCategory.ID}
                            {...{ setShowModal, setGptError, setRecommendation }}
                        />
                    ))}
                </View>
            </ScrollView>
            <CustomModal
                title={recommendation.title}
                titleDescription={recommendation.description}
                visible={showModal}
                onDismiss={() => setShowModal(false)}
            >
                <View style={{ backgroundColor: "#fff", marginTop: 16, padding: 16, borderRadius: 16 }}>
                    <Text>{recommendation.content}</Text>
                </View>
            </CustomModal>
            <Snackbar onDismiss={() => setGptError(false)} duration={5000} visible={gptError}>
                Error getting GPT-3 response! Please try again later.
            </Snackbar>
        </ScreenContainer>
    );
};

export default Habits;
