import React, { useEffect, useMemo, useRef, useState } from "react";
import { ActivityIndicator, Alert, FlatList, Image, View } from "react-native";
import { useTheme } from "@react-navigation/native";
import Icon, { IconType } from "react-native-dynamic-vector-icons";
import { SafeAreaView } from "react-native-safe-area-context";
import RNBounceable from "@freakycoder/react-native-bounceable";
import { useInfiniteQuery } from "@tanstack/react-query";
import { concat, flatMap } from "lodash";
import Reactotron from "reactotron-react-native";
/**
 * ? Local Imports
 */
import createStyles from "./HomeScreen.style";
import MockData from "./mock/MockData";
import CardItem from "./components/card-item/CardItem";
/**
 * ? Shared Imports
 */
import { SCREENS } from "@shared-constants";
import Text from "@shared-components/text-wrapper/TextWrapper";
import fonts from "@fonts";
import appApi from "@api";
import { AppEventsWithChildren } from "@services/models";
import { resolveAppEvents } from "@utils";
import Activity from "./components/activity/Activity";

interface HomeScreenProps {}

const HomeScreen: React.FC<HomeScreenProps> = () => {
  const theme = useTheme();
  const [events, setEvents] = useState<AppEventsWithChildren[]>([]);
  const [checkedEvents, setCheckedEvents] = useState<number[]>([]);
  const { colors } = theme;
  const styles = useMemo(() => createStyles(theme), [theme]);
  const {
    data,
    isError,
    fetchNextPage,
    isFetchingNextPage,
    hasNextPage,
    isFetching: loading,
    error,
  } = useInfiniteQuery(
    ["fetch-events"],
    async ({ pageParam = 1 }) => {
      const res = await appApi.fetchEvents(pageParam, 25);
      if (res.code === 200) {
        return res.data!.data;
      } else {
        throw res;
      }
    },
    {
      getNextPageParam: (_lastPage, allPages) => {
        // console.log(name, _lastPage)
        if (_lastPage.events && _lastPage.events.length > 0) {
          return allPages.length + 1;
        }
        return undefined;
      },
      staleTime: Infinity,
    },
  );

  useEffect(() => {
    if (data) {
      const _events = resolveAppEvents(flatMap(data.pages, (d) => d.events));
      Reactotron.log!(_events);
      setEvents(_events);
    }
  }, [data]);
  useEffect(() => {
    if (isError && error) Alert.alert("Error", "Something went wrong");
  }, [isError, error]);

  const handleItemPress = (index: number) => {
    setCheckedEvents((c) => {
      if (c.includes(index)) {
        return c.filter((i) => i !== index);
      }

      return concat(c, index);
    });
  };

  /* -------------------------------------------------------------------------- */
  /*                               Render Methods                               */
  /* -------------------------------------------------------------------------- */

  const List = (
    <View style={styles.listContainer}>
      <FlatList
        data={events}
        keyExtractor={(_, index) => `activity${index}`}
        renderItem={({ item, index }) => (
          <Activity
            activity={item}
            checked={checkedEvents.includes(index)}
            onPressCheck={() => handleItemPress(index)}
          />
        )}
      />
    </View>
  );
  const Loading = (
    <View style={styles.listContainer}>
      <ActivityIndicator />
    </View>
  );

  const Content = (
    <View style={styles.contentContainer}>
      {loading && Loading}
      {List}
    </View>
  );

  return (
    <SafeAreaView style={styles.container}>
      {Content}
      <View></View>
    </SafeAreaView>
  );
};

export default HomeScreen;
