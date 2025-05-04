import React from "react";
import { 
  Pressable, 
  StyleSheet, 
  Text, 
  View, 
  ViewStyle, 
  TextStyle,
  ActivityIndicator
} from "react-native";
import { MaterialCommunityIcons, Ionicons } from "@expo/vector-icons";

// Brand color constant
const BRAND_COLOR = "#2ecc71";
const DANGER_COLOR = "#ff6b6b";

export type ButtonVariant = "primary" | "secondary" | "outline" | "text" | "danger" | "icon" | "translucent";
export type ButtonSize = "small" | "medium" | "large";
export type IconType = "material" | "ionicons";

export interface ButtonProps {
  children?: React.ReactNode | React.ReactNode[];
  title?: string;
  onPress: () => void;
  variant?: ButtonVariant;
  size?: ButtonSize;
  disabled?: boolean;
  loading?: boolean;
  leftIcon?: string;
  rightIcon?: string;
  style?: ViewStyle | ViewStyle[];
  textStyle?: TextStyle;
  iconColor?: string;
  iconSize?: number;
  fullWidth?: boolean;
  iconOnly?: boolean;
  iconType?: IconType;
}

export default function Button({ 
  children, 
  title, 
  onPress, 
  variant = "primary", 
  size = "medium", 
  disabled = false, 
  loading = false,
  leftIcon,
  rightIcon,
  style,
  textStyle,
  iconColor,
  iconSize,
  fullWidth = false,
  iconOnly = false,
  iconType = "material"
}: ButtonProps) {
  
  // Determine icon sizing based on button size
  const getIconSize = () => {
    if (iconSize) return iconSize;
    
    switch (size) {
      case "small": return 16;
      case "large": return 24;
      default: return 20;
    }
  };
  
  // Determine the icon color based on variant and disabled state
  const getIconColor = () => {
    if (iconColor) return iconColor;
    
    if (disabled) return "#999";
    
    switch (variant) {
      case "primary": return "#fff";
      case "secondary": return BRAND_COLOR;
      case "outline": return BRAND_COLOR;
      case "text": return BRAND_COLOR;
      case "danger": return variant === "danger" ? "#fff" : DANGER_COLOR;
      case "icon": return BRAND_COLOR;
      case "translucent": return "#fff";
      default: return "#fff";
    }
  };

  const buttonStyles = [
    styles.baseButton,
    styles[`${variant}Button`],
    styles[`${size}Button`],
    iconOnly && styles.iconOnlyButton,
    disabled && styles.disabledButton,
    disabled && variant === "primary" && styles.disabledPrimaryButton,
    disabled && variant === "danger" && styles.disabledDangerButton,
    fullWidth && styles.fullWidth,
    style
  ];

  const textStyles = [
    styles.baseText,
    styles[`${variant}Text`],
    styles[`${size}Text`],
    disabled && styles.disabledText,
    textStyle
  ];

  const contentContainerStyles = [
    styles.contentContainer,
    (leftIcon || rightIcon) && styles.contentWithIcon
  ];

  // Render loading state
  if (loading) {
    return (
      <Pressable style={buttonStyles} disabled={true}>
        <View style={contentContainerStyles}>
          <ActivityIndicator 
            size={size === "small" ? "small" : "small"} 
            color={variant === "primary" ? "#fff" : BRAND_COLOR} 
          />
          {title && <Text style={[textStyles, styles.loadingText]}>{title}</Text>}
        </View>
      </Pressable>
    );
  }

  // Icon-only button rendering
  if (variant === "icon" || iconOnly) {
    return (
      <Pressable 
        style={({ pressed }) => [
          variant === "icon" ? styles.iconButton : buttonStyles,
          pressed && !disabled && styles.pressed,
          disabled && styles.disabledButton,
          style
        ]} 
        onPress={onPress}
        disabled={disabled}
      >
        {leftIcon && iconType === "material" && (
          <MaterialCommunityIcons 
            name={leftIcon as any} 
            size={getIconSize()} 
            color={getIconColor()} 
          />
        )}
        {leftIcon && iconType === "ionicons" && (
          <Ionicons 
            name={leftIcon as any} 
            size={getIconSize()} 
            color={getIconColor()} 
          />
        )}
        {children}
      </Pressable>
    );
  }

  // Regular button rendering
  return (
    <Pressable 
      style={({ pressed }) => [
        ...buttonStyles,
        pressed && !disabled && styles.pressed,
        pressed && !disabled && variant === "primary" && styles.primaryPressed,
        pressed && !disabled && variant === "danger" && styles.dangerPressed,
      ]} 
      onPress={onPress}
      disabled={disabled}
    >
      <View style={contentContainerStyles}>
        {leftIcon && iconType === "material" && (
          <MaterialCommunityIcons 
            name={leftIcon as any} 
            size={getIconSize()} 
            color={getIconColor()} 
            style={styles.leftIcon} 
          />
        )}
        {leftIcon && iconType === "ionicons" && (
          <Ionicons 
            name={leftIcon as any} 
            size={getIconSize()} 
            color={getIconColor()} 
            style={styles.leftIcon} 
          />
        )}
        
        {title && <Text style={textStyles}>{title}</Text>}
        
        {children}
        
        {rightIcon && iconType === "material" && (
          <MaterialCommunityIcons 
            name={rightIcon as any} 
            size={getIconSize()} 
            color={getIconColor()} 
            style={styles.rightIcon} 
          />
        )}
        {rightIcon && iconType === "ionicons" && (
          <Ionicons 
            name={rightIcon as any} 
            size={getIconSize()} 
            color={getIconColor()} 
            style={styles.rightIcon} 
          />
        )}
      </View>
    </Pressable>
  );
}

const styles = StyleSheet.create({
  baseButton: {
    borderRadius: 12,
    justifyContent: "center",
    alignItems: "center",
  },
  primaryButton: {
    backgroundColor: BRAND_COLOR,
  },
  secondaryButton: {
    backgroundColor: "rgba(46, 204, 113, 0.1)",
  },
  outlineButton: {
    backgroundColor: "transparent",
    borderWidth: 1,
    borderColor: BRAND_COLOR,
  },
  textButton: {
    backgroundColor: "transparent",
    paddingHorizontal: 0,
    paddingVertical: 4,
  },
  dangerButton: {
    backgroundColor: DANGER_COLOR,
  },
  iconButton: {
    borderRadius: 50,
    width: 40,
    height: 40,
    justifyContent: "center",
    alignItems: "center",
    backgroundColor: "rgba(255, 255, 255, 0.9)",
  },
  translucentButton: {
    backgroundColor: "rgba(255, 255, 255, 0.15)",
    borderRadius: 50,
  },
  iconOnlyButton: {
    borderRadius: 50,
    width: 40,
    height: 40,
    padding: 0,
    minWidth: 0,
    justifyContent: "center",
    alignItems: "center",
  },
  smallButton: {
    paddingVertical: 8,
    paddingHorizontal: 12,
    minWidth: 80,
  },
  mediumButton: {
    paddingVertical: 12,
    paddingHorizontal: 16,
    minWidth: 120,
  },
  largeButton: {
    paddingVertical: 16,
    paddingHorizontal: 24,
    minWidth: 160,
  },
  pressed: {
    opacity: 0.85,
  },
  primaryPressed: {
    backgroundColor: "#27ae60",
  },
  dangerPressed: {
    backgroundColor: "#e74c3c",
  },
  disabledButton: {
    opacity: 0.6,
  },
  disabledPrimaryButton: {
    backgroundColor: "#a8e6bc",
  },
  disabledDangerButton: {
    backgroundColor: "#ffb0b0",
  },
  baseText: {
    fontWeight: "600",
    textAlign: "center",
  },
  primaryText: {
    color: "#fff",
  },
  secondaryText: {
    color: BRAND_COLOR,
  },
  outlineText: {
    color: BRAND_COLOR,
  },
  textText: {
    color: BRAND_COLOR,
  },
  dangerText: {
    color: "#fff",
  },
  iconText: {
    color: BRAND_COLOR,
  },
  translucentText: {
    color: "#fff",
  },
  smallText: {
    fontSize: 14,
  },
  mediumText: {
    fontSize: 16,
  },
  largeText: {
    fontSize: 18,
  },
  disabledText: {
    color: "#888",
  },
  fullWidth: {
    width: "100%",
  },
  contentContainer: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "center",
  },
  contentWithIcon: {
    justifyContent: "center",
  },
  leftIcon: {
    marginRight: 8,
  },
  rightIcon: {
    marginLeft: 8,
  },
  loadingText: {
    marginLeft: 8,
  }
});
