import dayjs from "dayjs";
import relativeTime from "dayjs/plugin/relativeTime";
import { AppEvents, AppEventsWithChildren } from "../services/models";
import { reduce, last, concat } from "lodash";

dayjs.extend(relativeTime);

export const capitalizeFirstLetter = (str: string) => {
  return str && str.length ? str.charAt(0).toUpperCase() + str.slice(1) : str;
};

export const generateRandomNumber = (min: number, max: number) => {
  return Math.floor(min + Math.random() * (max + 1 - min));
};

export function toDayJs(date: string) {
  return dayjs(date);
}

export function fromNow(date: string) {
  try {
    return toDayJs(date).fromNow();
  } catch (err) {
    return "INVALID_DATE";
  }
}

export function resolveAppEvents(events: AppEvents[]): AppEventsWithChildren[] {
  return reduce(
    events,
    (prev, current) => {
      const previousEvent = last(prev);
      if (
        !!previousEvent &&
        previousEvent.type === current.type &&
        previousEvent.author === current.author
      ) {
        previousEvent.children = concat(previousEvent.children, current);
        return prev;
      } else {
        return concat(prev, { ...current, children: [] });
      }
    },
    [] as AppEventsWithChildren[],
  );
}
