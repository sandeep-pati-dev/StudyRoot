import React from "react";
import { Skeleton } from "./skeleton";

const LoadingScreen = () => {
  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-white bg-opacity-80 backdrop-blur-sm">
      <Skeleton className="w-24 h-24 rounded-full" />
    </div>
  );
};

export default LoadingScreen;
