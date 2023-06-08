import { ExtendedTheme } from "@react-navigation/native";
import { ViewStyle, StyleSheet } from "react-native";

export interface EventStyle {
  checkbox: ViewStyle;
  checked: ViewStyle;
}

export default (theme: ExtendedTheme) => {
  const { colors } = theme;
  return StyleSheet.create<EventStyle>({
    checkbox: {
      width: 15,
      height: 15,
      backgroundColor: "transparent",
      borderWidth: 1,
      borderRadius: 8,
      borderColor: colors.foreground,
    },
    checked: {
      backgroundColor: colors.secondary,
    },
  });
};
