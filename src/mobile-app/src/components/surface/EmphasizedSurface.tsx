import { StyleSheet, Dimensions } from "react-native";
import { useTheme } from "react-native-paper";

import { Surface } from "./Surface";

const { width } = Dimensions.get("window");

const EmphasizedSurface = ({ children }: any) => {
    const theme = useTheme();
    const styles = makeStyles(theme.colors);
    return (
        <Surface hasShadow style={styles.emphasizedSurface}>
            {children}
        </Surface>
    );
};

const makeStyles = (colors: any) =>
    StyleSheet.create({
        emphasizedSurface: {
            position: "relative",
            backgroundColor: colors.emphasize,
            width: width - 32, // ScreenContainer
            paddingHorizontal: 16,
            paddingVertical: 16
        }
    });

export default EmphasizedSurface;
