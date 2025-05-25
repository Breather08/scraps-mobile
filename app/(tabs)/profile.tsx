import React from "react";
import {
  StyleSheet,
  Text,
  View,
  TouchableOpacity,
  ScrollView,

  ActivityIndicator,
  Switch,
  Alert,
} from "react-native";
import { MaterialCommunityIcons } from "@expo/vector-icons";
import { StatusBar } from "expo-status-bar";
import { SafeAreaView } from "react-native-safe-area-context";
import { useAuth } from "@/providers/auth-provider";

import Island from "@/components/island";
import Button from "@/components/ui/button";

function ProfileScreen() {
  const { user, logout, loading } = useAuth();
  const [darkMode, setDarkMode] = React.useState(false);
  const [notifications, setNotifications] = React.useState(true);

  const handleLogout = async () => {
    Alert.alert(
      "Выйти из аккаунта",
      "Вы уверены, что хотите выйти?",
      [
        {
          text: "Отмена",
          style: "cancel",
        },
        {
          text: "Выйти",
          onPress: async () => {
            await logout();
            // Redirect is handled by the auth context
          },
          style: "destructive",
        },
      ]
    );
  };

  if (loading) {
    return (
      <View style={styles.loadingContainer}>
        <ActivityIndicator size="large" color="#2ecc71" />
      </View>
    );
  }

  return (
    <SafeAreaView style={styles.container}>
      <StatusBar style="dark" backgroundColor="white" />

      <ScrollView 
        style={styles.scrollView}
        showsVerticalScrollIndicator={false}
      >
        <View style={styles.islandsContainer}>
          <Island topFlat style={styles.avatarBlock}>
            <View style={styles.avatarContainer}>
              <View style={styles.avatar}>
                <Text style={styles.avatarText}>{user?.phone ? user.phone[1] : "У"}</Text>
              </View>
            </View>
            <Text style={styles.userName}>{user?.phone || "Пользователь"}</Text>
            <Text style={styles.userPhone}>{user?.phone || "Номер не указан"}</Text>
          </Island>

          <Island>
            <Text style={styles.sectionTitle}>Настройки</Text>
            
            <View style={styles.settingItem}>
              <View style={styles.settingLeft}>
                <MaterialCommunityIcons name="theme-light-dark" size={24} color="#555" />
                <Text style={styles.settingLabel}>Темная тема</Text>
              </View>
              <Switch
                trackColor={{ false: "#e0e0e0", true: "#a8e6bc" }}
                thumbColor={darkMode ? "#2ecc71" : "#f4f3f4"}
                onValueChange={() => setDarkMode(prev => !prev)}
                value={darkMode}
              />
            </View>
            
            <View style={styles.settingItem}>
              <View style={styles.settingLeft}>
                <MaterialCommunityIcons name="bell-outline" size={24} color="#555" />
                <Text style={styles.settingLabel}>Уведомления</Text>
              </View>
              <Switch
                trackColor={{ false: "#e0e0e0", true: "#a8e6bc" }}
                thumbColor={notifications ? "#2ecc71" : "#f4f3f4"}
                onValueChange={() => setNotifications(prev => !prev)}
                value={notifications}
              />
            </View>
          </Island>

          <Island bottomFlat>
            <Text style={styles.sectionTitle}>Аккаунт</Text>

            <TouchableOpacity style={styles.menuItem} onPress={() => {}}>  
              <View style={styles.menuItemLeft}>
                <MaterialCommunityIcons name="account-edit-outline" size={24} color="#555" />
                <Text style={styles.menuItemText}>Редактировать профиль</Text>
              </View>
              <MaterialCommunityIcons name="chevron-right" size={24} color="#999" />
            </TouchableOpacity>

            <TouchableOpacity style={styles.menuItem} onPress={() => {}}>
              <View style={styles.menuItemLeft}>
                <MaterialCommunityIcons name="history" size={24} color="#555" />
                <Text style={styles.menuItemText}>История заказов</Text>
              </View>
              <MaterialCommunityIcons name="chevron-right" size={24} color="#999" />
            </TouchableOpacity>

            <TouchableOpacity style={styles.menuItem} onPress={() => {}}>
              <View style={styles.menuItemLeft}>
                <MaterialCommunityIcons name="shield-check-outline" size={24} color="#555" />
                <Text style={styles.menuItemText}>Конфиденциальность</Text>
              </View>
              <MaterialCommunityIcons name="chevron-right" size={24} color="#999" />
            </TouchableOpacity>

            <TouchableOpacity style={styles.menuItem} onPress={() => {}}>
              <View style={styles.menuItemLeft}>
                <MaterialCommunityIcons name="help-circle-outline" size={24} color="#555" />
                <Text style={styles.menuItemText}>Помощь и поддержка</Text>
              </View>
              <MaterialCommunityIcons name="chevron-right" size={24} color="#999" />
            </TouchableOpacity>
            
            <Button 
              title="Выйти из аккаунта"
              onPress={handleLogout}
              variant="danger"
              leftIcon="logout"
              style={styles.logoutButton}
            />
          </Island>
        </View>
      </ScrollView>
    </SafeAreaView>
  );
}

export default ProfileScreen;

const styles = StyleSheet.create({
  islandsContainer: {
    flex: 1,
    gap: 12,
  },
  avatarBlock: {
    flexDirection: "column",
    alignItems: "center",
    justifyContent: "center",
  },
  container: {
    flex: 1,
    backgroundColor: "#f8f8f8",
  },
  loadingContainer: {
    flex: 1,
    justifyContent: "center",
    alignItems: "center",
    backgroundColor: "#f8f8f8",
  },
  header: {
    backgroundColor: "#fff",
    paddingHorizontal: 20,
    paddingVertical: 15,
    borderBottomWidth: 1,
    borderBottomColor: "#eee",
  },
  headerTitle: {
    fontSize: 20,
    fontWeight: "bold",
    color: "#333",
  },
  scrollView: {
    flex: 1,
  },
  profileSection: {
    alignItems: "center",
    paddingVertical: 24,
    backgroundColor: "#fff",
    marginBottom: 15,
  },
  avatarContainer: {
    marginBottom: 12,
  },
  avatar: {
    width: 100,
    height: 100,
    borderRadius: 50,
    backgroundColor: "#2ecc71",
    justifyContent: "center",
    alignItems: "center",
  },
  avatarText: {
    fontSize: 40,
    fontWeight: "bold",
    color: "#fff",
  },
  userName: {
    fontSize: 24,
    fontWeight: "bold",
    color: "#333",
    marginBottom: 5,
  },
  userPhone: {
    fontSize: 16,
    color: "#666",
  },
  divider: {
    height: 15,
  },
  section: {
    backgroundColor: "#fff",
    paddingHorizontal: 20,
    paddingVertical: 15,
    marginBottom: 15,
  },
  sectionTitle: {
    fontSize: 18,
    fontWeight: "bold",
    color: "#333",
    marginBottom: 15,
  },
  settingItem: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
    paddingVertical: 12,
    borderBottomWidth: 1,
    borderBottomColor: "#f0f0f0",
  },
  settingLeft: {
    flexDirection: "row",
    alignItems: "center",
  },
  settingLabel: {
    marginLeft: 15,
    fontSize: 16,
    color: "#333",
  },
  menuItem: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
    paddingVertical: 15,
    borderBottomWidth: 1,
    borderBottomColor: "#f0f0f0",
  },
  menuItemLeft: {
    flexDirection: "row",
    alignItems: "center",
  },
  menuItemText: {
    marginLeft: 15,
    fontSize: 16,
    color: "#333",
  },
  logoutButton: {
    marginTop: 20,
    marginHorizontal: 20,
    borderRadius: 10,
  },
});
