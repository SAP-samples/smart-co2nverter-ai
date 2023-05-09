import { ProgressBar as ProgressBarBase, useTheme } from "react-native-paper";

/* Progress bar mainly for challenge items */
const ProgressBar = ({ progress, style: customStyle = {} }: { progress: number; style?: any }) => {
    const { colors } = useTheme();
    return (
        <ProgressBarBase
            progress={progress}
            color={colors.primary}
            style={[
                {
                    height: 14,
                    backgroundColor: "#fff",
                    borderRadius: 20
                },
                customStyle
            ]}
        />
    );
};

export default ProgressBar;
