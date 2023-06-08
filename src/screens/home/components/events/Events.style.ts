import { ExtendedTheme } from "@react-navigation/native";
import { ViewStyle, StyleSheet, TextStyle } from "react-native";

export interface EventStyle {
  container: ViewStyle;
  activityRow: ViewStyle;
  activityCircle: ViewStyle;
  childBox: ViewStyle;
  messageBoxHeader: ViewStyle;
  messageBox: ViewStyle;
  text: TextStyle;
  smallText: ViewStyle;
}

export default (theme: ExtendedTheme) => {
  const { colors } = theme;
  return StyleSheet.create<EventStyle>({
    container: {
      padding: 10,
      marginTop: 16,
      flex: 1,
      width: "95%",
      maxWidth: 627,
      backgroundColor: colors.dynamicBackground,
    },
    activityRow: {
      width: "100%",
      flexDirection: "row",
      alignItems: "center",
    },
    activityCircle: {
      width: 8,
      height: 8,
      borderRadius: 100,
      backgroundColor: theme.colors.status,
    },
    messageBoxHeader: {
      flexDirection: "row",
      alignItems: "center",
      marginVertical: 7,
    },
    childBox: {
      marginTop: 0,
      paddingLeft: 0,
      paddingRight: 0,
      width: "100%",
    },
    messageBox: {
      marginStart: 25,
      marginTop: 10,
      borderWidth: 1,
      padding: 15,
      borderColor: "#F0E7EF",
      borderRadius: 10,
      width: "100%",
    },
    text: {
      fontSize: 14,
    },
    smallText: { fontSize: 10 },
  });
};
