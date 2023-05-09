import { useEffect, Dispatch, SetStateAction } from "react";
import { View, StyleSheet, TouchableOpacity } from "react-native";
import { Text, IconButton, useTheme } from "react-native-paper";
import Icon from "react-native-vector-icons/MaterialCommunityIcons";
import { Calendar as CalendarBase, DateData } from "react-native-calendars";

export interface IMarkedDays {
    [dateString: string]: { selected?: boolean; marked: boolean };
}

interface ICalendar {
    markedDays: IMarkedDays;
    setMarkedDays: any;
    startDate: string;
    dueDate: string;
    refreshProgress: (markedDaysCount: number) => void;
}

const Calendar = ({ markedDays, setMarkedDays, startDate, dueDate, refreshProgress }: ICalendar) => {
    const { colors } = useTheme();

    const toggleMark = (day: DateData): void => {
        const { dateString } = day;
        const previous = Object.values(markedDays).find((day) => day.selected);
        if (previous) previous.selected = false;
        markedDays = { ...markedDays, [dateString]: { selected: true, marked: !markedDays[dateString]?.marked } };
        const markedDaysCount = Object.values(markedDays).filter(({ marked }) => marked).length;
        setMarkedDays(markedDays);
        refreshProgress(markedDaysCount);
    };

    return (
        <View>
            <CalendarBase
                firstDay={1}
                minDate={startDate}
                maxDate={dueDate}
                markedDates={markedDays}
                hideExtraDays={true}
                renderArrow={(direction: string) => (
                    <IconButton
                        icon={direction === "left" ? "chevron-left" : "chevron-right"}
                        size={32}
                        iconColor={colors.primary}
                    />
                )}
                onDayPress={toggleMark}
            />
        </View>
    );
};

export default Calendar;
