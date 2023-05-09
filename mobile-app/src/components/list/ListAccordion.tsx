import React from "react";
import { StyleSheet, View } from "react-native";
import { List, Text, useTheme } from "react-native-paper";
import Icon from "react-native-vector-icons/MaterialCommunityIcons";
import { Surface } from "../surface/Surface";
import { HorizontalContainer } from "../layout/HorizontalContainer";

export interface ListAccordionProps {
    id: string;
    title: string;
    amount: number;
    CO2Score: string;
    items: Array<ListAccordionItemProps>;
    icon: string;
}
export interface ListAccordionItemProps {
    id: string;
    title: string;
    description: string;
}

export const ListAccordion = ({ id, title, amount, CO2Score, items, icon }: ListAccordionProps) => {
    const { colors } = useTheme();
    const localStyles = makeStyles(colors);
    return (
        <>
            <Surface hasShadow style={localStyles.listAccordionSurface}>
                <List.Accordion
                    key={id}
                    title={title}
                    titleNumberOfLines={2}
                    description={amount.toFixed(0)}
                    left={(props) => <List.Icon {...props} icon={icon} />}
                    right={(props) => {
                        return (
                            <HorizontalContainer style={{ marginTop: 8 }}>
                                <Text>{CO2Score}</Text>
                                {props.isExpanded ? (
                                    <Icon name="chevron-up" size={24} />
                                ) : (
                                    <Icon name="chevron-down" size={24} />
                                )}
                            </HorizontalContainer>
                        );
                    }}
                >
                    {items.map((item: ListAccordionItemProps, index: number) => (
                        <ListAccordionItem itemProps={item} key={index} />
                    ))}
                </List.Accordion>
            </Surface>
        </>
    );
};

export const ListAccordionItem = ({ itemProps }: { itemProps: ListAccordionItemProps }) => {
    const { colors } = useTheme();
    const localStyles = makeStyles(colors);
    return (
        <View>
            <Surface key={itemProps.id} style={localStyles.listItemSurface}>
                <Text variant="titleSmall">{itemProps.title}</Text>
                <Text variant="bodySmall">{itemProps.description}</Text>
            </Surface>
        </View>
    );
};

export default ListAccordion;

const makeStyles = (colors: any) =>
    StyleSheet.create({
        listAccordionSurface: {
            marginHorizontal: 6,
            padding: 8,
            marginTop: 16,
            backgroundColor: colors.surface
        },
        listAccordionProps: {
            flexDirection: "row",
            justifyContent: "center",
            marginTop: 8,
            alignItems: "center"
        },
        listItemSurface: {
            marginHorizontal: 8,
            marginVertical: 4,
            marginTop: 16,
            padding: 8,
            paddingLeft: 16,
            backgroundColor: colors.surface
        }
    });
