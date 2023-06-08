import { View } from "react-native";
import React, { useMemo } from "react";
import { useTheme } from "@react-navigation/native";
import Text from "@shared-components/text-wrapper/TextWrapper";
import UserAvatar from "react-native-user-avatar";

import createStyles, { EventStyle } from "./Activity.style";

import { AppEvents, AppEventsWithChildren } from "@services/models";
import { startCase } from "lodash";
import Spacer from "@shared-components/spacer/Spacer";
import { fromNow } from "utils";
import { ScrollView } from "react-native-gesture-handler";
import CheckBox from "@shared-components/checkbox/CheckBox";

type Optional<T, K extends keyof T> = Pick<Partial<T>, K> & Omit<T, K>;
interface IActivityProps {
  activity: Optional<AppEventsWithChildren, "children">;
}

type ActivitySubProps = IActivityProps & { theme: any; styles: EventStyle };
const StatusUpdate: React.FC<ActivitySubProps> = ({
  activity,
  theme,
  styles,
}) => {
  const ActivityCircle = (
    <View
      style={{
        width: 8,
        height: 8,
        borderRadius: 100,
        backgroundColor: theme.colors.status,
      }}
    />
  );
  return (
    <>
      <Spacer spacing={1} direction="horizontal" />
      <Text style={styles.text}>
        has {startCase(activity.activity?.type || "")} to
      </Text>
      <Spacer spacing={1} direction="horizontal" />
      {ActivityCircle}
      <Spacer spacing={1} direction="horizontal" />
      <Text style={styles.text} color={theme.colors.text}>
        {activity.activity?.status}
      </Text>
      <Spacer spacing={1} direction="horizontal" />
      <Text style={{ fontSize: 10 }}>{fromNow(activity.createdAt)}</Text>
      <Spacer spacing={1} direction="horizontal" />
    </>
  );
};

const MessageBox: React.FC<ActivitySubProps> = ({ theme, activity }) => {
  return (
    <View style={{ marginStart: 25, marginTop: 10, borderWidth: 1, padding: 15, borderColor: '#F0E7EF', borderRadius: 10 }}>
      <Text color={theme.colors.text}>
        {startCase(activity.message?.title || "")}
      </Text>
      <View
        style={{
          flexDirection: "row",
          alignItems: "center",
          marginVertical: 7,
        }}
      >
        <UserAvatar
          size={20}
          bgColor={"#DCCAE8"}
          name={activity.message?.receiver}
        />
        <Spacer spacing={4} direction="horizontal" />
        <Text color={theme.colors.text}>
          {startCase(activity.message?.receiver || "No Name")}
        </Text>
        <Spacer spacing={1} direction="horizontal" />
        <Text style={{ fontSize: 10 }}>{fromNow(activity.createdAt)}</Text>
      </View>
      <Text style={{ fontSize: 12 }}>{activity.message?.description}</Text>
    </View>
  );
};
const Activity: React.FC<
  IActivityProps & {
    isChild?: boolean;
    checked?: boolean;
    onPressCheck?: (c: boolean) => void;
  }
> = ({
  activity,
  checked = false,
  isChild = false,
  onPressCheck = () => {},
}) => {
  const theme = useTheme();
  const { colors } = theme;
  const styles = useMemo(() => createStyles(theme), [theme]);

  const renderChildren = () => {
    if (activity.children && activity.children.length) {
      return (
        <>
          {activity.children.map((a) => (
            <Activity activity={a} key={a.createdAt} isChild />
          ))}
        </>
      );
    }
    return <View />;
  };

  const renderHeader = () => {
    if (activity.type === "activity") {
      return (
        <ScrollView horizontal showsHorizontalScrollIndicator={false}>
          <View style={styles.activityRow}>
            {!isChild && <CheckBox onChange={onPressCheck} checked={checked} />}
            <Spacer spacing={3} direction="horizontal" />
            <UserAvatar
              size={30}
              name={activity.author}
              bgColor={colors.primary}
            />
            <Spacer spacing={2} direction="horizontal" />
            <Text style={styles.text} color={colors.text}>
              {activity.author}
            </Text>

            <StatusUpdate activity={activity} theme={theme} styles={styles} />
          </View>
        </ScrollView>
      );
    } else if (activity.type === "comment" && !isChild) {
      return (
        <ScrollView horizontal showsHorizontalScrollIndicator={false}>
          <View style={styles.activityRow}>
            {!isChild && <CheckBox onChange={onPressCheck} checked={checked} />}
            <Spacer spacing={3} direction="horizontal" />
            <UserAvatar
              size={30}
              name={activity.author}
              bgColor={colors.primary}
            />
            <Spacer spacing={2} direction="horizontal" />
            <Text style={styles.text} color={colors.text}>
              {activity.author}
            </Text>
          </View>
        </ScrollView>
      );
    } else {
      return <View />;
    }
  };
  return (
    <View style={[styles.container, isChild && { marginTop: 0, paddingLeft: 0, paddingRight: 0, width: '100%' }]}>
      {renderHeader()}
      {activity.type === "comment" && (
        <MessageBox styles={styles} theme={theme} activity={activity} />
      )}
      {renderChildren()}
    </View>
  );
};

export default Activity;
