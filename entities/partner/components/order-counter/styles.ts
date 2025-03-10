import { StyleSheet } from "react-native";

const styles = StyleSheet.create({
  wrapper: {
    alignSelf: "center",
    flexDirection: "row",
    alignItems: "center",
    gap: 36,
  },
  btn: {
    alignItems: "center",
    justifyContent: "center",
    width: 45,
    height: 45,
    backgroundColor: "#114D4D",
    borderRadius: 50,
  },
  btnDisabled: {
    backgroundColor: "grey",
  },
  count: {
    fontSize: 64,
  },
});

export default styles;
