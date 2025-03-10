import { StyleSheet, View } from "react-native";
import { LatLng, Marker } from "react-native-maps";

export default function CurrentLocationMarker({
  coordinate,
}: {
  coordinate: LatLng;
}) {
  return (
    <Marker
      coordinate={coordinate}
      title="Current Location"
      description="asdasd"
    >
      <View style={styles.marker}>
        <View
          style={{
            borderRadius: "50%",
            backgroundColor: "blue",
            width: 12,
            height: 12,
          }}
        ></View>
      </View>
    </Marker>
  );
}

const styles = StyleSheet.create({
  marker: {
    borderRadius: "50%",
    width: 24,
    height: 24,
    backgroundColor: "white",
    justifyContent: "center",
    alignItems: "center",
  },
});
