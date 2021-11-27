import React from "react";
import localclasses from "./Loader.module.css";
import { SunspotLoader } from "react-awesome-loaders";
function Loader() {
  return (
    <div className={localclasses.load}>
      <SunspotLoader
        gradientColors={["#23A6F0", "#23A6F0"]}
        shadowColor={"#3730A3"}
        desktopSize={"50px"}
        mobileSize={"50px"}
      />
    </div>
  );
}
export default Loader;
