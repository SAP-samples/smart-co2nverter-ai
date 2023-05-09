import { StyleSheet, View } from "react-native";

export const HorizontalContainer = ({ children, style: customStyle = {} }: any) => {
    return <View style={[styles.container, customStyle]}>{children}</View>;
};

const styles = StyleSheet.create({
    container: {
        flexDirection: "row",
        justifyContent: "center",
        alignItems: "center"
    }
});
