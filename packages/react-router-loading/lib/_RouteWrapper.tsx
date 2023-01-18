/* eslint-disable camelcase */
import React, { useMemo, FC } from "react";
import {
  Location,
  NavigationType,
  UNSAFE_LocationContext,
  useRoutes,
} from "react-router";
import { LoadingRouteContext } from "./LoadingContext";
import { LoadingRouteObject } from "./utils";

interface RouteWrapperProps {
  routes: LoadingRouteObject[];
  location: Location;
  navigationType: NavigationType;
  hidden?: boolean;
}

export const RouteWrapper: FC<RouteWrapperProps> = ({
  routes,
  location,
  navigationType,
  hidden = false,
}) => {
  const element = useRoutes(routes, location);

  return (
    <LoadingRouteContext.Provider value={hidden}>
      <div style={hidden ? { display: "none" } : undefined}>
        {useMemo(
          () => (
            <UNSAFE_LocationContext.Provider
              value={{ location, navigationType }}
            >
              {element}
            </UNSAFE_LocationContext.Provider>
          ),
          [location, hidden]
        )}
      </div>
    </LoadingRouteContext.Provider>
  );
};
