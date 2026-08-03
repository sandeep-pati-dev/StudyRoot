import React from "react";
import { useIsFetching } from "@tanstack/react-query";
import LoadingScreen from "./LoadingScreen";

const GlobalLoadingIndicator = () => {
  const isFetching = useIsFetching();

  if (isFetching > 0) {
    return <LoadingScreen />;
  }

  return null;
};

export default GlobalLoadingIndicator;
