import React, { useCallback, useRef, useState } from "react";
import { Dimensions, View } from "react-native";
import { Gesture, GestureDetector } from "react-native-gesture-handler";
import Animated, {
  useAnimatedStyle,
  useSharedValue,
  withTiming,
} from "react-native-reanimated";

import ReanimatedCarousel from "react-native-reanimated-carousel";

interface CarouselProps<T> {
  data: T[];
  renderItem: (item: T, index: number) => React.ReactElement;
}

function clamp(val: number, min: number, max: number) {
  "worklet";
  return Math.min(Math.max(val, min), max);
}

export default function Carousel<T>({ data, renderItem }: CarouselProps<T>) {
  const { width: screenWidth } = Dimensions.get("window");

  const CARD_PADDING = 16;
  const CARD_GAP = 8;
  const CARD_WIDTH = screenWidth - CARD_PADDING * 2;
  const ITEM_WIDTH = CARD_WIDTH + CARD_GAP;

  const translateX = useSharedValue(CARD_PADDING);
  const prevTranslateX = useSharedValue(0);
  const currentIndex = useSharedValue(0);

  //   const handleIndexChange = useCallback((newIndex: number) => {
  //     if (onIndexChange) {
  //       onIndexChange(newIndex);
  //     }
  //   }, [onIndexChange]);

  const panGesture = Gesture.Pan()
    .onStart((e) => {
      prevTranslateX.value = translateX.value;
    })
    .onUpdate((e) => {
      if (
        (currentIndex.value === 0 && e.translationX > 0) ||
        (currentIndex.value === data.length - 1 && e.translationX < 0)
      ) {
        translateX.value = prevTranslateX.value + e.translationX * 0.3;
      } else {
        translateX.value = prevTranslateX.value + e.translationX;
      }
    })
    .onEnd((e) => {
      const dx = translateX.value - prevTranslateX.value;
      let newIndex = currentIndex.value;

      // Swipe right (previous)
      if ((dx > 100 || e.velocityX > 100) && currentIndex.value > 0) {
        newIndex = currentIndex.value - 1;
      }
      // Swipe left (next)
      else if (
        (dx < -100 || e.velocityX < -100) &&
        currentIndex.value < data.length - 1
      ) {
        newIndex = currentIndex.value + 1;
      }

      // Update current index
      if (newIndex !== currentIndex.value) {
        currentIndex.value = newIndex;
        //   handleIndexChange(newIndex);
      }

      // Animate to the selected card
      translateX.value = withTiming(
        CARD_PADDING - ITEM_WIDTH * currentIndex.value,
        { duration: 200 }
      );
    });

  const tapGesture = Gesture.Pan().onEnd(() => {
    console.log("Tap End");
  });

  const combinedGestures = Gesture.Simultaneous(tapGesture, panGesture);

  const animatedStyle = useAnimatedStyle(() => {
    return {
      transform: [{ translateX: translateX.value }],
    };
  });

  return (
    <View style={{ flex: 1, paddingBottom: 16 }}>
      <View style={{ flex: 1 }}></View>
      <ReanimatedCarousel
        data={data}
        renderItem={({ index, item }) => renderItem(item, index)}
        height={300}
        loop={false}
        width={screenWidth}
        style={{
          width: screenWidth,
        }}
        mode="parallax"
        modeConfig={{
          parallaxScrollingScale: 0.9,
          parallaxScrollingOffset: 50,
        }}
      />
      <GestureDetector gesture={combinedGestures}>
        <Animated.View
          style={[
            {
              flexDirection: "row",
              width: ITEM_WIDTH * data.length,
            },
            animatedStyle,
          ]}
        >
          {data.map((item, i) => (
            <View
              key={i}
              style={{
                width: CARD_WIDTH,
                marginRight: CARD_GAP,
              }}
            >
              {renderItem(item, i)}
            </View>
          ))}
        </Animated.View>
      </GestureDetector>
    </View>
  );
}
