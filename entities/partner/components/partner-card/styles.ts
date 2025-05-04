import { StyleSheet, Platform } from "react-native";

// Brand color constant
const BRAND_COLOR = "#2ecc71";

const styles = StyleSheet.create({
  card: {
    width: "100%",
    backgroundColor: "#fff",
    borderRadius: 12,
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
        elevation: 2,
      },
    }),
  },
  imageContainer: {
    position: "relative",
    height: 160,
  },
  image: {
    width: "100%",
    height: "100%",
    resizeMode: "cover",
  },
  favoriteIcon: {
    position: "absolute",
    top: 12,
    right: 12,
    backgroundColor: "rgba(0, 0, 0, 0.4)",
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
    padding: 14,
  },
  titleSection: {
    position: 'absolute',
    bottom: 0,
    paddingHorizontal: 12,
    width: '100%',
    paddingBottom: 12,
    backgroundColor: 'li'
  },
  name: {
    fontSize: 18,
    fontWeight: "bold",
    color: "#fff",
    marginBottom: 3,
  },
  locationRow: {
    flexDirection: "row",
    alignItems: "center",
  },
  distance: {
    fontSize: 14,
    color: "#fff",
  },
  dot: {
    marginHorizontal: 5,
    fontSize: 14,
    color: "#fff",
  },
  categories: {
    fontSize: 14,
    color: "#fff",
  },
  infoRow: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "space-between",
    marginBottom: 12,
  },
  collectionContainer: {
    flexDirection: "row",
    alignItems: "center",
  },
  dotIndicator: {
    width: 8,
    height: 8,
    borderRadius: 4,
    backgroundColor: BRAND_COLOR,
    marginRight: 8,
  },
  collectionLabel: {
    fontSize: 14,
    color: "#666",
    fontWeight: "500",
  },
  ratingContainer: {
    flexDirection: "row",
    alignItems: "center",
  },
  ratingText: {
    fontSize: 14,
    fontWeight: "500",
    color: "#222",
    marginLeft: 4,
  },
  reviewCount: {
    fontSize: 14,
    color: "#666",
    marginLeft: 2,
  },
  mealsSaved: {
    fontSize: 14,
    fontWeight: "600",
    color: "#FF8C42",
  },
});

export default styles;
