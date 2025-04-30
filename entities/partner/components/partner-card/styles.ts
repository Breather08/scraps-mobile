import { StyleSheet, Platform } from "react-native";

const styles = StyleSheet.create({
  card: {
    width: "100%",
    backgroundColor: "#fff",
    borderRadius: 16,
    overflow: "hidden",
    marginBottom: 12,
    // Better shadow implementation for both platforms
    ...Platform.select({
      ios: {
        shadowColor: "#000",
        shadowOffset: { width: 0, height: 2 },
        shadowOpacity: 0.1,
        shadowRadius: 8,
      },
      android: {
        elevation: 4,
      },
    }),
  },
  imageContainer: {
    position: "relative",
    height: 140,
  },
  image: {
    width: "100%",
    height: "100%",
    resizeMode: "cover",
  },
  logo: {
    position: "absolute",
    top: 12,
    left: 12,
    width: 80,
    height: 32,
    resizeMode: "contain",
    backgroundColor: "rgba(255, 255, 255, 0.95)",
    borderRadius: 8,
    padding: 5,
    ...Platform.select({
      ios: {
        shadowColor: "#000",
        shadowOffset: { width: 0, height: 1 },
        shadowOpacity: 0.2,
        shadowRadius: 2,
      },
      android: {
        elevation: 3,
      },
    }),
  },
  favoriteIcon: {
    position: "absolute",
    top: 12,
    right: 12,
    backgroundColor: "rgba(255, 255, 255, 0.95)",
    padding: 8,
    borderRadius: 50,
    ...Platform.select({
      ios: {
        shadowColor: "#000",
        shadowOffset: { width: 0, height: 1 },
        shadowOpacity: 0.2,
        shadowRadius: 2,
      },
      android: {
        elevation: 3,
      },
    }),
  },
  details: {
    padding: 16,
  },
  // Added nameRow for better structure
  nameRow: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "space-between",
    marginBottom: 8,
  },
  // Added ratingContainer for better style of ratings
  ratingContainer: {
    flexDirection: "row",
    alignItems: "center",
    backgroundColor: "rgba(255, 193, 7, 0.1)",
    paddingHorizontal: 8,
    paddingVertical: 4,
    borderRadius: 12,
  },
  // Added divider for visual separation
  divider: {
    height: 1,
    backgroundColor: "#f0f0f0",
    marginVertical: 8,
  },
  row: {
    flexDirection: "row",
    alignItems: "center",
    marginBottom: 8,
  },
  name: {
    fontSize: 18,
    fontWeight: "bold",
    marginRight: 8,
    color: "#333",
    flex: 1,
  },
  rating: {
    fontSize: 14,
    fontWeight: "600",
    color: "#333",
    marginLeft: 4,
  },
  boldText: {
    fontWeight: "600",
    marginLeft: 8,
    color: "#333",
  },
  time: {
    marginLeft: 6,
    color: "#555",
    fontSize: 14,
  },
  // Added status indicator styles
  statusIndicator: {
    paddingHorizontal: 8,
    paddingVertical: 2,
    borderRadius: 10,
    marginLeft: 8,
  },
  statusOpen: {
    backgroundColor: "rgba(46, 204, 113, 0.15)",
  },
  statusClosed: {
    backgroundColor: "rgba(231, 76, 60, 0.15)",
  },
  statusText: {
    fontSize: 12,
    fontWeight: "500",
    color: "#333",
  },
  distance: {
    marginLeft: 8,
    color: "#555",
    fontSize: 14,
  },
  priceSection: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "space-between",
    marginTop: 12,
  },
  cartButton: {
    flexDirection: "row",
    alignItems: "center",
    backgroundColor: "#2ecc71",
    borderRadius: 24,
    paddingVertical: 8,
    paddingHorizontal: 12,
    ...Platform.select({
      ios: {
        shadowColor: "#000",
        shadowOffset: { width: 0, height: 1 },
        shadowOpacity: 0.2,
        shadowRadius: 2,
      },
      android: {
        elevation: 2,
      },
    }),
  },
  cartText: {
    color: "white",
    marginLeft: 6,
    fontWeight: "600",
  },
  priceTag: {
    flexDirection: "row",
    alignItems: "center",
    gap: 8,
    backgroundColor: "#2ecc71",
    borderRadius: 24,
    paddingVertical: 8,
    paddingHorizontal: 16,
    ...Platform.select({
      ios: {
        shadowColor: "#000",
        shadowOffset: { width: 0, height: 1 },
        shadowOpacity: 0.2,
        shadowRadius: 2,
      },
      android: {
        elevation: 2,
      },
    }),
  },
  price: {
    color: "white",
    fontWeight: "bold",
    fontSize: 15,
  },
});

export default styles;
