import { View } from "react-native";
import { IconButton, useTheme } from "react-native-paper";
import { Calendar as CalendarBase, DateData } from "react-native-calendars";

export interface IMarkedDays {
    [dateString: string]: { selected: boolean; selectedColor: string };
}

interface ICalendar {
    markedDays: IMarkedDays;
    setMarkedDays: (markedDays: IMarkedDays) => void;
    startDate: string;
    dueDate: string;
    refreshProgress: (markedDaysCount: number) => void;
}

const Calendar = ({ markedDays, setMarkedDays, startDate, dueDate, refreshProgress }: ICalendar) => {
    const { colors } = useTheme();

    const toggleMark = (day: DateData): void => {
        const { dateString } = day;
        markedDays = {
            ...markedDays,
            [dateString]: { selected: !markedDays[dateString]?.selected, selectedColor: colors.primary }
        };
        const markedDaysCount = Object.values(markedDays).filter(({ selected }) => selected).length;
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
                theme={{
                    todayTextColor: colors.primary
                }}
            />
        </View>
    );
};

export default Calendar;
