import { Dimensions, ScrollView, StyleSheet, TouchableOpacity, View } from "react-native";
import { Modal, Portal, Text } from "react-native-paper";
import { useSafeAreaInsets } from "react-native-safe-area-context";
import Icon from "react-native-vector-icons/MaterialCommunityIcons";
import { LinearGradient } from "expo-linear-gradient";

const { height, width } = Dimensions.get("window");

export const CustomModal = ({
    title,
    titleDescription = "",
    children,
    visible,
    onDismiss,
}: {
    title: string;
    titleDescription: string;
    children: any;
    visible: boolean;
    onDismiss: () => any;
}) => {
    const insets = useSafeAreaInsets();
    const localStyles = makeStyles(insets);
    return (
        <Portal>
            <Modal visible={visible} onDismiss={onDismiss} contentContainerStyle={localStyles.modal}>
                <LinearGradient colors={["#0E7ACF", "#004880", "#00325A"]} style={[localStyles.gradientWrapper]}>
                    <View style={{ marginHorizontal: -12 }}>
                        <View style={[localStyles.headerTitle, titleDescription === "" && { marginBottom: 22 }]}>
                            <Text variant="titleMedium" style={{ color: "#fff" }}>
                                {title}
                            </Text>
                            <TouchableOpacity onPress={onDismiss}>
                                <Icon name="close-circle" size={24} color={"#fff"} />
                            </TouchableOpacity>
                        </View>
                        {titleDescription !== "" && (
                            <View style={localStyles.headerDescription}>
                                <Text variant="bodyMedium" style={{ color: "#fff" }}>
                                    {titleDescription}
                                </Text>
                            </View>
                        )}
                    </View>
                    <ScrollView showsVerticalScrollIndicator={false} style={{ maxHeight: height * 0.6 }}>
                        {children}
                    </ScrollView>
                </LinearGradient>
            </Modal>
        </Portal>
    );
};
const makeStyles = (insets: { bottom: number; left: number; right: number; top: number }) =>
    StyleSheet.create({
        modal: {
            position: "absolute",
            bottom: 0
        },
        headerTitle: {
            flexDirection: "row",
            justifyContent: "space-between",
            display: "flex",
            marginVertical: 4,
            marginHorizontal: 16,
            marginBottom: 8
        },
        headerDescription: {
            marginHorizontal: 16,
            marginBottom: 16
        },
        gradientWrapper: {
            width: width,
            padding: 16,
            borderTopLeftRadius: 16,
            borderTopRightRadius: 16,
            bottom: 0 - insets.bottom,
            paddingBottom: insets.bottom
        }
    });
