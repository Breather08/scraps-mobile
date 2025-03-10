import { StyleSheet } from "react-native";

const styles = StyleSheet.create({
  container: {
    flex: 1,
  },
  imageContainer: {
    position: "relative",
  },
  image: {
    width: "100%",
    height: 220,
  },
  buttonsContainer: {
    flex: 1,
    position: "absolute",
    top: 16,
    left: 16,
    flexDirection: "row",
    justifyContent: "space-between",
    gap: 10,
  },
  iconButton: {
    backgroundColor: "white",
    padding: 10,
    borderRadius: 50,
    shadowColor: "#000",
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 3,
    elevation: 3,
  },
  contentContainer: {
    padding: 16,
    backgroundColor: "white",
    borderTopLeftRadius: 20,
    borderTopRightRadius: 20,
    marginTop: -20,
  },
  title: {
    fontSize: 18,
    fontWeight: "bold",
    textAlign: "center",
  },
  rating: {
    color: "#ffcc00",
    textAlign: "center",
    marginVertical: 4,
  },
  separator: {
    borderBottomWidth: 1,
    borderBottomColor: "#ddd",
    marginVertical: 10,
  },
  row: {
    flexDirection: "row",
    alignItems: "center",
    gap: 8,
    marginBottom: 8,
  },
  text: {
    color: "#555",
    fontSize: 14,
  },
  boldText: {
    fontWeight: "bold",
  },
  sectionTitle: {
    fontSize: 16,
    fontWeight: "bold",
    marginTop: 10,
  },
  ctaText: {
    color: "white",
    fontWeight: "bold",
    fontSize: 16,
  },
  ctaCaption: {
    color: "#fff",
    fontSize: 10,
  },
  bottomSheetContent: {
    flex: 1,
    padding: 36,
    alignItems: "center",
  },
});

export default styles;
