import { useCallback, useRef, useState, useEffect } from 'react';
import { 
  ActivityIndicator,
  Animated,
  Image, 
  Text, 
  TouchableOpacity, 
  useWindowDimensions,
  View, 
  Share,
} from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { StatusBar } from 'expo-status-bar';
import { format as formatDate } from 'date-fns';
import { router, useRouter } from 'expo-router';
import { Ionicons, MaterialCommunityIcons } from '@expo/vector-icons';
import {
  BottomSheetBackdrop,
  BottomSheetModal,
  BottomSheetModalProvider,
  BottomSheetView,
} from '@gorhom/bottom-sheet';
import { GestureHandlerRootView } from 'react-native-gesture-handler';

import { formatNumber } from '@/utils/number';
import { useAuth } from '@/providers/auth-provider';
import { supabase } from '@/services/supabase';
import Button from '@/components/ui/button';

import { usePartner } from '../../providers/partners-provider';
import OrderAmountInput from '../../components/order-amount-input';
import styles from './styles';

interface BoxOption {
  id: string;
  name: string;
  price: number;
  description: string;
  popular?: boolean;
}

export default function PartnerScreen() {
  const { partner, setPartner } = usePartner();
  const { user } = useAuth();
  const [isFavorite, setIsFavorite] = useState(false);
  const router = useRouter();
  const [selectedBoxOption, setSelectedBoxOption] = useState<string>('standard');
  const [loading, setLoading] = useState(false);
  const [remainingBoxes, setRemainingBoxes] = useState(partner ? partner.totalBoxCount : 0);
  const [showReviews, setShowReviews] = useState(false);
  const { width } = useWindowDimensions();
  
  // Set up real-time subscription for this specific partner's boxes
  useEffect(() => {
    if (!partner?.id) return;
    
    // Initialize the remaining boxes count from the partner object
    setRemainingBoxes(partner.totalBoxCount);
    
    // Subscribe to changes on this specific partner's business boxes
    const subscription = supabase
      .channel(`partner_boxes_${partner.id}`)
      .on('postgres_changes', {
        event: 'UPDATE',
        schema: 'public',
        table: 'business_boxes',
        filter: `business_id=eq.${partner.id}`
      }, async (payload) => {
        try {
          // Fetch all updated boxes for this business
          const { data: updatedBoxes, error } = await supabase
            .from('business_boxes')
            .select(`
              id, count, price_min, price_max, last_updated,
              box_type:box_type_id(id, name, description)
            `)
            .eq('business_id', partner.id);
            
          if (error) {
            console.warn("Failed to fetch updated boxes:", error);
            return;
          }
          
          if (!updatedBoxes || updatedBoxes.length === 0) {
            return;
          }

          // Calculate total box count from all boxes
          const total = updatedBoxes.reduce((sum, box) => sum + (box.count || 0), 0);

          // Update the box count in state
          setRemainingBoxes(total);
          
          // Also update the partner object to keep it in sync
          if (partner) {
            // We need to map the updated boxes to our BusinessBox type
            const mappedBoxes = await Promise.all(updatedBoxes.map(async (boxData) => {
              // Extract first item from box_type array - Supabase returns foreign key relations as arrays
              const boxTypeData = Array.isArray(boxData.box_type) && boxData.box_type.length > 0
                ? boxData.box_type[0]
                : (boxData.box_type as any) || { id: '', name: '', description: null };
                
              // Fetch typical items for this box
              const { data: typicalItems } = await supabase
                .from('box_typical_items')
                .select('item_name')
                .eq('business_box_id', boxData.id);
              
              // Fetch dietary options for this box
              const { data: dietaryOptionsData } = await supabase
                .from('box_dietary_options')
                .select('dietary_options(name)')
                .eq('business_box_id', boxData.id);
                
              // Map dietary options data, handling cases where dietary_options might be an array or object
              const dietaryOptions = dietaryOptionsData?.map(option => {
                const dietaryOption = Array.isArray(option.dietary_options) && option.dietary_options.length > 0
                  ? option.dietary_options[0]
                  : (option.dietary_options as any);
                  
                return dietaryOption?.name || '';
              }) || [];
                
              return {
                id: boxData.id,
                boxType: {
                  id: boxTypeData.id || '',
                  name: boxTypeData.name || '',
                  description: boxTypeData.description
                },
                count: boxData.count,
                priceRange: {
                  min: boxData.price_min,
                  max: boxData.price_max
                },
                typicalItems: typicalItems?.map(item => item.item_name) || [],
                dietaryOptions,
                lastUpdated: boxData.last_updated || undefined
              };
            }));
            
            setPartner({
              ...partner,
              boxes: mappedBoxes,
              totalBoxCount: total
            });
          }
        } catch (e) {
          console.warn("Failed to handle box update:", e);
        }
      })
      .subscribe();
    
    // Clean up subscription when component unmounts or partner changes
    return () => {
      subscription.unsubscribe();
    };
  }, [partner?.id]);
  
  // Animation values
  const scrollY = useRef(new Animated.Value(0)).current;
  
  // Fixed height for the header in collapsed state
  const HEADER_MAX_HEIGHT = 220;
  const HEADER_MIN_HEIGHT = 100;
  const HEADER_SCROLL_DISTANCE = HEADER_MAX_HEIGHT - HEADER_MIN_HEIGHT;
  
  // Create a second Animated.Value for native driver animations (opacity)
  const nativeScrollY = useRef(new Animated.Value(0)).current;
  
  // Animate header height using JS driver (layout properties not supported by native driver)
  const headerHeight = scrollY.interpolate({
    inputRange: [0, HEADER_SCROLL_DISTANCE],
    outputRange: [HEADER_MAX_HEIGHT, HEADER_MIN_HEIGHT],
    extrapolate: 'clamp',
  });
  
  // Use native driver for opacity animations (more efficient)
  const imageOpacity = nativeScrollY.interpolate({
    inputRange: [0, HEADER_SCROLL_DISTANCE / 2, HEADER_SCROLL_DISTANCE],
    outputRange: [1, 0.6, 0.3],
    extrapolate: 'clamp',
  });
  
  // Use native driver for opacity animations (more efficient)
  const headerTitleOpacity = nativeScrollY.interpolate({
    inputRange: [HEADER_SCROLL_DISTANCE / 2, HEADER_SCROLL_DISTANCE],
    outputRange: [0, 1],
    extrapolate: 'clamp',
  });

  const bottomSheetModalRef = useRef<BottomSheetModal>(null);
  const snapPoints = ['70%'];

  // Box options data
  const boxOptions: BoxOption[] = [
    {
      id: 'standard',
      name: 'Стандартный',
      price: partner?.price || 0, 
      description: 'Один бокс с 6-8 кусочками пиццы',
      popular: true
    },
    {
      id: 'double',
      name: 'Двойной',
      price: (partner?.price || 0) * 1.8,
      description: 'Два бокса с бóльшим разнообразием',
    },
    {
      id: 'family',
      name: 'Семейный',
      price: (partner?.price || 0) * 2.4,
      description: 'Три бокса - для всей семьи!',
    },
  ];

  const handlePresentModalPress = useCallback(() => {
    bottomSheetModalRef.current?.present();
  }, []);
  
  const handleCloseModal = useCallback(() => {
    bottomSheetModalRef.current?.dismiss();
  }, []);

  const toggleFavorite = useCallback((): void => {
    setIsFavorite(prev => !prev);
  }, []);

  const handleShare = useCallback(async (): Promise<void> => {
    if (!partner) return;
    
    try {
      await Share.share({
        message: `Проверь Magic Box от ${partner.name}! Можешь забрать вкусную еду со скидкой до 70%. ${partner.address}`,
      });
    } catch (error) {
      console.error('Error sharing:', error);
    }
  }, [partner]);

  const renderSchedule = (): string => {
    if (!partner) return '';

    const timeStart = formatDate(partner.workStartAt, 'HH:mm');
    const timeEnd = formatDate(partner.workEndAt, 'HH:mm');

    return `${timeStart} - ${timeEnd}`;
  };
  
  const handleBoxOptionSelect = useCallback((id: string): void => {
    setSelectedBoxOption(id);
  }, []);
  
  const getSelectedBoxOption = useCallback((): BoxOption => {
    return boxOptions.find(option => option.id === selectedBoxOption) || boxOptions[0];
  }, [boxOptions, selectedBoxOption]);
  
  // Mock reviews data
  const reviews = [
    { id: '1', author: 'Анна М.', rating: 5, text: 'Отличный бокс! Пицца была очень вкусной и порция большая.', date: '19 апреля 2025' },
    { id: '2', author: 'Михаил К.', rating: 4, text: 'Хороший вариант, чтобы быстро перекусить. Пицца еще теплая.', date: '15 апреля 2025' },
    { id: '3', author: 'Елена П.', rating: 5, text: 'Супер! Забрала два бокса, в обоих попалась пепперони.', date: '10 апреля 2025' },
  ];

  if (!partner) {
    return (
      <View style={styles.loadingContainer}>
        <ActivityIndicator size="large" color="#2ecc71" />
        <Text style={styles.loadingText}>Загрузка информации...</Text>
      </View>
    );
  }

  return (
    <GestureHandlerRootView style={{ flex: 1 }}>
      <StatusBar style="light" />
      <SafeAreaView style={{ flex: 1 }} edges={['bottom']}>
        <Animated.View 
          style={[
            styles.headerContainer, 
            { 
              position: 'absolute',
              top: 0,
              left: 0,
              right: 0,
              height: headerHeight,
              zIndex: 100 // Ensure header stays above content
            }
          ]}
        >
          <Animated.Image
            source={{ uri: partner.backgroundUrl }}
            style={[styles.headerImage, { opacity: imageOpacity }]}
            resizeMode="cover"
          />
          <Animated.View style={[styles.headerOverlay, { opacity: imageOpacity }]} />
          
          <Animated.View style={[styles.headerTitleContainer, { opacity: headerTitleOpacity }]}>
            <Text style={styles.headerTitle}>{partner.name}</Text>
          </Animated.View>

          <View style={styles.buttonsContainer}>
            <Button
              variant="translucent"
              size="small"
              iconOnly
              leftIcon="arrow-back"
              iconType="ionicons"
              style={styles.headerIconButton}
              onPress={() => router.back()}
            />
            <View style={styles.rightButtonsContainer}>
              <Button
                variant="translucent"
                size="small"
                iconOnly
                leftIcon="share-outline"
                iconType="ionicons"
                style={styles.headerIconButton}
                onPress={handleShare}
              />
              <Button
                variant="translucent"
                size="small"
                iconOnly
                leftIcon={isFavorite ? "heart" : "heart-outline"}
                iconType="ionicons"
                iconColor={isFavorite ? "#ff4757" : "#fff"}
                style={styles.headerIconButton}
                onPress={toggleFavorite}
              />
            </View>
          </View>
          
          {/* Partner logo overlay */}
          <View style={styles.logoContainer}>
            <Image
              source={{ uri: partner.logoUrl }}
              style={styles.logo}
              resizeMode="contain"
            />
          </View>
        </Animated.View>

        <Animated.ScrollView
          contentContainerStyle={[
            styles.scrollContent,
            { paddingTop: HEADER_MAX_HEIGHT } // Add padding equal to max header height
          ]}
          scrollIndicatorInsets={{ top: HEADER_MAX_HEIGHT }} // Proper scroll indicator positioning
          showsVerticalScrollIndicator={false}
          scrollEventThrottle={16}
          onScroll={Animated.event(
            [{ nativeEvent: { contentOffset: { y: scrollY } } }],
            { 
              useNativeDriver: false, // JS driver for height animation
              listener: (event: { nativeEvent: { contentOffset: { y: number } } }) => {
                // Sync with native animated value for opacity animations
                const offsetY = event.nativeEvent.contentOffset.y;
                nativeScrollY.setValue(offsetY);
              }
            }
          )}
        >
          <View style={[
            styles.contentContainer
          ]}>
            <View style={styles.headerInfoContainer}>
              <Text style={styles.title}>{partner.name}</Text>
              <View style={styles.ratingContainer}>
                <Ionicons name="star" size={18} color="#FFC107" />
                <Text style={styles.rating}>{partner.rating}</Text>
                <TouchableOpacity onPress={() => setShowReviews(!showReviews)}>
                  <Text style={styles.reviewsLink}>Отзывы ({reviews.length})</Text>
                </TouchableOpacity>
              </View>
            </View>

            {/* Info Badges */}
            <View style={styles.badgesContainer}>
              <View style={styles.badge}>
                <Text style={styles.badgeText}>-70%</Text>
              </View>
              <View style={styles.badge}>
                <Text style={styles.badgeText}>Magic Box</Text>
              </View>
              <View style={[
                styles.badge, 
                styles.badgeOutline, 
                remainingBoxes <= 0 ? styles.badgeOutlineDanger : remainingBoxes < 3 ? styles.badgeOutlineWarning : null
              ]}>
                <MaterialCommunityIcons 
                  name="package-variant" 
                  size={16} 
                  color={remainingBoxes <= 0 ? "#ff6b6b" : remainingBoxes < 3 ? "#FFC107" : "#2ecc71"} 
                  style={{marginRight: 4}} 
                />
                <Text style={[
                  styles.badgeTextOutline,
                  remainingBoxes <= 0 ? styles.badgeTextDanger : remainingBoxes < 3 ? styles.badgeTextWarning : null
                ]}>
                  {remainingBoxes <= 0 ? "Нет боксов" : `${remainingBoxes} осталось`}
                </Text>
              </View>
            </View>

            {/* Mystery Box Counter - More Prominent */}
            {remainingBoxes > 0 && (
              <View style={styles.boxCounterContainer}>
                <View style={styles.boxCounterIconContainer}>
                  <MaterialCommunityIcons name="package-variant" size={28} color="#fff" />
                </View>
                <View style={styles.boxCounterContent}>
                  <Text style={styles.boxCounterTitle}>Доступные боксы</Text>
                  <View style={styles.boxCounterRow}>
                    <Text style={styles.boxCounterValue}>{remainingBoxes}</Text>
                    <Text style={styles.boxCounterLabel}>
                      {remainingBoxes === 1 ? 'бокс' : 
                       remainingBoxes < 5 ? 'бокса' : 'боксов'}
                    </Text>
                  </View>
                  <Text style={styles.boxCounterHint}>
                    {remainingBoxes < 3 ? 'Осталось мало, торопитесь!' : 'Доступно к заказу'}
                  </Text>
                </View>
              </View>
            )}
            
            {remainingBoxes <= 0 && (
              <View style={styles.noBoxesContainer}>
                <Ionicons name="alert-circle" size={32} color="#ff6b6b" />
                <Text style={styles.noBoxesTitle}>Боксы закончились</Text>
                <Text style={styles.noBoxesMessage}>К сожалению, все боксы распроданы. Попробуйте завтра или выберите другого партнера.</Text>
              </View>
            )}
            
            {/* Details section */}
            <View style={styles.detailsSection}>
              <View style={styles.detailRow}>
                <View style={styles.detailIcon}>
                  <Ionicons name="location-outline" size={20} color="#555" />
                </View>
                <View style={styles.detailContent}>
                  <Text style={styles.detailTitle}>Адрес</Text>
                  <Text style={styles.detailText}>{partner.address}</Text>
                  <TouchableOpacity style={styles.mapLink} onPress={() => {/* Implement map functionality */}}>
                    <Text style={styles.mapLinkText}>Показать на карте</Text>
                  </TouchableOpacity>
                </View>
              </View>
              
              <View style={styles.detailRow}>
                <View style={styles.detailIcon}>
                  <Ionicons name="time-outline" size={20} color="#555" />
                </View>
                <View style={styles.detailContent}>
                  <Text style={styles.detailTitle}>Часы работы</Text>
                  <Text style={styles.detailText}>{renderSchedule()}</Text>
                  <Text style={styles.detailHint}>Заберите заказ до закрытия</Text>
                </View>
              </View>
              
              <View style={styles.detailRow}>
                <View style={styles.detailIcon}>
                  <Ionicons name="information-circle-outline" size={20} color="#555" />
                </View>
                <View style={styles.detailContent}>
                  <Text style={styles.detailTitle}>Расстояние</Text>
                  <Text style={styles.detailText}>{partner.distance} км от вас</Text>
                </View>
              </View>
            </View>
            
            {/* Box options section */}
            <View style={styles.sectionContainer}>
              <Text style={styles.sectionTitle}>Выберите вариант</Text>
              <View style={styles.boxOptionsContainer}>
                {boxOptions.map(option => (
                  <TouchableOpacity 
                    key={option.id}
                    style={[
                      styles.boxOption, 
                      selectedBoxOption === option.id && styles.boxOptionSelected
                    ]}
                    onPress={() => handleBoxOptionSelect(option.id)}
                  >
                    <View style={styles.boxOptionHeader}>
                      <Text style={[
                        styles.boxOptionName,
                        selectedBoxOption === option.id && styles.boxOptionNameSelected
                      ]}>
                        {option.name}
                      </Text>
                      {option.popular && (
                        <View style={styles.popularBadge}>
                          <Text style={styles.popularBadgeText}>Популярный</Text>
                        </View>
                      )}
                    </View>
                    <Text style={styles.boxOptionPrice}>
                      {formatNumber(option.price, { suffix: "₸" })}
                    </Text>
                    <Text style={styles.boxOptionDescription}>{option.description}</Text>
                  </TouchableOpacity>
                ))}
              </View>
            </View>
            
            {/* Description section */}
            <View style={styles.sectionContainer}>
              <Text style={styles.sectionTitle}>Что входит в Magic Box?</Text>
              <View style={styles.descriptionContainer}>
                <View style={styles.descriptionItem}>
                  <MaterialCommunityIcons name="pizza" size={24} color="#2ecc71" />
                  <Text style={styles.descriptionText}>
                    В этом боксе вы получите 6-8 кусочков вкусной пиццы от {partner.name} весом около 500 г.
                  </Text>
                </View>
                
                <View style={styles.descriptionItem}>
                  <MaterialCommunityIcons name="fire" size={24} color="#2ecc71" />
                  <Text style={styles.descriptionText}>
                    Обычно в коробке бывают популярные вкусы: Пепперони, Четыре сыра, Гавайская.
                  </Text>
                </View>
                
                <View style={styles.descriptionItem}>
                  <MaterialCommunityIcons name="package-variant-closed" size={24} color="#2ecc71" />
                  <Text style={styles.descriptionText}>
                    Состав может отличаться, но качество всегда на высоте!
                  </Text>
                </View>
              </View>
            </View>
            
            {/* Reviews section */}
            {showReviews && (
              <View style={styles.sectionContainer}>
                <View style={styles.sectionHeaderRow}>
                  <Text style={styles.sectionTitle}>Отзывы</Text>
                  <TouchableOpacity onPress={() => setShowReviews(false)}>
                    <Text style={styles.hideReviewsText}>Скрыть</Text>
                  </TouchableOpacity>
                </View>
                
                {reviews.map(review => (
                  <View key={review.id} style={styles.reviewItem}>
                    <View style={styles.reviewHeader}>
                      <View style={styles.reviewAuthorSection}>
                        <View style={styles.reviewAuthorAvatar}>
                          <Text style={styles.reviewAuthorInitial}>{review.author[0]}</Text>
                        </View>
                        <View>
                          <Text style={styles.reviewAuthorName}>{review.author}</Text>
                          <Text style={styles.reviewDate}>{review.date}</Text>
                        </View>
                      </View>
                      <View style={styles.reviewRating}>
                        {[...Array(5)].map((_, i) => (
                          <Ionicons 
                            key={i} 
                            name="star" 
                            size={14} 
                            color={i < review.rating ? "#FFC107" : "#E0E0E0"} 
                          />
                        ))}
                      </View>
                    </View>
                    <Text style={styles.reviewText}>{review.text}</Text>
                  </View>
                ))}
              </View>
            )}
            
            {/* Extra spacing at bottom for the fixed button */}
            <View style={styles.buttonSpacing} />
          </View>
        </Animated.ScrollView>
        
        {/* Fixed order button */}
        <View style={styles.orderButtonContainer}>
          <Button 
            variant="primary"
            size="large"
            onPress={handlePresentModalPress}
            style={{ width: '100%' }}
          >
            <View>
              <Text style={styles.ctaText}>Забрать {getSelectedBoxOption().name} бокс</Text>
              <Text style={styles.ctaCaption}>
                {formatNumber(getSelectedBoxOption().price, { suffix: "₸" })}
              </Text>
            </View>
          </Button>
        </View>
        
        {/* Bottom sheet for order */}
        <BottomSheetModalProvider>
          <BottomSheetModal
            ref={bottomSheetModalRef}
            snapPoints={snapPoints}
            backdropComponent={useCallback((props: any) => (
              <BottomSheetBackdrop
                {...props}
                disappearsOnIndex={-1}
                appearsOnIndex={0}
              />
            ), [])}
            handleIndicatorStyle={styles.bottomSheetIndicator}
          >
            <BottomSheetView style={styles.bottomSheetContent}>
              <View style={styles.bottomSheetHeader}>
                <Text style={styles.bottomSheetTitle}>Оформление заказа</Text>
                <TouchableOpacity onPress={handleCloseModal} style={styles.closeButton}>
                  <Ionicons name="close" size={24} color="#999" />
                </TouchableOpacity>
              </View>
              
              <View style={styles.orderSummary}>
                <View style={styles.orderSummaryHeader}>
                  <Text style={styles.orderSummaryTitle}>{getSelectedBoxOption().name} бокс</Text>
                  <Text style={styles.orderSummaryPrice}>
                    {formatNumber(getSelectedBoxOption().price, { suffix: "₸" })}
                  </Text>
                </View>
                <Text style={styles.orderSummaryDescription}>{getSelectedBoxOption().description}</Text>
              </View>
              
              <OrderAmountInput partner={partner} selectedOption={getSelectedBoxOption()} />
            </BottomSheetView>
          </BottomSheetModal>
        </BottomSheetModalProvider>
      </SafeAreaView>
    </GestureHandlerRootView>
  );
}
