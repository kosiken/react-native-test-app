import { ViewStyle, StyleSheet } from "react-native";
import { ExtendedTheme } from "@react-navigation/native";

interface Style {
  container: ViewStyle;
  bottomNext: ViewStyle;
  loadingContainer: ViewStyle;
}

export default (theme: ExtendedTheme) => {
  const { colors } = theme;
  return StyleSheet.create<Style>({
    container: {
      flex: 1,
      backgroundColor: colors.dynamicBackground,
    },
    bottomNext: {
      flexDirection: "row",
      padding: 15,
    },
    loadingContainer: {
      alignItems: "center",
    },
  });
};
