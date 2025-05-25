import { useState, useEffect } from 'react';
import { FlatList, Text, View, StyleSheet, Image, Pressable, ActivityIndicator } from 'react-native';
import { StatusBar } from 'expo-status-bar';
import { TabView, TabBar } from 'react-native-tab-view';
import { useWindowDimensions } from 'react-native';
import { supabase } from '@/services/supabase';
import { useAuth } from '@/providers/auth-provider';
import { Database } from '@/database.types';

type Order = Database['public']['Tables']['orders']['Row'] & {
  food_package: Database['public']['Tables']['food_packages']['Row'];
  business_profile: {
    business_name: string;
  };
};

export default function OrdersScreen() {
  const layout = useWindowDimensions();
  const { user } = useAuth();
  const [isLoading, setIsLoading] = useState(true);
  const [upcomingOrders, setUpcomingOrders] = useState<Order[]>([]);
  const [pastOrders, setPastOrders] = useState<Order[]>([]);
  const [error, setError] = useState<string | null>(null);

  const [index, setIndex] = useState(0);
  const [routes] = useState([
    { key: 'upcoming', title: 'Upcoming' },
    { key: 'past', title: 'Past' },
  ]);

  useEffect(() => {
    if (!user?.id) return;
    
    const fetchOrders = async () => {
      setIsLoading(true);
      setError(null);
      
      try {
        // Fetch all orders for current user with related package and business data
        const { data, error } = await supabase
          .from('orders')
          .select(`
            *,
            food_package:package_id (*),
            business_profile:business_id (business_name)
          `)
          .eq('customer_id', user.id)
          .order('created_at', { ascending: false });

        if (error) throw error;

        // Split orders into upcoming and past
        const upcoming: Order[] = [];
        const past: Order[] = [];

        data.forEach((order: Order) => {
          if (order.status === 'pending' || order.status === 'confirmed') {
            upcoming.push(order);
          } else {
            past.push(order);
          }
        });

        setUpcomingOrders(upcoming);
        setPastOrders(past);
      } catch (err) {
        console.error('Error fetching orders:', err);
        setError('Failed to load orders. Please try again.');
      } finally {
        setIsLoading(false);
      }
    };

    fetchOrders();
  }, [user?.id]);

  const renderTabBar = (props: any) => (
    <TabBar
      {...props}
      indicatorStyle={{ backgroundColor: '#2ecc71' }}
      style={{ backgroundColor: 'white' }}
      activeColor="#2ecc71"
      inactiveColor="#718096"
      labelStyle={{ fontWeight: 'bold' }}
    />
  );

  const renderOrderItem = ({ item }: { item: Order }) => {
    const isUpcoming = item.status === 'pending' || item.status === 'confirmed';
    const formattedDate = new Date(item.created_at || '').toLocaleDateString('en-US', {
      month: 'short',
      day: 'numeric',
      year: 'numeric',
    });
    
    return (
      <View style={styles.orderCard}>
        <View style={styles.orderCardContent}>
          <Image 
            source={{ 
              uri: item.food_package.image_url || 
                   'https://via.placeholder.com/150?text=No+Image' 
            }}
            style={styles.foodImage}
          />
          <View style={styles.orderDetails}>
            <Text style={styles.orderName}>{item.food_package.name}</Text>
            <Text style={styles.orderDescription}>{item.food_package.description}</Text>
            <Text style={styles.orderPrice}>${item.food_package.discounted_price.toFixed(2)}</Text>
          </View>
          <Text style={styles.orderDate}>{formattedDate}</Text>
        </View>
        <View style={styles.orderStatus}>
          <Text 
            style={[
              styles.statusText, 
              isUpcoming ? styles.readyStatus : styles.completedStatus
            ]}
          >
            {isUpcoming ? 'Ready for pickup' : 'Completed'}
          </Text>
        </View>
      </View>
    );
  };

  const renderEmptyOrders = (type: 'upcoming' | 'past') => (
    <View style={styles.emptyContainer}>
      <Text style={styles.emptyText}>
        {type === 'upcoming' 
          ? 'No upcoming orders. Browse our partners to place an order!' 
          : 'No past orders yet.'}
      </Text>
    </View>
  );

  const renderUpcomingScene = () => (
    <View style={styles.sceneContainer}>
      {isLoading ? (
        <ActivityIndicator size="large" color="#2ecc71" style={styles.loader} />
      ) : error ? (
        <View style={styles.errorContainer}>
          <Text style={styles.errorText}>{error}</Text>
          <Pressable 
            style={styles.retryButton}
            onPress={() => {
              // Re-fetch orders
              if (user?.id) {
                setIsLoading(true);
                // This will trigger the useEffect again
                setError(null);
              }
            }}
          >
            <Text style={styles.retryButtonText}>Retry</Text>
          </Pressable>
        </View>
      ) : (
        <FlatList
          data={upcomingOrders}
          renderItem={renderOrderItem}
          keyExtractor={(item) => item.id}
          contentContainerStyle={styles.listContainer}
          ListEmptyComponent={() => renderEmptyOrders('upcoming')}
        />
      )}
    </View>
  );

  const renderPastScene = () => (
    <View style={styles.sceneContainer}>
      {isLoading ? (
        <ActivityIndicator size="large" color="#2ecc71" style={styles.loader} />
      ) : error ? (
        <View style={styles.errorContainer}>
          <Text style={styles.errorText}>{error}</Text>
          <Pressable 
            style={styles.retryButton}
            onPress={() => {
              // Re-fetch orders
              if (user?.id) {
                setIsLoading(true);
                // This will trigger the useEffect again
                setError(null);
              }
            }}
          >
            <Text style={styles.retryButtonText}>Retry</Text>
          </Pressable>
        </View>
      ) : (
        <FlatList
          data={pastOrders}
          renderItem={renderOrderItem}
          keyExtractor={(item) => item.id}
          contentContainerStyle={styles.listContainer}
          ListEmptyComponent={() => renderEmptyOrders('past')}
        />
      )}
    </View>
  );

  const renderScene = ({ route }: { route: { key: string } }) => {
    switch (route.key) {
      case 'upcoming':
        return renderUpcomingScene();
      case 'past':
        return renderPastScene();
      default:
        return null;
    }
  };

  return (
    <View style={styles.container}>
      <StatusBar style="dark" />
      <TabView
        navigationState={{ index, routes }}
        renderScene={renderScene}
        renderTabBar={renderTabBar}
        onIndexChange={setIndex}
        initialLayout={{ width: layout.width }}
        swipeEnabled={true}
      />
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#fff',
  },
  title: {
    fontSize: 28,
    fontWeight: 'bold',
    marginBottom: 12,
    paddingHorizontal: 20,
  },
  subtitle: {
    fontSize: 16,
    color: '#718096',
    paddingHorizontal: 20,
  },
  sceneContainer: {
    flex: 1,
  },
  listContainer: {
    flexGrow: 1,
    paddingHorizontal: 20,
    paddingTop: 10,
    paddingBottom: 20,
  },
  orderCard: {
    backgroundColor: '#fff',
    borderRadius: 12,
    marginBottom: 15,
    padding: 15,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 1 },
    shadowOpacity: 0.1,
    shadowRadius: 2,
    elevation: 2,
  },
  orderCardContent: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  foodImage: {
    width: 80,
    height: 80,
    borderRadius: 8,
    marginRight: 15,
  },
  orderDetails: {
    flex: 1,
  },
  orderName: {
    fontSize: 18,
    fontWeight: 'bold',
    marginBottom: 4,
  },
  orderDescription: {
    fontSize: 14,
    color: '#718096',
    marginBottom: 4,
  },
  orderPrice: {
    fontSize: 16,
    fontWeight: 'bold',
    color: '#2ecc71',
  },
  orderDate: {
    fontSize: 14,
    color: '#718096',
    textAlign: 'right',
  },
  orderStatus: {
    marginTop: 12,
    alignItems: 'flex-end',
  },
  statusText: {
    paddingVertical: 6,
    paddingHorizontal: 12,
    borderRadius: 20,
    fontSize: 14,
    fontWeight: 'bold',
  },
  readyStatus: {
    backgroundColor: '#e6f9ef',
    color: '#2ecc71',
  },
  completedStatus: {
    backgroundColor: '#f1f1f1',
    color: '#718096',
  },
  emptyContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    padding: 20,
    height: 300,
  },
  emptyText: {
    fontSize: 16,
    color: '#718096',
    textAlign: 'center',
  },
  errorContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    padding: 20,
  },
  errorText: {
    fontSize: 16,
    color: '#e74c3c',
    textAlign: 'center',
    marginBottom: 20,
  },
  retryButton: {
    backgroundColor: '#2ecc71',
    paddingVertical: 10,
    paddingHorizontal: 20,
    borderRadius: 8,
  },
  retryButtonText: {
    color: '#fff',
    fontWeight: 'bold',
  },
  loader: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
  },
});
