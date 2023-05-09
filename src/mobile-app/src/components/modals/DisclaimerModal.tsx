import { StyleSheet, View } from "react-native";
import { useTheme, Text } from "react-native-paper";
import { CustomModal } from "./CustomModal";
import { useNavigation } from "@react-navigation/native";

export const DisclaimerModal = ({ visible, onDismiss }: { visible: boolean; onDismiss: () => void }) => {
    const { colors } = useTheme();
    const localStyles = makeStyles(colors);
    const navigation = useNavigation<any>();
    const Co2Text = " CO\u2082e ";
    return (
        <CustomModal
            title="Calculation Methodology"
            titleDescription={`Learn how we use your expense data to calculate your CO\u2082 footprint.`}
            visible={visible}
            onDismiss={onDismiss}
        >
            <View style={localStyles.disclaimerContainer}>
                <View>
                    <Text style={{ marginBottom: 5 }}>Our Approach</Text>
                    <Text>
                        We calculate the footprint of your purchases using the merchant company’s annual emissions
                        report. We take the company’s reported emissions and divide them by the revenue to get{Co2Text}
                        value per €. This is multiplied by the amount you’ve spent to get your{Co2Text}estimate, like
                        this:
                    </Text>
                    <Text style={{ marginBottom: 10, marginTop: 10, fontStyle: "italic", color: "#465E70" }}>
                        Transaction{Co2Text}estimate ={Co2Text}per € (either company-specific, or for the sector) * €
                        spent
                    </Text>
                    <Text style={{ marginBottom: 20 }}>
                        If we don’t have a company’s reported emissions, we use government-issued emissions factors for
                        its sector. For example, if you spend at a supermarket we’d use{Co2Text}per € for the food
                        industry.
                    </Text>
                </View>
                <View>
                    <Text style={{ marginBottom: 5 }}>Impact of lifestyle choices</Text>
                    <Text>
                        <Text>
                            We adjust the{Co2Text}estimate to take your lifestyle factors into consideration. For
                            example, if you tell us in the
                        </Text>
                        <Text
                            style={{ color: colors.primary }}
                            onPress={() => {
                                onDismiss();
                                navigation.navigate("HabitsTab", { screen: "Habits" });
                            }}
                        >
                            {" Habits "}
                        </Text>
                        <Text>
                            section that you follow a vegetarian diet, we adjust{Co2Text}estimates for all food
                            transactions. Or we adjust{Co2Text}estimates for specific transactions where you indicate
                            that the type of food consumed was vegetarian:
                        </Text>
                    </Text>
                    <Text style={{ marginBottom: 10, marginTop: 10, fontStyle: "italic", color: "#465E70" }}>
                        Transaction{Co2Text}estimate = ({Co2Text}per € * € spent) *lifestyle emissions factor
                    </Text>
                </View>
            </View>
        </CustomModal>
    );
};
const makeStyles = (colors: any) =>
    StyleSheet.create({
        disclaimerContainer: {
            backgroundColor: colors.surface,
            marginTop: 16,
            padding: 16,
            borderRadius: 16
        }
    });
