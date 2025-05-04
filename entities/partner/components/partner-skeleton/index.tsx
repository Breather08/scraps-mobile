import React from 'react';
import { View, Animated, Easing, Platform, ViewStyle } from 'react-native';
import { StyleSheet } from 'react-native';
import { useEffect, useRef } from 'react';

interface AnimatedSkeletonItemProps {
  style: ViewStyle;
}

const PartnerSkeleton = () => {
  const fadeAnim = useRef(new Animated.Value(0.3)).current;

  useEffect(() => {
    Animated.loop(
      Animated.sequence([
        Animated.timing(fadeAnim, {
          toValue: 1,
          duration: 800,
          easing: Easing.ease,
          useNativeDriver: true,
        }),
        Animated.timing(fadeAnim, {
          toValue: 0.3,
          duration: 800,
          easing: Easing.ease,
          useNativeDriver: true,
        }),
      ])
    ).start();
  }, [fadeAnim]);

  const AnimatedSkeletonItem = ({ style }: AnimatedSkeletonItemProps) => (
    <Animated.View
      style={[
        style,
        { opacity: fadeAnim, backgroundColor: '#E0E0E0' },
      ]}
    />
  );

  return (
    <View style={styles.card}>
      <AnimatedSkeletonItem style={styles.image} />
      
      <View style={styles.content}>
        <View style={styles.infoRow}>
          <AnimatedSkeletonItem style={styles.infoItem} />
        </View>
        
        <AnimatedSkeletonItem style={styles.bottomText} />
      </View>
    </View>
  );
};

const styles = StyleSheet.create({
  card: {
    width: '100%',
    backgroundColor: '#fff',
    borderRadius: 12,
    overflow: 'hidden',
    marginBottom: 12,
    ...Platform.select({
      ios: {
        shadowColor: '#000',
        shadowOffset: { width: 0, height: 2 },
        shadowOpacity: 0.1,
        shadowRadius: 8,
      },
      android: {
        elevation: 2,
      },
    }),
  },
  image: {
    height: 160,
    width: '100%',
    borderTopLeftRadius: 12,
    borderTopRightRadius: 12,
  },
  content: {
    padding: 14,
  },
  title: {
    height: 20,
    width: '80%',
    borderRadius: 4,
    marginBottom: 10,
  },
  subtitle: {
    height: 16,
    width: '60%',
    borderRadius: 4,
    marginBottom: 16,
  },
  infoRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    marginBottom: 16,
  },
  infoItem: {
    height: 18,
    width: '75%',
    borderRadius: 4,
  },
  bottomText: {
    height: 16,
    width: '50%',
    borderRadius: 4,
  },
});

export default PartnerSkeleton;
