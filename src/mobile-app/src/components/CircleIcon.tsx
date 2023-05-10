import { StyleSheet, View } from "react-native";
import { useTheme } from "react-native-paper";
import Icon from "react-native-vector-icons/MaterialCommunityIcons";

import { HorizontalContainer } from "./layout/HorizontalContainer";

const CircleIcon = ({ icon, style = {} }: { icon: string; style?: any }) => {
    const { colors } = useTheme();
    const styles = makeStyles(colors);
    return (
        <View style={[styles.iconContainer, style]}>
            <Icon name={icon} size={30} style={styles.icon} />
        </View>
    );
};

export default CircleIcon;

const makeStyles = (colors: any) =>
    StyleSheet.create({
        icon: {
            padding: 8,
            color: colors.onPrimaryContainer
        },
        iconContainer: {
            backgroundColor: colors.primaryContainer,
            borderRadius: 25
        }
    });
