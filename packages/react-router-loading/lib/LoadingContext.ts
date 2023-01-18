import { createContext } from "react";

// Interface

export interface LoadingContextActions {
  start: () => void;
  done: () => void;
  restart: () => void;
}

// Actions

const LoadingContext = createContext<LoadingContextActions>({
  start: () => {},
  done: () => {},
  restart: () => {},
});
LoadingContext.displayName = "LoadingContext";

// Value

const LoadingGetterContext = createContext<boolean>(false);
LoadingGetterContext.displayName = "LoadingGetterContext";

const LoadingRouteContext = createContext<boolean>(false);
LoadingRouteContext.displayName = "LoadingRouteContext";

export { LoadingContext, LoadingGetterContext, LoadingRouteContext };
