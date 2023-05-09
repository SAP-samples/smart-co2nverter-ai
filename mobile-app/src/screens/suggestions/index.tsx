import { useContext, useState, useEffect } from "react";
import { ScrollView, StyleSheet, View } from "react-native";
import { List, Text, useTheme, Surface, Button, Snackbar, Chip } from "react-native-paper";
import Icon from "react-native-vector-icons/MaterialCommunityIcons";

import { ScreenContainer } from "../../components/layout/ScreenContainer";
import { Categories as ICategory, ActionAskForComposition, ActionAskForGreenContract } from "../../types/entities";
import { AccountContext, ITransactionSummary } from "../../context/AccountContext";
import { HorizontalContainer } from "../../components/layout/HorizontalContainer";
import { askForCompositionQuery, askForGreenContractQuery, generateSuggestionsQuery } from "../../queries";
import { VerticalContainer } from "../../components/layout/VerticalContainer";
import { CustomModal } from "../../components/modals/CustomModal";

interface ISuggestion {
    title: string;
    description: string;
}

const initializeGeneratingFlags = (getCategories: () => ICategory[]) => {
    return getCategories().reduce(
        (result: { [categoryId: string]: boolean }, category: ICategory) => ({ ...result, [category.ID]: false }),
        {}
    );
};

const Suggestions = () => {
    const { getCategoryById, monthlySummary, getCategories, state } = useContext(AccountContext);
    const [sortedSummaries, setSortedSummaries] = useState<any>([]);
    const [suggestions, setSuggestions] = useState<{ [categoryId: string]: Array<ISuggestion> }>();
    const [generating, setGenerating] = useState<{ [categoryId: string]: boolean }>(
        initializeGeneratingFlags(getCategories)
    );
    const [loading, setLoading] = useState<string>("");
    const [showModal, setShowModal] = useState<boolean>(false);
    const [emailTemplate, setEmailTemplate] = useState<{ title: string; description: string; content: string }>({
        title: "",
        description: "",
        content: ""
    });
    const [showError, setShowError] = useState<boolean>(false);
    const theme = useTheme();

    useEffect(() => {
        setSortedSummaries(
            Object.entries(monthlySummary.categorizedSummary)
                .filter(([_categoryId, summary]: [string, ITransactionSummary]) => summary.CO2Score > 0)
                .sort(
                    (
                        [_catA, summaryA]: [string, ITransactionSummary],
                        [_catB, summaryB]: [string, ITransactionSummary]
                    ) => summaryB.CO2Score - summaryA.CO2Score
                )
        );
    }, [monthlySummary]);

    const generateSuggestions = async (
        category: ICategory,
        spendings: number,
        CO2Score: number,
        amountOfTransactions: number
    ) => {
        setGenerating({ ...generating, [category.ID]: true });
        const response = await fetch(
            generateSuggestionsQuery(category.description, spendings, CO2Score, amountOfTransactions)
        );
        if (response.ok) {
            const data = await response.json();
            const categorySuggestions = data.value as Array<ISuggestion>;
            setSuggestions({ ...suggestions, [category.ID]: categorySuggestions });
        } else {
            setShowError(true);
        }
        setGenerating({ ...generating, [category.ID]: false });
    };

    const askForComposition = async (
        name: string,
        contract: string = "<CONTRACT>",
        address: string = "<ADDRESS>",
        provider: string = "<PROVIDER>"
    ) => {
        const query = askForCompositionQuery(name, contract, address, provider);
        askForX(
            "Energy Composition Email",
            "The following example shows an email generated by GPT-3 to your energy provider asking about the composition of the electricity.",
            query,
            ActionAskForComposition.name
        );
    };

    const askForGreenContract = (
        name: string,
        contract: string = "<CONTRACT>",
        address: string = "<ADDRESS>",
        provider: string = "<PROVIDER>"
    ) => {
        const query = askForGreenContractQuery(name, contract, address, provider);
        askForX(
            "Green Contract Email",
            "The following example shows an email generated by GPT-3 to your energy provider requesting a quote for a green power contract.",
            query,
            ActionAskForGreenContract.name
        );
    };

    const askForX = async (title: string, description: string, query: Request, loading: string) => {
        setLoading(loading);
        const response = await fetch(query);
        if (response.ok) {
            const generatedEmail = await response.json();
            const generatedEmailTrimmed = generatedEmail.text.replace(/^\s+|\s+$/g, "");
            setEmailTemplate({ title: title, description: description, content: generatedEmailTrimmed });
            setShowModal(true);
        } else {
            setShowModal(false);
            setShowError(true);
        }
        setLoading("");
    };

    return (
        <>
            <ScreenContainer>
                <ScrollView showsVerticalScrollIndicator={false} style={{ paddingVertical: 8 }}>
                    <Text variant="titleMedium" style={{ marginTop: 16 }}>
                        Suggestions to reduce impact
                    </Text>
                    <Text variant="bodyMedium" style={{ marginTop: 8 }}>
                        {"Find suggestions to reduce your CO\u2082 footprint based on your most impactful spendings."}
                    </Text>
                    <View style={{ marginTop: 12 }}>
                        {sortedSummaries.map(([id, summary]: [string, ITransactionSummary]) => {
                            const category = getCategoryById(id);
                            return (
                                <Surface
                                    key={id}
                                    elevation={1}
                                    style={[{ borderRadius: theme.roundness }, styles.surface]}
                                >
                                    <List.Accordion
                                        titleStyle={{ color: "#000" }}
                                        style={{ backgroundColor: theme.colors.elevation.level1 }}
                                        key={id}
                                        title={category.description}
                                        titleNumberOfLines={2}
                                        description={`${summary.spendings.toFixed(0)} €`}
                                        left={(props) => <List.Icon {...props} icon={category.icon} color={"#000"} />}
                                        right={(props) => {
                                            return (
                                                <HorizontalContainer style={{ marginTop: 8 }}>
                                                    <Text variant="titleSmall">{`${summary.CO2Score.toFixed(
                                                        0
                                                    )} kg`}</Text>
                                                    <Icon
                                                        name={props.isExpanded ? "chevron-up" : "chevron-down"}
                                                        size={24}
                                                    />
                                                </HorizontalContainer>
                                            );
                                        }}
                                    >
                                        <View style={{ paddingLeft: 0 }}>
                                            {suggestions && suggestions[category.ID] ? (
                                                suggestions[category.ID].map((suggestion: ISuggestion) => (
                                                    <SuggestionItem key={suggestion.title} {...suggestion} />
                                                ))
                                            ) : (
                                                <Text
                                                    variant="bodySmall"
                                                    style={{ color: theme.colors.secondary, marginBottom: 8 }}
                                                >
                                                    {`If you generate suggestions, GPT-3 will be asked to propose actions for the category ${
                                                        category.description
                                                    } based on your ${
                                                        summary.transactions.length
                                                    } transactions in this particular category of ${summary.spendings.toFixed(
                                                        0
                                                    )}€ spendings and ${summary.CO2Score.toFixed(
                                                        0
                                                    )}kg CO\u2082 emissions.`}
                                                </Text>
                                            )}
                                            <Button
                                                icon="chat-processing-outline"
                                                mode="text"
                                                loading={generating[category.ID] || false}
                                                onPress={() =>
                                                    !(generating[category.ID] || false) &&
                                                    generateSuggestions(
                                                        category,
                                                        summary.spendings,
                                                        summary.CO2Score,
                                                        summary.transactions.length
                                                    ).catch(console.error)
                                                }
                                            >
                                                Generate Suggestions
                                            </Button>
                                        </View>
                                    </List.Accordion>
                                </Surface>
                            );
                        })}
                        <Surface
                            key={"electricity"}
                            elevation={1}
                            style={[{ borderRadius: theme.roundness }, styles.surface]}
                        >
                            <List.Accordion
                                titleStyle={{ color: "#000" }}
                                style={{ backgroundColor: theme.colors.elevation.level1 }}
                                key={"electricity"}
                                title={"Electricity Provider"}
                                titleNumberOfLines={2}
                                left={(props) => <List.Icon {...props} icon={"car"} color={"#000"} />}
                                right={(props) => {
                                    return (
                                        <HorizontalContainer style={{ marginTop: 8 }}>
                                            <Icon name={props.isExpanded ? "chevron-up" : "chevron-down"} size={24} />
                                        </HorizontalContainer>
                                    );
                                }}
                            >
                                <View style={{ paddingLeft: 0 }}>
                                    <Text
                                        variant="bodySmall"
                                        style={{ color: theme.colors.secondary, marginBottom: 8 }}
                                    >
                                        Do you know the composition of your electricity tariff? Ask your energy supplier
                                        about it now or get a quote for a green electricity contract if you haven't
                                        switched yet. The actions below will generate an email which you can send to
                                        your energy supplier.
                                    </Text>

                                    <HorizontalContainer>
                                        <Button
                                            mode="text"
                                            onPress={() => askForComposition(state.name)}
                                            disabled={loading !== ""}
                                            loading={loading === ActionAskForComposition.name}
                                        >
                                            Ask for Composition
                                        </Button>
                                        <Button
                                            mode="text"
                                            onPress={() => askForGreenContract(state.name)}
                                            disabled={loading !== ""}
                                            loading={loading === ActionAskForGreenContract.name}
                                        >
                                            Ask for Green Contract
                                        </Button>
                                    </HorizontalContainer>
                                </View>
                            </List.Accordion>
                        </Surface>
                    </View>
                </ScrollView>
                <CustomModal
                    title={emailTemplate.title}
                    titleDescription={emailTemplate.description}
                    visible={showModal}
                    onDismiss={() => setShowModal(false)}
                >
                    <View style={{ backgroundColor: "#fff", marginTop: 16, padding: 16, borderRadius: 16 }}>
                        <Text>{emailTemplate.content}</Text>
                    </View>
                </CustomModal>
            </ScreenContainer>
            <Snackbar onDismiss={() => setShowError(false)} duration={5000} visible={showError}>
                Error getting GPT-3 response! Please try again later.
            </Snackbar>
        </>
    );
};

export default Suggestions;

const SuggestionItem = ({ title, description }: ISuggestion) => {
    const { roundness } = useTheme();
    const styles = makeItemStyles(roundness);
    return (
        <Surface elevation={3} mode="flat" style={styles.suggestionItemContainer}>
            <VerticalContainer style={styles.suggestionTextContainer}>
                <Text variant="titleSmall">{title}</Text>
                <Text variant="bodySmall">{description}</Text>
            </VerticalContainer>
        </Surface>
    );
};

const styles = StyleSheet.create({
    surface: {
        paddingVertical: 8,
        paddingHorizontal: 16,
        marginVertical: 8,
        marginHorizontal: 4
    }
});

const makeItemStyles = (roundness: number) =>
    StyleSheet.create({
        suggestionItemContainer: {
            marginVertical: 4,
            marginHorizontal: 0,
            paddingVertical: 4,
            paddingHorizontal: 18,
            borderRadius: roundness
        },
        suggestionTextContainer: {
            marginVertical: 8
        }
    });
