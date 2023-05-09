import { useContext, useState } from "react";
import { View, ScrollView, TouchableOpacity, LayoutRectangle, StyleSheet } from "react-native";
import { useTheme } from "react-native-paper";
import Icon from "react-native-vector-icons/MaterialCommunityIcons";

import { AccountContext } from "../../context/AccountContext";
import { Categories as ICategory } from "../../types/entities";

export const CategoryIconTabs = ({
    activeIconTab,
    press,
    isAllTabShown = true,
    styles = {}
}: {
    activeIconTab: string;
    press: any;
    isAllTabShown?: boolean;
    styles?: any;
}) => {
    const theme: any = useTheme();
    const localStyles = makeStyles(theme.colors);

    const { getCategories } = useContext(AccountContext);
    const categories: Array<ICategory> = JSON.parse(JSON.stringify(getCategories())); //to prevent modifying original array

    if (isAllTabShown) {
        if (!categories.find((category: ICategory) => category.ID === "ALL")) {
            categories.unshift({ ID: "ALL", description: "All", icon: "apps" } as ICategory);
        }
    }

    const [isFirstVisit, setIsFirstVisit] = useState<boolean>(true);
    const [offsetX, setOffsetX] = useState<number>(0);

    return (
        <View style={styles}>
            <ScrollView horizontal={true} showsHorizontalScrollIndicator={false} contentOffset={{ x: offsetX, y: 0 }}>
                {categories.map((category: { ID: string; icon: string }) => (
                    <TouchableOpacity
                        key={category.ID}
                        onPress={() => press(category.ID)}
                        style={[
                            localStyles.iconContainer,
                            {
                                backgroundColor:
                                    activeIconTab === category.ID ? theme.colors.primary : theme.colors.onPrimary
                            }
                        ]}
                        onLayout={(event) => {
                            const layout: LayoutRectangle = event.nativeEvent.layout;
                            if (activeIconTab === category.ID && isFirstVisit) {
                                setOffsetX(layout.x);
                                setIsFirstVisit(false);
                            }
                        }}
                    >
                        <Icon
                            name={category.icon}
                            size={30}
                            style={{ padding: 4 }}
                            color={activeIconTab === category.ID ? theme.colors.onPrimary : theme.colors.primary}
                        />
                    </TouchableOpacity>
                ))}
            </ScrollView>
        </View>
    );
};

const makeStyles = (colors: any) =>
    StyleSheet.create({
        iconContainer: {
            marginRight: 8,
            borderWidth: 1.5,
            borderRadius: 25,
            borderColor: colors.primary
        }
    });
