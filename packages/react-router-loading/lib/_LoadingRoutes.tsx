import React, {
  useState,
  useContext,
  useEffect,
  useMemo,
  useRef,
  PropsWithChildren,
  FC,
} from "react";
import {
  useLocation,
  Location,
  useNavigationType,
  NavigationType,
} from "react-router";
import { LoadingContext, LoadingGetterContext } from "./LoadingContext";
import {
  createRoutesFromChildren,
  isLoadable,
  isPathsDifferent,
} from "./utils";
import { RouteWrapper } from "./_RouteWrapper";

interface LoadingRoutesProps {
  loadingScreen?: React.ElementType;
  maxLoadingTime?: number;
}

// eslint-disable-next-line @typescript-eslint/ban-ts-comment
// @ts-ignore
window.cachedRoutes = {};

const LoadingRoutes: FC<PropsWithChildren<LoadingRoutesProps>> = ({
  children,
  loadingScreen: LoadingScreen,
}) => {
  // 🪝 Hooks
  const location = useLocation();
  const navigationType = useNavigationType();
  const loadingContext = useContext(LoadingContext);
  const isCurrentlyLoading = useContext(LoadingGetterContext);

  const prevLocation: any = useRef();
  const prevNavigationType: any = useRef();
  const mount: any = useRef(false);

  // 🗄 State
  const routes = useMemo(() => createRoutesFromChildren(children), [children]);
  const [, forceUpdate] = useState({});

  const isPageLoadable = isLoadable(location, routes);
  // eslint-disable-next-line @typescript-eslint/ban-ts-comment
  // @ts-ignore
  const isNormal = !isPageLoadable || window.cachedRoutes[location.pathname];

  // 🔄 Lifecycle
  // when location was changed
  useEffect(() => {
    if (isNormal) {
      if (isCurrentlyLoading) {
        loadingContext.done();
      }
      prevLocation.current = { ...location };
      prevNavigationType.current = navigationType;
    } else {
      if (isPathsDifferent(location, prevLocation.current)) {
        mount.current = false;
        loadingContext.start();
      }
    }
  }, [location, isNormal]);

  useEffect(() => {
    if (
      !isCurrentlyLoading &&
      mount.current &&
      isPathsDifferent(prevLocation.current, location) &&
      !isNormal
    ) {
      prevLocation.current = { ...location };
      prevNavigationType.current = navigationType;
      forceUpdate({});
    }

    if (isCurrentlyLoading && !mount.current) {
      mount.current = true;
    }
  }, [isCurrentlyLoading]);

  if (isNormal) {
    return (
      <RouteWrapper
        routes={routes}
        location={location}
        navigationType={navigationType}
      />
    );
  }

  if (isPageLoadable && !prevLocation.current && LoadingScreen) {
    return (
      <>
        <LoadingScreen />
        <RouteWrapper
          key={location.pathname}
          routes={routes}
          location={location}
          navigationType={navigationType}
          hidden
        />
      </>
    );
  }

  const isDisplayPrev =
    isCurrentlyLoading || isPathsDifferent(prevLocation.current, location);

  return (
    <>
      {isDisplayPrev ? (
        <RouteWrapper
          routes={routes}
          location={prevLocation.current}
          navigationType={prevNavigationType.current}
        />
      ) : (
        <RouteWrapper
          routes={routes}
          location={location}
          navigationType={navigationType}
        />
      )}

      {/* hidden next */}
      {isCurrentlyLoading && (
        <RouteWrapper
          routes={routes}
          location={location}
          navigationType={navigationType}
          hidden
        />
      )}
    </>
  );
};

export default LoadingRoutes;
