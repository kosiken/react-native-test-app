import { slice } from "lodash";
import { AppEvents } from "../models";

import data from "../../shared/constants/mock.json";
import ApiBase, { Methods } from "./apiBase";

const events = (data as AppEvents[]).sort(
  (a, b) => new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime(),
);

class AppApi extends ApiBase {
  public resetAppState() {}
  private static _instance: AppApi;
  public fetchEvents(page: number, limit = 5) {
    const nextIndex = (page - 1) * limit;
    const response = slice(events, nextIndex, nextIndex + (limit - 1));

    return this.createMockRequest<
      {
        status: boolean;
        message: string;
        data: { events: AppEvents[]; remaining: number };
      },
      never
    >("/events", Methods.GET)(
      {
        status: true,
        message: "Events fetched successfully",
        data: {
          events: response,
          remaining: events.length - (nextIndex + limit),
        },
      },
      2000,
    );
  }
  public static get Instance() {
    return (
      this._instance ||
      (this._instance = new AppApi("https://api.example.com/core/v1"))
    );
  }
}

export default AppApi.Instance;
