import { View } from "react-native";
import React, { useMemo, useState } from "react";
import { useTheme } from "@react-navigation/native";
import Text from "@shared-components/text-wrapper/TextWrapper";
import UserAvatar from "react-native-user-avatar";

import createStyles, { EventStyle } from "./Events.style";

import { AppEventsWithChildren } from "@services/models";
import { startCase } from "lodash";
import Spacer from "@shared-components/spacer/Spacer";
import { fromNow } from "utils";
import { ScrollView } from "react-native-gesture-handler";
import CheckBox from "@shared-components/checkbox/CheckBox";
import RNBounceable from "@freakycoder/react-native-bounceable";

type Optional<T, K extends keyof T> = Pick<Partial<T>, K> & Omit<T, K>;
interface IEventProps {
  activity: Optional<AppEventsWithChildren, "children">;
}

type EventSubProps = IEventProps & { theme: any; styles: EventStyle };
const StatusUpdate: React.FC<EventSubProps> = ({ activity, theme, styles }) => {
  const ActivityCircle = <View style={styles.activityCircle} />;
  return (
    <>
      <Spacer spacing={2} direction="horizontal" />
      <Text style={styles.text}>
        has {startCase(activity.activity?.type || "")} to
      </Text>
      <Spacer spacing={2} direction="horizontal" />
      {ActivityCircle}
      <Spacer spacing={2} direction="horizontal" />
      <Text style={styles.text} color={theme.colors.text}>
        {activity.activity?.status}
      </Text>
      <Spacer spacing={3.5} direction="horizontal" />
      <Text style={styles.smallText}>{fromNow(activity.createdAt)}</Text>
      <Spacer spacing={1} direction="horizontal" />
    </>
  );
};

const MessageBox: React.FC<EventSubProps> = ({ theme, activity, styles }) => {
  return (
    <View style={styles.messageBox}>
      <Text color={theme.colors.text}>
        {startCase(activity.message?.title || "")}
      </Text>
      <View style={styles.messageBoxHeader}>
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
        <Text style={styles.smallText}>{fromNow(activity.createdAt)}</Text>
      </View>
      <Text style={styles.text}>{activity.message?.description}</Text>
    </View>
  );
};
const Event: React.FC<
  IEventProps & {
    isChild?: boolean;
    onPressCheck?: (c: boolean) => void;
  }
> = ({ activity, isChild = false, onPressCheck = () => {} }) => {
  const theme = useTheme();
  const [checked, setChecked] = useState(false);
  const { colors } = theme;
  const styles = useMemo(() => createStyles(theme), [theme]);

  const onPress = (d: boolean) => {
    setChecked(d);
    onPressCheck(d);
  };

  const renderChildren = () => {
    if (activity.children && activity.children.length) {
      return (
        <>
          {activity.children.map((a) => (
            <Event activity={a} key={a.createdAt} isChild />
          ))}
        </>
      );
    }
    return <View />;
  };

  const renderHeader = () => {
    if (activity.type === "activity" && !isChild) {
      return (
        <ScrollView horizontal showsHorizontalScrollIndicator={false}>
          <RNBounceable onPress={() => onPress(!checked)}>
            <View style={styles.activityRow}>
              <CheckBox disabled checked={checked} />
              <Spacer spacing={3} direction="horizontal" />
              <UserAvatar
                size={30}
                name={activity.author}
                bgColor={colors.secondary}
              />
              <Spacer spacing={2} direction="horizontal" />
              <Text style={styles.text} color={colors.text}>
                {activity.author}
              </Text>

              <StatusUpdate activity={activity} theme={theme} styles={styles} />
            </View>
          </RNBounceable>
        </ScrollView>
      );
    } else if (activity.type === "comment" && !isChild) {
      return (
        <ScrollView horizontal showsHorizontalScrollIndicator={false}>
          <RNBounceable onPress={() => onPress(!checked)}>
            <View style={styles.activityRow}>
              {!isChild && <CheckBox disabled checked={checked} />}
              {isChild && <Spacer spacing={20} direction="horizontal" />}
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
          </RNBounceable>
        </ScrollView>
      );
    } else if (activity.type === "activity") {
      return (
        <View style={{ marginTop: 10, marginLeft: 25 }}>
          <ScrollView horizontal showsHorizontalScrollIndicator={false}>
            <View style={styles.activityRow}>
              <Text style={styles.text} color={colors.text}>
                {activity.author}
              </Text>

              <StatusUpdate activity={activity} theme={theme} styles={styles} />
            </View>
          </ScrollView>
        </View>
      );
    } else {
      return <View />;
    }
  };
  return (
    <View style={[styles.container, isChild && styles.childBox]}>
      {renderHeader()}

      {activity.type === "comment" && (
        <MessageBox styles={styles} theme={theme} activity={activity} />
      )}
      {renderChildren()}
    </View>
  );
};

export default Event;
