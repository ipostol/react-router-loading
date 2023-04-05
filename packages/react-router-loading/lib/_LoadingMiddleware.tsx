import React, {
  useState,
  useMemo,
  useCallback,
  useEffect,
  useRef,
  FC,
  PropsWithChildren,
} from "react";
import { LoadingContext, LoadingGetterContext } from "./LoadingContext";
import { topbar } from ".";

const LoadingMiddleware: FC<PropsWithChildren<{ isLoading?: boolean }>> = ({
  children,
  isLoading = false,
}) => {
  const timeout: any = useRef();
  const [loading, setLoading] = useState(isLoading);
  const isFirstRender = useRef(true);

  const start = useCallback(() => {
    clearTimeout(timeout.current);
    timeout.current = setTimeout(() => {
      topbar.show();
    }, 70);

    setLoading(true);
  }, []);

  const done = useCallback(() => {
    clearTimeout(timeout.current);
    topbar.hide();
    setLoading(false);
  }, []);

  const restart = useCallback(() => {
    clearTimeout(timeout.current);
    topbar.hide();
    topbar.show();
  }, []);

  useEffect(() => {
    if (!isFirstRender.current) {
      if (isLoading && !loading) start();
      else if (loading) done();
    } else {
      isFirstRender.current = false;
    }
  }, [isLoading]);

  const loadingProvider = useMemo(
    () => (
      <LoadingContext.Provider
        value={{ start, done, restart, isFirstRenderRef: isFirstRender }}
      >
        {children}
      </LoadingContext.Provider>
    ),
    []
  );

  return (
    <LoadingGetterContext.Provider value={loading}>
      {loadingProvider}
    </LoadingGetterContext.Provider>
  );
};

export default LoadingMiddleware;
