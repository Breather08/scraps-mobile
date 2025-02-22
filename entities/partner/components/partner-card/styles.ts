import { StyleSheet } from "react-native";

const styles = StyleSheet.create({
  card: {
    width: "100%",
    backgroundColor: "#fff",
    borderRadius: 12,
    overflow: "visible",
    shadowColor: "#000",
    shadowOpacity: 0.1,
    shadowRadius: 4,
    elevation: 4,
  },
  imageContainer: {
    position: "relative",
  },
  image: {
    width: "100%",
    height: 120,
  },
  logo: {
    position: "absolute",
    top: 10,
    left: 10,
    width: 80,
    height: 30,
    resizeMode: "contain",
    backgroundColor: "white",
    borderRadius: 5,
    padding: 5,
  },
  favoriteIcon: {
    position: "absolute",
    top: 10,
    right: 10,
    backgroundColor: "white",
    padding: 6,
    borderRadius: 50,
    elevation: 2,
  },
  details: {
    padding: 12,
  },
  row: {
    flexDirection: "row",
    alignItems: "center",
    marginBottom: 5,
  },
  name: {
    fontSize: 16,
    fontWeight: "bold",
    marginRight: 5,
  },
  rating: {
    fontSize: 14,
    color: "#555",
    marginLeft: 3,
  },
  boldText: {
    fontWeight: "bold",
    marginLeft: 5,
  },
  time: {
    marginLeft: 5,
    color: "#555",
  },
  distance: {
    marginLeft: 5,
    color: "#555",
  },
  priceSection: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "space-between",
    marginTop: 10,
  },
  cartButton: {
    flexDirection: "row",
    alignItems: "center",
    backgroundColor: "#E68A00",
    borderRadius: 20,
    paddingVertical: 6,
    paddingHorizontal: 10,
  },
  cartText: {
    color: "white",
    marginLeft: 5,
  },
  priceTag: {
    backgroundColor: "#007F5F",
    borderRadius: 20,
    paddingVertical: 6,
    paddingHorizontal: 15,
  },
  price: {
    color: "white",
    fontWeight: "bold",
  },
});

export default styles;
