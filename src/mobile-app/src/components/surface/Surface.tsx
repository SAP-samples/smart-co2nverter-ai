import { StyleSheet } from "react-native";
import { useTheme, Surface as SurfaceBase } from "react-native-paper";

interface ISurface {
    hasShadow?: boolean;
    style?: any;
    children?: any;
}

export const Surface = ({ hasShadow = false, style: customStyle, children }: ISurface) => {
    const theme = useTheme();
    const styles = makeStyles(theme);
    return (
        <SurfaceBase
            elevation={3}
            style={[styles.defaultContainer, !!hasShadow && styles.shadow, !!customStyle && customStyle]}
        >
            {!!children && children}
        </SurfaceBase>
    );
};

const makeStyles = (theme: any) =>
    StyleSheet.create({
        defaultContainer: {
            borderRadius: theme.roundness,
            marginBottom: 16,
            marginTop: 8
        },
        shadow: {
            shadowColor: "#000",
            shadowOffset: {
                width: 0,
                height: 1
            },
            shadowOpacity: 0.3,
            shadowRadius: 3,
            elevation: 2 // to apply a somewhat similar shadow effect on Android
        }
    });
