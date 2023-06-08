import React from "react";
import { StyleProp, View, ViewStyle } from "react-native";

interface ISpacerProps {
  spacing: number;
  direction?: "vertical" | "horizontal";
}

const Spacer: React.FC<ISpacerProps> = ({
  spacing = 10,
  direction = "vertical",
}) => {
  const style: StyleProp<ViewStyle> =
    direction === "vertical"
      ? {
          marginVertical: spacing,
          height: 5,
        }
      : {
          marginHorizontal: spacing,
          width: 2,
        };

  return <View style={style} />;
};

export default Spacer;
