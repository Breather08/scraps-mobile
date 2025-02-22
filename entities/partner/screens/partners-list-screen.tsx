import { useEffect, useState } from "react";
import { fetchPartners } from "../api";
import { Partner } from "../types";
import PartnerCard from "../components/partner-card";
import { FlatList, Text, View } from "react-native";

export default function PartnersListScreen() {
  const [partners, setPartners] = useState<Partner[]>([]);

  useEffect(() => {
    (async () => {
      const response = await fetchPartners();
      setPartners(response);
    })();
  }, []);

  return (
    <FlatList
      contentContainerStyle={{ padding: 12, gap: 10 }}
      data={partners}
      keyExtractor={(item) => item.id}
      renderItem={({ item }) => <PartnerCard partner={item} />}
    />
  );
}
