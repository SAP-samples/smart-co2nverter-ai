import { View, ScrollView } from "react-native";

import CarouselSummary from "../../components/summary/CarouselSummary";
import { ScreenContainer } from "../../components/layout/ScreenContainer";
import Equivalencies from "./equivalencies/Equivalencies";
import { EmissionsByCategoryTile } from "./categories/EmissionsByCategoryTile";
import { MostImpactfulExpensesTile } from "../../screens/home/expenses/MostImpactfulExpensesTile";
import ChallengesTile from "./challenges/ChallengesTile";
import FootprintInContextTile from "./footprint/FootprintInContextTile";

const Home = () => {
    return (
        <ScreenContainer style={{ paddingHorizontal: 0 }}>
            <ScrollView contentContainerStyle={{ paddingVertical: 8 }} showsVerticalScrollIndicator={false}>
                <View>
                    <CarouselSummary />
                </View>
                <View style={{ marginTop: 32 }}>
                    <Equivalencies />
                </View>
                <View style={{ marginTop: 32 }}>
                    <EmissionsByCategoryTile />
                </View>
                <View style={{ marginTop: 32 }}>
                    <MostImpactfulExpensesTile />
                </View>
                <View style={{ display: "flex", alignItems: "center", marginTop: 32 }}>
                    <ChallengesTile />
                </View>
                <View style={{ marginTop: 32 }}>
                    <FootprintInContextTile />
                </View>
            </ScrollView>
        </ScreenContainer>
    );
};

export default Home;
