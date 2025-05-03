import { StyleSheet, Dimensions, StatusBar } from 'react-native';

const { width } = Dimensions.get('window');

const styles = StyleSheet.create({
  container: {
    flex: 1,
  },
  // Loading state
  loadingContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    backgroundColor: '#fff',
  },
  loadingText: {
    marginTop: 16,
    fontSize: 16,
    color: '#555',
  },
  
  // Header
  headerContainer: {
    height: 220,
    width: '100%',
    position: 'relative',
    zIndex: 10,
  },
  headerImage: {
    width: '100%',
    height: '100%',
    position: 'absolute',
  },
  headerOverlay: {
    ...StyleSheet.absoluteFillObject,
    backgroundColor: 'rgba(0,0,0,0.4)',
  },
  headerTitleContainer: {
    position: 'absolute',
    top: StatusBar.currentHeight,
    left: 0,
    right: 0,
    alignItems: 'center',
    paddingHorizontal: 50,
  },
  headerTitle: {
    color: '#fff',
    fontSize: 18,
    fontWeight: 'bold',
  },
  
  // Buttons
  buttonsContainer: {
    position: 'absolute',
    top: StatusBar.currentHeight,
    left: 0,
    right: 0,
    flexDirection: 'row',
    justifyContent: 'space-between',
    paddingHorizontal: 16,
    zIndex: 20,
  },
  rightButtonsContainer: {
    flexDirection: 'row',
    gap: 8,
  },
  iconButton: {
    backgroundColor: 'rgba(255,255,255,0.15)',
    padding: 10,
    borderRadius: 50,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 3,
    elevation: 3,
  },
  
  // Logo
  logoContainer: {
    position: 'absolute',
    bottom: -25,
    left: width / 2 - 25,
    backgroundColor: '#fff',
    width: 50,
    height: 50,
    borderRadius: 25,
    justifyContent: 'center',
    alignItems: 'center',
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 4,
    elevation: 4,
    zIndex: 30,
  },
  logo: {
    width: 35,
    height: 35,
    borderRadius: 17.5,
  },
  
  // Scroll & Content
  scrollContent: {
    paddingBottom: 40,
    borderTopLeftRadius: 20,
    
  },
  contentContainer: {
    padding: 16,
    backgroundColor: '#fff',
    borderTopLeftRadius: 20,
    borderTopRightRadius: 20,
    paddingTop: 30,
  },
  
  // Header info
  headerInfoContainer: {
    alignItems: 'center',
    marginBottom: 16,
  },
  title: {
    fontSize: 20,
    fontWeight: 'bold',
    textAlign: 'center',
    marginBottom: 8,
  },
  ratingContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 4,
  },
  rating: {
    fontSize: 16,
    fontWeight: '600',
    color: '#555',
    marginRight: 8,
  },
  reviewsLink: {
    color: '#2ecc71',
    fontWeight: '500',
    textDecorationLine: 'underline',
  },
  
  // Badges
  badgesContainer: {
    flexDirection: 'row',
    justifyContent: 'center',
    marginBottom: 20,
    gap: 10,
  },
  badge: {
    paddingHorizontal: 10,
    paddingVertical: 5,
    borderRadius: 20,
    backgroundColor: '#2ecc71',
  },
  badgeText: {
    color: '#fff',
    fontSize: 12,
    fontWeight: '600',
  },
  badgeOutline: {
    backgroundColor: 'transparent',
    borderWidth: 1,
    borderColor: '#2ecc71',
  },
  badgeOutlineDanger: {
    borderColor: '#ff6b6b',
  },
  badgeOutlineWarning: {
    borderColor: '#FFC107',
  },
  badgeTextOutline: {
    color: '#2ecc71',
    fontSize: 12,
    fontWeight: '600',
  },
  badgeTextDanger: {
    color: '#ff6b6b',
  },
  badgeTextWarning: {
    color: '#FFC107',
  },
  
  // Mystery Box Counter
  boxCounterContainer: {
    flexDirection: 'row',
    backgroundColor: '#f4faf6',
    borderRadius: 12,
    padding: 16,
    marginBottom: 20,
    borderWidth: 1,
    borderColor: '#d7f0e2',
  },
  boxCounterIconContainer: {
    width: 50,
    height: 50,
    borderRadius: 25,
    backgroundColor: '#2ecc71',
    justifyContent: 'center',
    alignItems: 'center',
    marginRight: 12,
  },
  boxCounterContent: {
    flex: 1,
    justifyContent: 'center',
  },
  boxCounterTitle: {
    fontSize: 16,
    fontWeight: '600',
    color: '#333',
    marginBottom: 4,
  },
  boxCounterRow: {
    flexDirection: 'row',
    alignItems: 'baseline',
  },
  boxCounterValue: {
    fontSize: 24,
    fontWeight: 'bold',
    color: '#2ecc71',
    marginRight: 6,
  },
  boxCounterLabel: {
    fontSize: 16,
    color: '#555',
  },
  boxCounterHint: {
    fontSize: 13,
    color: '#777',
    marginTop: 4,
    fontStyle: 'italic',
  },
  
  // No Boxes Message
  noBoxesContainer: {
    alignItems: 'center',
    padding: 20,
    backgroundColor: '#ffefef',
    borderRadius: 12,
    marginBottom: 20,
  },
  noBoxesTitle: {
    fontSize: 18,
    fontWeight: 'bold',
    color: '#ff6b6b',
    marginTop: 10,
    marginBottom: 8,
  },
  noBoxesMessage: {
    fontSize: 14,
    color: '#666',
    textAlign: 'center',
    lineHeight: 20,
  },
  
  // Details
  detailsSection: {
    marginBottom: 20,
    backgroundColor: '#f9f9f9',
    borderRadius: 10,
    padding: 12,
  },
  detailRow: {
    flexDirection: 'row',
    marginBottom: 12,
    paddingBottom: 12,
    borderBottomWidth: 1,
    borderBottomColor: '#eee',
  },
  detailIcon: {
    width: 36,
    alignItems: 'center',
    justifyContent: 'flex-start',
    marginRight: 8,
  },
  detailContent: {
    flex: 1,
  },
  detailTitle: {
    fontSize: 14,
    fontWeight: '600',
    marginBottom: 2,
    color: '#333',
  },
  detailText: {
    fontSize: 14,
    color: '#555',
    marginBottom: 4,
  },
  detailHint: {
    fontSize: 12,
    color: '#888',
    fontStyle: 'italic',
  },
  mapLink: {
    marginTop: 4,
  },
  mapLinkText: {
    color: '#2ecc71',
    fontSize: 13,
    fontWeight: '500',
  },
  
  // Sections
  sectionContainer: {
    marginBottom: 24,
  },
  sectionTitle: {
    fontSize: 18,
    fontWeight: 'bold',
    marginBottom: 12,
    color: '#333',
  },
  sectionHeaderRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 12,
  },
  hideReviewsText: {
    color: '#888',
    fontSize: 14,
  },
  
  // Box options
  boxOptionsContainer: {
    gap: 12,
  },
  boxOption: {
    borderWidth: 1,
    borderColor: '#e0e0e0',
    borderRadius: 12,
    padding: 12,
    backgroundColor: '#fff',
  },
  boxOptionSelected: {
    borderColor: '#2ecc71',
    borderWidth: 2,
    shadowColor: '#2ecc71',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 4,
    elevation: 2,
  },
  boxOptionHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 8,
  },
  boxOptionName: {
    fontSize: 16,
    fontWeight: '600',
    color: '#333',
  },
  boxOptionNameSelected: {
    color: '#2ecc71',
  },
  popularBadge: {
    backgroundColor: '#ffad60',
    paddingHorizontal: 8,
    paddingVertical: 3,
    borderRadius: 12,
  },
  popularBadgeText: {
    color: '#fff',
    fontSize: 10,
    fontWeight: '600',
  },
  boxOptionPrice: {
    fontSize: 18,
    fontWeight: 'bold',
    marginBottom: 4,
    color: '#333',
  },
  boxOptionDescription: {
    fontSize: 13,
    color: '#666',
  },
  
  // Description
  descriptionContainer: {
    gap: 12,
  },
  descriptionItem: {
    flexDirection: 'row',
    gap: 12,
    alignItems: 'flex-start',
  },
  descriptionText: {
    flex: 1,
    fontSize: 14,
    color: '#555',
    lineHeight: 20,
  },
  
  // Reviews
  reviewItem: {
    marginBottom: 16,
    paddingBottom: 16,
    borderBottomWidth: 1,
    borderBottomColor: '#f0f0f0',
  },
  reviewHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    marginBottom: 8,
  },
  reviewAuthorSection: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 10,
  },
  reviewAuthorAvatar: {
    width: 32,
    height: 32,
    borderRadius: 16,
    backgroundColor: '#2ecc71',
    justifyContent: 'center',
    alignItems: 'center',
  },
  reviewAuthorInitial: {
    color: '#fff',
    fontSize: 16,
    fontWeight: 'bold',
  },
  reviewAuthorName: {
    fontSize: 14,
    fontWeight: '600',
    color: '#333',
  },
  reviewDate: {
    fontSize: 12,
    color: '#888',
  },
  reviewRating: {
    flexDirection: 'row',
    gap: 2,
  },
  reviewText: {
    fontSize: 14,
    color: '#555',
    lineHeight: 20,
  },
  
  // Order button
  orderButtonContainer: {
    position: 'absolute',
    bottom: 0,
    left: 0,
    right: 0,
    padding: 16,
    backgroundColor: '#fff',
    borderTopWidth: 1,
    borderTopColor: '#f0f0f0',
    shadowColor: '#000',
    shadowOffset: { width: 0, height: -3 },
    shadowOpacity: 0.1,
    shadowRadius: 4,
    elevation: 5,
  },
  buttonSpacing: {
    height: 80,
  },
  ctaText: {
    color: 'white',
    fontWeight: 'bold',
    fontSize: 16,
  },
  ctaCaption: {
    color: '#fff',
    fontSize: 12,
    opacity: 0.8,
  },
  
  // Bottom sheet
  bottomSheetContent: {
    flex: 1,
    padding: 24,
  },
  bottomSheetIndicator: {
    backgroundColor: '#ddd',
    width: 60,
  },
  bottomSheetHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 24,
  },
  bottomSheetTitle: {
    fontSize: 20,
    fontWeight: 'bold',
    color: '#333',
  },
  closeButton: {
    padding: 4,
  },
  orderSummary: {
    backgroundColor: '#f9f9f9',
    borderRadius: 12,
    padding: 16,
    marginBottom: 20,
  },
  orderSummaryHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 6,
  },
  orderSummaryTitle: {
    fontSize: 16,
    fontWeight: '600',
    color: '#333',
  },
  orderSummaryPrice: {
    fontSize: 16,
    fontWeight: 'bold',
    color: '#2ecc71',
  },
  orderSummaryDescription: {
    fontSize: 14,
    color: '#666',
  },
});

export default styles;
