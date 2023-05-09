import { View } from "react-native";
import { Text, Caption } from "react-native-paper";

import { HorizontalContainer } from "./layout/HorizontalContainer";

const BigNumberCO2 = ({ co2, caption }: { co2: number | string; caption: string }) => {
    return (
        <View>
            <HorizontalContainer>
                <Text variant="displayMedium" style={{ fontWeight: "600" }}>
                    {co2}
                </Text>
                <Text variant="titleLarge" style={{ marginLeft: 4, paddingTop: 10 }}>
                    {"kg CO\u2082"}
                </Text>
            </HorizontalContainer>
            <Caption style={{ textAlign: "center" }}>{caption}</Caption>
        </View>
    );
};

export default BigNumberCO2;
