import React, { useEffect, useMemo, useRef, useState } from "react";
import {
  ActivityIndicator,
  Alert,
  FlatList,
  Image,
  SafeAreaView,
  TouchableOpacity,
  View,
} from "react-native";
import { useTheme } from "@react-navigation/native";
// import { SafeAreaView } from "react-native-safe-area-context";
import { useInfiniteQuery } from "@tanstack/react-query";
import { flatMap, last } from "lodash";
/**
 * ? Local Imports
 */
import createStyles from "./HomeScreen.style";
import Text from "@shared-components/text-wrapper/TextWrapper";
import appApi from "@api";
import { AppEventsWithChildren } from "@services/models";
import { resolveAppEvents } from "@utils";
import Activity from "./components/events/Events";
import Spacer from "@shared-components/spacer/Spacer";

interface HomeScreenProps {}

const HomeScreen: React.FC<HomeScreenProps> = () => {
  const mapRef = useRef(new Map<number, string>());
  const theme = useTheme();
  const [events, setEvents] = useState<AppEventsWithChildren[]>([]);
  const { colors } = theme;
  const styles = useMemo(() => createStyles(theme), [theme]);
  const {
    data,
    isError,
    fetchNextPage,
    isFetchingNextPage,
    hasNextPage,
    isLoading: loading,
    error,
  } = useInfiniteQuery(
    ["fetch-events"],
    async ({ pageParam = 1 }) => {
      const res = await appApi.fetchEvents(pageParam, 5);
      if (res.code === 200) {
        return res.data!.data;
      } else {
        throw res;
      }
    },
    {
      getNextPageParam: (_lastPage, allPages) => {
        // console.log(name, _lastPage)
        if (_lastPage.remaining && _lastPage.remaining > 0) {
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
      setEvents(_events);
    }
  }, [data]);
  useEffect(() => {
    if (isError && error) Alert.alert("Error", "Something went wrong");
  }, [isError, error]);

  const handleItemPress = (index: number) => {
    mapRef.current.has(index)
      ? mapRef.current.delete(index)
      : mapRef.current.set(index, "text");
  };

  const fetchNext = () => {
    if (hasNextPage) {
      fetchNextPage();
    }
  };

  /* -------------------------------------------------------------------------- */
  /*                               Render Methods                               */
  /* -------------------------------------------------------------------------- */

  const Loading = (
    <View style={styles.loadingContainer}>
      <ActivityIndicator />
    </View>
  );

  const _last = last(data?.pages || []);
  const remaining = _last?.remaining || 0;
  return (
    <SafeAreaView style={styles.container}>
      {loading && Loading}
      <View style={styles.container}>
        <FlatList
          data={events}
          keyExtractor={(_, index) => `activity${index}`}
          renderItem={({ item, index }) => (
            <Activity
              activity={item}
              onPressCheck={() => handleItemPress(index)}
            />
          )}
        />
      </View>
      <TouchableOpacity onPress={fetchNext}>
        <View style={styles.bottomNext}>
          <Image source={require("../../assets/images/file.png")} />
          <Spacer spacing={5} direction="horizontal" />
          <Text color={remaining > 0 ? colors.primary : "#757575"}>
            {remaining > 0 ? `Show ${remaining} more events` : "All done"}
          </Text>
          <Spacer spacing={5} direction="horizontal" />
          {isFetchingNextPage && <ActivityIndicator />}
        </View>
      </TouchableOpacity>
    </SafeAreaView>
  );
};

export default HomeScreen;
