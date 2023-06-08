import { TouchableOpacity } from "react-native";
import React from "react";
import { useTheme } from "@react-navigation/native";
import Icon, { IconType } from "react-native-dynamic-vector-icons";

const CheckBox: React.FC<{
  checked?: boolean;
  onChange?: (c: boolean) => void;
}> = ({ checked, onChange }) => {
  const theme = useTheme();

  return (
    <TouchableOpacity
      onPress={() => {
        if (onChange) {
          onChange(!checked);
        }
      }}
    >
      <Icon
        name={checked ? "check-circle-fill" : "circle"}
        type={IconType.Octicons}
        color={checked ? theme.colors.secondary : theme.colors.foreground}
        size={15}
      />
    </TouchableOpacity>
  );
};
CheckBox.defaultProps = {
  checked: false,
};

export default CheckBox;
