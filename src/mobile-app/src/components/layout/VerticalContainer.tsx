import { StyleSheet, View } from "react-native";

export const VerticalContainer = ({ children, style: customStyle = {} }: any) => {
    return <View style={[styles.container, customStyle]}>{children}</View>;
};

const styles = StyleSheet.create({
    container: {
        display: "flex",
        flexDirection: "column",
        justifyContent: "space-between"
    }
});
