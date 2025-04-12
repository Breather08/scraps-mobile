import { View } from "react-native";
import {
  Gesture,
  GestureDetector,
  GestureHandlerRootView,
} from "react-native-gesture-handler";
import { useSharedValue } from "react-native-reanimated";

export default function Backdrop() {
  const translateY = useSharedValue(0);

  const panGesture = Gesture.Pan()
    .onStart((e) => {})
    .onUpdate((e) => {
      translateY.value = e.translationY;
    });

  return (
    <GestureHandlerRootView>
      <GestureDetector gesture={panGesture}>
        <View style={{ width: 30, height: 30, backgroundColor: "red" }}></View>
      </GestureDetector>
    </GestureHandlerRootView>
  );
}
