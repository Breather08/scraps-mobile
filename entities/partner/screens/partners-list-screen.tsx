import { useEffect, useState } from "react";
import { fetchPartners } from "../api";
import { Partner } from "../types";
import PartnerCard from "../components/partner-card";
import { FlatList, RefreshControl, StyleSheet, Text, View } from "react-native";

export default function PartnersListScreen() {
  const [partners, setPartners] = useState<Partner[]>([]);
  const [isRefreshing, setIsRefreshing] = useState(false);

  useEffect(() => {
    makePartnersRequest();
  }, []);

  async function makePartnersRequest() {
    setIsRefreshing(true);
    const response = await fetchPartners();
    setPartners(response);
    setIsRefreshing(false);
  }

  return (
    partners[0] && (
      <FlatList
        contentContainerStyle={styles.container}
        data={partners}
        keyExtractor={(item) => item.id}
        renderItem={({ item, index }) => (
          <PartnerCard partner={item} key={index} />
        )}
        refreshControl={
          <RefreshControl
            refreshing={isRefreshing}
            onRefresh={makePartnersRequest}
          />
        }
      />
    )
  );
}

const styles = StyleSheet.create({
  container: { padding: 12, gap: 10 },
});
