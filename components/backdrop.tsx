import React, { useRef } from "react";
import { View, StyleSheet, Dimensions } from "react-native";

const { height } = Dimensions.get("window");
const MAX_TRANSLATE_Y = -height + 50; // Maximum height the sheet can be dragged up
const MIN_TRANSLATE_Y = -100; // Minimum height the sheet can be dragged down

const CustomBottomSheet = () => {};

export default CustomBottomSheet;
