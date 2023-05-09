import { View, StyleSheet } from "react-native";
import { useTheme } from "react-native-paper";

export const ScreenContainer = ({ style: customStyle = {}, children }: any) => {
    const theme = useTheme();
    return <View style={[styles.default, { backgroundColor: theme.colors.background }, customStyle]}>{children}</View>;
};

const styles = StyleSheet.create({
    default: {
        flex: 1,
        paddingHorizontal: 16
    }
});
