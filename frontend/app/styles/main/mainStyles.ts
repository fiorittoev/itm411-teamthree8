import { StyleSheet, Dimensions } from "react-native"

import { isSmallPhone, isPhone, isTablet, scale, scaleHeight, width } from "../theme"
export { isSmallPhone, isPhone, isTablet, scale, scaleHeight, width }

export const mainStyles = StyleSheet.create({
  // ─── Common ──────────────────────────────────────────────────────────────────
  safe: { 
    flex: 1, 
    backgroundColor: '#f2f2f2',
    width: '100%',
    maxWidth: 1200,
    alignSelf: 'center',
  },
  safeMobile: {
    maxWidth: '100%',
  },
  centered: {
    justifyContent: 'center',
    alignItems: 'center',
  },
  navbar: { 
    height: 56,
    backgroundColor: '#4F728C', 
    flexDirection: 'row', 
    alignItems: 'center', 
    paddingHorizontal: 16
  },
  communityDescription: {
  fontSize: 13,
  color: '#666',
  marginTop: 2,
},
communityMemberCount: {
  fontSize: 12,
  color: '#888',
  marginTop: 2,
},
  logo: { 
    color: 'white', 
    fontSize: 17, 
    fontWeight: '700',
    marginRight: 12
  },
  navIcons: { 
    flex: 1,
    flexDirection: 'row', 
    justifyContent: 'space-evenly', 
    alignItems: 'center' 
  },
  profileCircle: { 
    width: 36, 
    height: 36,
    borderRadius: 18, 
    borderWidth: 2, 
    borderColor: 'white', 
    alignItems: 'center',
    justifyContent: 'center'
  },
  body: { 
    flex: 1, 
    flexDirection: 'row', 
    gap: 10, 
    padding: 10 
  },
  
  // ─── Home Screen ─────────────────────────────────────────────────────────────
  leftPanel: { 
    width: 190, 
    backgroundColor: 'white', 
    borderRadius: 8, 
    padding: 12 
  },
  panelTitle: { 
    fontSize: 15, 
    fontWeight: '700', 
    marginBottom: 8, 
    color: '#222' 
  },
  filterRow: { 
    flexDirection: 'row', 
    gap: 6,
    marginBottom: 10, 
    flexWrap: 'wrap' 
  },
  filterBtn: { 
    backgroundColor: '#9fb7c8', 
    paddingHorizontal: 10, 
    paddingVertical: 4, 
    borderRadius: 20 
  },
  filterBtnText: { 
    fontSize: 12, 
    color: '#fff', 
    fontWeight: '600'
  },
  listingGrid: { 
    flex: 1, 
    flexDirection: 'row', 
    flexWrap: 'wrap', 
    gap: 6 
  },
  listingCard: { 
    width: (190 - 24 - 6) / 2,
    height: (190 - 24 - 6) / 2, 
    borderRadius: 8, 
    overflow: 'hidden', 
    borderWidth: 1,
    borderColor: '#ccc', 
    position: 'relative' 
  },
  previewImg: { 
    width: '100%', 
    height: '100%'
  },
  previewPrice: { 
    position: 'absolute',
    bottom: 4,
    right: 4, 
    backgroundColor: 'rgba(0,0,0,0.7)',
    paddingHorizontal: 6,
    paddingVertical: 2,
    borderRadius: 5
  },
  previewPriceText: { 
    color: 'white', 
    fontSize: 11, 
    fontWeight: '700'
  },
  shopBtn: { 
    marginTop: 10,
    backgroundColor: '#9fb7c8',
    borderRadius: 8,
    paddingVertical: 10,
    alignItems: 'center'
  },
  shopBtnText: { 
    color: '#fff', 
    fontWeight: '700',
    fontSize: 13
  },
  feed: { 
    flex: 1, 
    backgroundColor: 'white', 
    borderRadius: 8, 
    overflow: 'hidden' 
  },
  feedHeader: { 
    flexDirection: 'row', 
    justifyContent: 'space-between', 
    alignItems: 'center', 
    padding: 14,
    borderBottomWidth: 1,
    borderBottomColor: '#eee'
  },
  feedTitle: {
    fontSize: 16, 
    fontWeight: '700', 
    color: '#222'
  },
  addBtn: {
    width: 32, 
    height: 32,
    borderRadius: 6, 
    borderWidth: 1, 
    borderColor: '#333', 
    alignItems: 'center', 
    justifyContent: 'center'
  },
  addBtnText: { 
    fontSize: 20, 
    color: '#333', 
    lineHeight: 24 
  },
  postBox: { 
    backgroundColor: '#e0e0e0', 
    borderRadius: 8,
    padding: 14, 
    marginBottom: 12, 
    paddingBottom: 36 
  },
  postTitle: {
    fontSize: 18,
    fontWeight: '700',
    color: '#333',
    marginBottom: 8,
  },
  postLabel: {
    fontSize: 13,
    fontWeight: '600',
    color: '#555',
    marginBottom: 4,
  },
  postHeader: { 
    flexDirection: 'row', 
    justifyContent: 'space-between', 
    alignItems: 'baseline',
    marginBottom: 6 
  },
  postAuthor: {
    fontWeight: '700', 
    fontSize: 13,
    color: '#333'
  },
  postTime: { 
    fontSize: 11, 
    color: '#666' 
  },
  postText: { 
    fontSize: 14, 
    lineHeight: 20,
    color: '#222'
  },
  deleteBtn: {
    position: 'absolute',
    bottom: 10, 
    right: 12 
  },
  rightPanel: {
    width: 80, 
    backgroundColor: 'white', 
    borderRadius: 8,
    padding: 12,
    alignItems: 'center', 
    paddingTop: 20, 
    gap: 30
  },
  sideItem: {
    alignItems: 'center', 
    gap: 4 
  },
  sideLabel: { 
    fontSize: 12, 
    color: '#333' 
  },
  emptyText: { 
    color: '#aaa', 
    fontSize: 12, 
    textAlign: 'center', 
    marginTop: 10 
  },
  
  // ─── Marketplace Screen ───────────────────────────────────────────────────────
  marketplace: { 
    flex: 1, 
    margin: 15, 
    backgroundColor: 'white', 
    borderRadius: 8, 
    overflow: 'hidden'
  },
  marketHeader: { 
    flexDirection: 'row', 
    justifyContent: 'space-between', 
    alignItems: 'center',
    padding: 14, 
    borderBottomWidth: 1, 
    borderBottomColor: '#eee' 
  },
  headerLeft: { 
    flexDirection: 'row', 
    alignItems: 'center',
    gap: 14, 
    flex: 1, 
    flexWrap: 'wrap'
  },
  marketTitle: { 
    fontSize: 17, 
    fontWeight: '700', 
    color: '#222' 
  },
  filterBtnActive: { 
    backgroundColor: '#4F728C'
  },
  gridContent: { 
    padding: 14, 
    paddingBottom: 30 
  },
  gridRow: { 
    gap: 14, 
    marginBottom: 14
  },
  card: { 
    flex: 1, 
    width: "33%",
    maxWidth: "10%",
  },
  cardImg: {
    width: '100%', 
    aspectRatio: 1, 
    borderRadius: 10, 
    marginBottom: 6
  },
  cardInfo: {
    flexDirection: 'row', 
    justifyContent: 'space-between', 
    alignItems: 'flex-start' 
  },
  cardText: { 
    flex: 1,
    gap: 2
  },
  cardName: { 
    fontSize: 13,
    fontWeight: '500', 
    color: '#111' 
  },
  cardPrice: { 
    fontSize: 13, 
    fontWeight: '700', 
    color: '#000'
  },
  cardFav: { 
    fontSize: 18, 
    color: '#000', 
    marginLeft: 4, 
    marginTop: 2 
  },
  
  // ─── Modals ───────────────────────────────────────────────────────────────────
  overlay: { 
    flex: 1, 
    backgroundColor: 'rgba(0,0,0,0.6)', 
    justifyContent: 'center', 
    alignItems: 'center'
  },
  overlayScroll: { 
    flexGrow: 1,
    justifyContent: 'center', 
    alignItems: 'center', 
    paddingVertical: 30, 
    width: '100%' 
  },
  modalBox: { 
    backgroundColor: 'white',
    width: '85%', 
    maxWidth: 480, 
    borderRadius: 12, 
    padding: 22, 
    gap: 14
  },
  modalTitle: { 
    fontSize: 17, 
    fontWeight: '700', 
    textAlign: 'center', 
    color: '#222' 
  },
  modalActions: { 
    flexDirection: 'row', 
    gap: 10,
    marginTop: 4 
  },
  btn: { 
    flex: 1, 
    paddingVertical: 11, 
    borderRadius: 8, 
    alignItems: 'center' 
  },
  btnCancel: { 
    backgroundColor: '#ddd'
  },
  btnCancelText: {
    color: '#333',
    fontWeight: '600',
    fontSize: 15 
  },
  btnBlue: {
    backgroundColor: '#187bcd'
  },
  btnRed: { 
    backgroundColor: '#dc3545' 
  },
  btnText: { 
    color: 'white', 
    fontWeight: '700', 
    fontSize: 15
  },
  
  // ─── Forms ────────────────────────────────────────────────────────────────────
  input: { 
    borderWidth: 1, 
    borderColor: '#ccc', 
    borderRadius: 8, 
    padding: 10, 
    fontSize: 15, 
    color: '#222' 
  },
  textarea: { 
    minHeight: 70, 
    textAlignVertical: 'top'
  },
  postInput: { 
    borderWidth: 1, 
    borderColor: '#ccc',
    borderRadius: 8,
    padding: 10, 
    fontSize: 15, 
    minHeight: 90, 
    textAlignVertical: 'top' 
  },
  imagePicker: { 
    borderWidth: 1, 
    borderColor: '#ccc', 
    borderRadius: 8, 
    overflow: 'hidden' 
  },
  imagePlaceholder: { 
    height: 100, 
    alignItems: 'center', 
    justifyContent: 'center', 
    gap: 8, 
    backgroundColor: '#fafafa'
  },
  imagePlaceholderText: { 
    color: '#888', 
    fontSize: 14 
  },
  imagePreview: { 
    width: '100%', 
    height: 160 
  },
  
  // ─── Detail Modal ────────────────────────────────────────────────────────────
  detailBox: {
    backgroundColor: 'white', 
    width: '92%', 
    maxWidth: 700, 
    maxHeight: '88%', 
    borderRadius: 12, 
    overflow: 'hidden', 
    flexDirection: 'row' 
  },
  detailImg: { 
    flex: 1, 
    resizeMode: 'cover' 
  },
  detailInfo: { 
    flex: 1, 
    padding: 18 
  },
  detailName: { 
    fontSize: 20, 
    fontWeight: '700', 
    color: '#111' 
  },
  detailPrice: {
    fontSize: 18, 
    fontWeight: '700', 
    color: '#222' 
  },
  detailSeller: { 
    fontSize: 13, 
    color: '#666' 
  },
  detailDesc: {
    fontSize: 14, 
    color: '#333', 
    lineHeight: 20 
  },
  favBtn: { 
    borderWidth: 1, 
    borderColor: '#ccc', 
    borderRadius: 8, 
    paddingVertical: 8, 
    alignItems: 'center'
  },
  favBtnText: {
    fontSize: 15, 
    color: '#333' 
  },
  contactBox: { 
    borderTopWidth: 1, 
    borderTopColor: '#eee', 
    paddingTop: 8, 
    gap: 3 
  },
  contactTitle: { 
    fontWeight: '700', 
    fontSize: 14, 
    marginBottom: 2, 
    color: '#222' 
  },
  contactText: { 
    fontSize: 13, 
    color: '#555' 
  },

  // ─── Profile Screen ──────────────────────────────────────────────────────────
  profilePanel: {
    flex: 1,
    margin: 12,
    backgroundColor: 'white',
    borderRadius: 8,
    overflow: 'hidden',
  },
  profileHeader: {
    alignItems: 'center',
    paddingVertical: 24,
    paddingHorizontal: 16,
    borderBottomWidth: 1,
    borderBottomColor: '#eee',
  },
  profileAvatar: {
    width: 88,
    height: 88,
    borderRadius: 44,
    backgroundColor: '#9fb7c8',
    alignItems: 'center',
    justifyContent: 'center',
    marginBottom: 12,
  },
  profileName: {
    fontSize: 20,
    fontWeight: '700',
    color: '#222',
    marginBottom: 4,
  },
  profileMeta: {
    fontSize: 13,
    color: '#666',
  },
  profileBody: {
    padding: 16,
    gap: 12,
  },
  profileRow: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 10,
    paddingVertical: 10,
    borderBottomWidth: 1,
    borderBottomColor: '#f0f0f0',
  },
  profileRowIcon: {
    width: 36,
    alignItems: 'center',
  },
  profileRowLabel: {
    fontSize: 12,
    color: '#666',
    marginBottom: 2,
  },
  profileRowValue: {
    fontSize: 15,
    fontWeight: '500',
    color: '#222',
    flex: 1,
  },
  profileAction: {
    marginTop: 16,
    backgroundColor: '#9fb7c8',
    borderRadius: 8,
    paddingVertical: 12,
    alignItems: 'center',
  },
  profileActionText: {
    color: '#fff',
    fontWeight: '700',
    fontSize: 15,
  },

  // ─── Settings Screen ─────────────────────────────────────────────────────────
  settingsPanel: {
    flex: 1,
    margin: 12,
    backgroundColor: 'white',
    borderRadius: 8,
    overflow: 'hidden',
  },
  settingsContent: {
    padding: 16,
    paddingBottom: 30,
  },
  settingsSection: {
    marginBottom: 20,
  },
  settingsSectionTitle: {
    fontSize: 13,
    fontWeight: '700',
    color: '#666',
    marginBottom: 10,
    textTransform: 'uppercase',
    letterSpacing: 0.5,
  },
  settingsRow: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    paddingVertical: 12,
    paddingHorizontal: 4,
    borderBottomWidth: 1,
    borderBottomColor: '#f0f0f0',
  },
  settingsRowLeft: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 12,
    flex: 1,
  },
  settingsRowText: {
    flex: 1,
  },
  settingsRowLabel: {
    fontSize: 15,
    fontWeight: '600',
    color: '#222',
  },
  settingsRowValue: {
    fontSize: 14,
    color: '#555',
    marginTop: 2,
  },
  settingsRowSubtext: {
    fontSize: 12,
    color: '#888',
    marginTop: 2,
  },
  settingsModal: {
    backgroundColor: 'white',
    width: '85%',
    maxWidth: 480,
    borderRadius: 12,
    padding: 22,
    gap: 14,
  },
  settingsModalTitle: {
    fontSize: 17,
    fontWeight: '700',
    textAlign: 'center',
    color: '#222',
  },

  // ─── Search Screen ───────────────────────────────────────────────────────────
  searchPanel: {
    flex: 1,
    margin: 12,
    backgroundColor: 'white',
    borderRadius: 8,
    overflow: 'hidden',
    flexDirection: 'column',
  },
  searchHeader: {
    padding: 14,
    borderBottomWidth: 1,
    borderBottomColor: '#eee',
    gap: 12,
  },
  searchInputContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    borderWidth: 1,
    borderColor: '#ccc',
    borderRadius: 8,
    paddingHorizontal: 10,
    backgroundColor: '#f9f9f9',
  },
  searchInput: {
    flex: 1,
    paddingVertical: 10,
    paddingHorizontal: 8,
    fontSize: 15,
    color: '#222',
  },
  searchClearBtn: {
    padding: 4,
  },
  filterSection: {
    gap: 10,
  },
  filterLabel: {
    fontSize: 12,
    fontWeight: '600',
    color: '#555',
  },
  filterOptions: {
    flexDirection: 'row',
    gap: 8,
    flexWrap: 'wrap',
  },
  filterOption: {
    paddingHorizontal: 12,
    paddingVertical: 6,
    borderRadius: 20,
    borderWidth: 1,
    borderColor: '#ccc',
    backgroundColor: '#fafafa',
  },
  filterOptionActive: {
    backgroundColor: '#4F728C',
    borderColor: '#4F728C',
  },
  filterOptionText: {
    fontSize: 12,
    color: '#333',
    fontWeight: '500',
  },
  filterOptionTextActive: {
    color: 'white',
  },
  searchContent: {
    flex: 1,
    paddingHorizontal: 14,
    paddingVertical: 12,
  },
  categorySection: {
    marginBottom: 20,
  },
  categoryTitle: {
    fontSize: 14,
    fontWeight: '700',
    color: '#222',
    marginBottom: 10,
    paddingLeft: 2,
  },
  
  // Item Results
  itemResult: {
    flexDirection: 'row',
    backgroundColor: '#fafafa',
    borderRadius: 8,
    marginBottom: 10,
    overflow: 'hidden',
    borderWidth: 1,
    borderColor: '#e0e0e0',
  },
  itemResultImage: {
    width: 80,
    height: 80,
    backgroundColor: '#e0e0e0',
  },
  itemResultContent: {
    flex: 1,
    padding: 10,
    justifyContent: 'space-between',
  },
  itemResultTop: {
    gap: 4,
  },
  itemResultName: {
    fontSize: 13,
    fontWeight: '600',
    color: '#222',
  },
  itemResultDesc: {
    fontSize: 11,
    color: '#666',
    lineHeight: 14,
  },
  itemResultFooter: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
  },
  itemResultPrice: {
    fontSize: 12,
    fontWeight: '700',
    color: '#187bcd',
  },
  itemResultSeller: {
    fontSize: 10,
    color: '#999',
  },

  // User Results
  userResult: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: '#f5f7fa',
    borderRadius: 8,
    padding: 12,
    marginBottom: 10,
    borderWidth: 1,
    borderColor: '#dce8f1',
    gap: 12,
  },
  userResultAvatar: {
    width: 56,
    height: 56,
    borderRadius: 28,
    backgroundColor: '#9fb7c8',
    alignItems: 'center',
    justifyContent: 'center',
  },
  userResultContent: {
    flex: 1,
    gap: 3,
  },
  userResultName: {
    fontSize: 14,
    fontWeight: '600',
    color: '#222',
  },
  userResultBio: {
    fontSize: 12,
    color: '#666',
    lineHeight: 16,
  },
  userResultAddress: {
    fontSize: 10,
    color: '#999',
  },

  // Community Results
  communityResult: {
    backgroundColor: '#f0f7fc',
    borderRadius: 8,
    padding: 12,
    marginBottom: 10,
    borderWidth: 1,
    borderColor: '#c8dce8',
    gap: 8,
  },
  communityResultName: {
    fontSize: 14,
    fontWeight: '700',
    color: '#1c3b54',
  },
  communityResultDesc: {
    fontSize: 12,
    color: '#555',
    lineHeight: 16,
  },
  communityResultFooter: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
  },
  communityResultLake: {
    fontSize: 11,
    color: '#666',
    fontWeight: '500',
  },
  communityResultMembers: {
    fontSize: 11,
    color: '#4F728C',
    fontWeight: '600',
  },

  searchEmpty: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    paddingVertical: 40,
  },
  searchEmptyText: {
    fontSize: 14,
    color: '#888',
    textAlign: 'center',
  },

  // ─── Additional Spacing & Layout ─────────────────────────────────────────────
  spacerSmall: {
    height: 20,
  },
  spacerMedium: {
    height: 40,
  },
  centeredContent: {
    justifyContent: 'center',
    alignItems: 'center',
  },
  profileActionSmall: {
    marginTop: 16,
    alignSelf: 'center',
    paddingHorizontal: 24,
  },
  
  // ─── Form Errors & States ──────────────────────────────────────────────────────
  inputError: {
    borderColor: '#e74c3c',
    borderWidth: 1,
  },
  imagePlaceholderError: {
    color: '#e74c3c',
  },
  logoutBtn: {
    backgroundColor: '#c0392b',
  },

  // ─── Content Containers ────────────────────────────────────────────────────────
  contentGapSmall: {
    gap: 10,
  },
  contentGapMedium: {
    gap: 12,
  },
  contentGapLarge: {
    gap: 14,
  },
  scrollContentPadding: {
    padding: 14,
  },
  profileContentPadding: {
    paddingHorizontal: 16,
    paddingTop: 8,
    paddingBottom: 24,
  },
  profileContentMargin: {
    marginBottom: 12,
  },
  
  // ─── Search & Results ───────────────────────────────────────────────────────────
  searchProfileContainer: {
    alignItems: 'center',
    gap: 8,
  },
  searchItemsRow: {
    flexDirection: 'row',
    backgroundColor: '#fafafa',
    borderRadius: 6,
    padding: 8,
    marginBottom: 6,
    gap: 8,
  },
  searchItemImage: {
    width: 50,
    height: 50,
    borderRadius: 4,
  },
  searchItemContainer: {
    flex: 1,
    justifyContent: 'space-between',
  },
  searchItemName: {
    fontSize: 13,
    fontWeight: '600',
    color: '#222',
  },
  searchItemPrice: {
    fontSize: 12,
    color: '#187bcd',
    fontWeight: '700',
  },
  userProfileLabel: {
    fontSize: 12,
    color: '#666',
    fontWeight: '600',
    marginBottom: 4,
  },
  userProfileText: {
    fontSize: 14,
    color: '#222',
  },
  userListingLabel: {
    fontSize: 12,
    color: '#666',
    fontWeight: '600',
    marginBottom: 8,
  },
  userListingEmpty: {
    fontSize: 12,
    color: '#aaa',
  },
  detailScrollContent: {
    gap: 10,
  },

  // ─── Address & Community Selection ───────────────────────────────────────────────
  addressInputContainer: {
    position: 'relative',
    zIndex: 10,
  },
  addressInputBase: {
    marginBottom: 0,
  },
  addressSuggestions: {
    position: 'absolute',
    top: '100%',
    left: 0,
    right: 0,
    backgroundColor: 'white',
    borderRadius: 8,
    zIndex: 20,
    shadowColor: '#000',
    shadowOpacity: 0.12,
    shadowRadius: 6,
    elevation: 6,
  },
  addressSuggestionItem: {
    padding: 12,
  },
  addressSuggestionText: {
    fontSize: 14,
    color: '#333',
  },
  addressAptField: {
    marginTop: 10,
  },
  addressConfirmed: {
    padding: 12,
    borderRadius: 8,
    marginVertical: 8,
    backgroundColor: '#f0f7ff',
    borderWidth: 1,
    borderColor: '#4F728C',
  },
  addressConfirmedLabel: {
    fontSize: 13,
    color: '#4F728C',
    fontWeight: '600',
    marginBottom: 4,
  },
  addressConfirmedText: {
    fontSize: 13,
    color: '#333',
  },
  addressChangeLink: {
    color: '#4F728C',
    fontSize: 13,
    marginTop: 6,
  },
  communitySelectorContainer: {
    marginTop: 12,
  },
  communityLoadingContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 8,
    padding: 8,
  },
  communityLoadingText: {
    color: '#666',
    fontSize: 13,
  },
  communityNotFound: {
    padding: 12,
    backgroundColor: '#fff8e1',
    borderRadius: 8,
  },
  communityNotFoundText: {
    color: '#b8860b',
    fontWeight: '600',
  },
  communityNotFoundSubtext: {
    color: '#b8860b',
    fontSize: 12,
    marginTop: 4,
  },
  communityOption: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    padding: 12,
    borderRadius: 8,
    marginBottom: 6,
    borderWidth: 1.5,
  },
  communityOptionSelected: {
    borderColor: '#4F728C',
    backgroundColor: '#eaf2f8',
  },
  communityOptionUnselected: {
    borderColor: '#ddd',
    backgroundColor: '#fafafa',
  },
  communityOptionLabel: {
    fontWeight: '600',
  },
  communityOptionLabelSelected: {
    color: '#4F728C',
  },
  communityOptionLabelUnselected: {
    color: '#333',
  },
  communityOptionSubtext: {
    fontSize: 12,
    marginTop: 2,
  },
  communityOptionSubtextExisting: {
    color: '#888',
  },
  communityOptionSubtextNew: {
    color: '#e67e22',
  },
  communityOptionCheck: {
    color: '#4F728C',
    fontWeight: '700',
  },

  // ─── Community Posts ─────────────────────────────────────────────────────────────
  communityHeader: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 8,
    marginBottom: 12,
  },
  communityHeaderTitle: {
    flex: 1,
    fontSize: 20,
    fontWeight: '700',
    color: '#222',
  },
  communityLakeInfo: {
    fontSize: 12,
    color: '#666',
  },
  communityFeedHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    paddingHorizontal: 14,
    paddingVertical: 10,
  },
  communityFeedLabel: {
    fontSize: 12,
    color: '#666',
    fontWeight: '600',
  },
  communityFilterOption: {
    paddingHorizontal: 8,
    paddingVertical: 4,
  },
  communityFeedContent: {
    paddingHorizontal: 14,
    paddingVertical: 10,
  },
  communityPostHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
  },
  communityPostModalHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
  },
  communityPostCloseText: {
    fontSize: 16,
    color: '#4F728C',
    fontWeight: '600',
  },
  communityPostTitleText: {
    fontSize: 16,
    fontWeight: '700',
    color: '#222',
  },
  communityPostSubmitText: {
    fontSize: 16,
    fontWeight: '600',
  },
  communityPostSubmitDisabled: {
    color: '#ccc',
  },
  communityPostSubmitEnabled: {
    color: '#4F728C',
  },
  communityPostBox: {
    borderRadius: 8,
    borderWidth: 1,
  },
  communityPostBoxDefault: {
    borderColor: '#ddd',
    backgroundColor: 'white',
  },

  // ─── Delete Confirmation Modal ───────────────────────────────────────────────
  deleteModalOverlay: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    backgroundColor: 'rgba(0,0,0,0.5)',
  },
  deleteModalContent: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    gap: 10,
  },
  deleteModalTitle: {
    fontSize: 16,
    fontWeight: '700',
    color: '#222',
    marginBottom: 10,
  },
  deleteModalText: {
    fontSize: 14,
    color: '#666',
    marginBottom: 20,
  },
  deleteModalButtonRow: {
    flexDirection: 'row',
    justifyContent: 'flex-end',
    gap: 10,
  },
  deleteModalButtonText: {
    fontSize: 14,
    fontWeight: '600',
    color: '#333',
  },
  deleteModalButtonTextDanger: {
    fontSize: 14,
    fontWeight: '600',
    color: 'white',
  },
  // Connections panel
connectionsPanel: {
  flex: 1,
  backgroundColor: 'white',
  borderRadius: 16,
  padding: 16,
  paddingTop: 12,
  maxHeight: '85%',
},
connectionsOverlay: {
  flex: 1,
  justifyContent: 'center',
  padding: 20,
  backgroundColor: 'rgba(0,0,0,0.3)',
},
connectionsPanelHeader: {
  flexDirection: 'row',
  justifyContent: 'space-between',
  alignItems: 'center',
  marginBottom: 12,
},
connectionsPanelTitle: {
  fontSize: 17,
  fontWeight: '600',
  color: '#1a1a1a',
},
connectionRow: {
  flexDirection: 'row',
  alignItems: 'center',
  paddingVertical: 10,
  gap: 10,
  borderBottomWidth: 1,
  borderBottomColor: '#f0f0f0',
},
connectionAvatar: {
  width: 40,
  height: 40,
  borderRadius: 20,
  backgroundColor: '#4F728C',
  alignItems: 'center',
  justifyContent: 'center',
  overflow: 'hidden',
},
connectionName: {
  fontSize: 14,
  fontWeight: '600',
  color: '#1a1a1a',
},
connectionMeta: {
  fontSize: 12,
  color: '#888',
  marginTop: 1,
},
connectionAcceptBtn: {
  backgroundColor: '#4F728C',
  borderRadius: 6,
  padding: 6,
},
connectionDeclineBtn: {
  backgroundColor: '#e0e0e0',
  borderRadius: 6,
  padding: 6,
},
connectionEmpty: {
  textAlign: 'center',
  color: '#aaa',
  marginTop: 24,
  fontSize: 14,
},

  // ─── Post Modal Header ───────────────────────────────────────────────────────
  postModalHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
  },
  postModalCloseText: {
    fontSize: 16,
    color: '#4F728C',
    fontWeight: '600',
  },
  postModalTitle: {
    fontSize: 16,
    fontWeight: '700',
    color: '#222',
  },
  postModalSubmitText: {
    fontSize: 16,
    fontWeight: '600',
  },
  postModalSubmitEnabled: {
    color: '#4F728C',
  },
  postModalSubmitDisabled: {
    color: '#ccc',
  },

  // ─── Profile & Layout Helpers ───────────────────────────────────────────────
  profileScrollGrow: {
    flexGrow: 1,
  },
  flexContainer: {
    flex: 1,
  },
  spacerSmallHeight: {
    height: 20,
  },

  // ─── Delete Confirmation Modal Box ───────────────────────────────────────────
  deleteConfirmBox: {
    backgroundColor: 'white',
    borderRadius: 10,
    paddingHorizontal: 20,
    paddingVertical: 20,
    width: '80%',
    maxWidth: 300,
  },
  deleteConfirmButton: {
    paddingHorizontal: 16,
    paddingVertical: 8,
    borderRadius: 6,
  },
  deleteConfirmButtonCancel: {
    backgroundColor: '#f0f0f0',
  },
  deleteConfirmButtonDelete: {
    backgroundColor: '#E67E73',
  },

  // ─── Ad Styles ──────────────────────────────────────────────────────────────
  adCard: {
    backgroundColor: '#e8f4f8',
    borderRadius: 12,
    padding: 16,
    marginVertical: 12,
    borderWidth: 1,
    borderColor: '#d0e2f0',
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 4,
    elevation: 2,
  },
  adCardMarketplace: {
    backgroundColor: '#f0f9ff',
    borderColor: '#bae6fd',
  },
  adCardHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 12,
    paddingBottom: 8,
    borderBottomWidth: 1,
    borderBottomColor: 'rgba(79, 114, 140, 0.1)',
  },
  adCardBadge: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 4,
    backgroundColor: 'rgba(79, 114, 140, 0.1)',
    paddingHorizontal: 8,
    paddingVertical: 4,
    borderRadius: 12,
  },
  adCardSponsored: {
    fontSize: 10,
    fontWeight: '700',
    color: '#4F728C',
    textTransform: 'uppercase',
    letterSpacing: 0.5,
  },
  adCardOwner: {
    fontSize: 12,
    fontWeight: '600',
    color: '#666',
  },
  adPostContent: {
    gap: 8,
  },
  adMarketplaceContent: {
    flexDirection: 'row',
    gap: 12,
  },
  adMarketplaceImage: {
    width: 100,
    height: 100,
    borderRadius: 8,
    backgroundColor: '#ddd',
  },
  adTextContainer: {
    flex: 1,
    justifyContent: 'center',
  },
  adCardTitle: {
    fontSize: 16,
    fontWeight: '700',
    color: '#222',
    marginBottom: 4,
  },
  adCardBody: {
    fontSize: 14,
    lineHeight: 20,
    color: '#444',
    marginBottom: 8,
  },
  postAvatar: {
    width: 36,
    height: 36,
    borderRadius: 18,
    backgroundColor: '#4F728C',
    justifyContent: 'center',
    alignItems: 'center',
    overflow: 'hidden',
  },

})

// ─── Mobile Responsive Styles ─────────────────────────────────────────────────
export const responsiveStyles = StyleSheet.create({
  // Mobile navbar adjustments
  navbarMobile: {
    height: scaleHeight(56),
    paddingHorizontal: isSmallPhone ? 8 : 16,
  },
  logoMobile: {
    fontSize: scale(17),
    marginRight: isSmallPhone ? 6 : 12,
  },
  
  // Mobile body layout
  bodyMobile: {
    flexDirection: isPhone ? 'column' : 'row',
    gap: isPhone ? 8 : 10,
    padding: isSmallPhone ? 6 : 10,
  },
  
  // Mobile panels
  leftPanelMobile: {
    width: isPhone ? '100%' : 190,
    height: isPhone ? undefined : undefined,
    padding: isSmallPhone ? 8 : 12,
  },
  rightPanelMobile: {
    width: isPhone ? '100%' : 80,
    gap: isPhone ? 16 : 30,
  },
  
  // Mobile listing grid
  listingCardMobile: {
    width: isPhone ? (width - 24 - 16 - 6) / 2 : (190 - 24 - 6) / 2,
    height: isPhone ? (width - 24 - 16 - 6) / 2 : (190 - 24 - 6) / 2,
  },
  
  // Mobile marketplace grid
  gridContentMobile: {
    padding: isSmallPhone ? 8 : 14,
  },
  gridRowMobile: {
    gap: isSmallPhone ? 8 : 14,
  },
  cardMobile: {
    flex: 1,
    maxWidth: isSmallPhone ? 50 : 25,
  },
  
  // Mobile detail modal
  detailBoxMobile: {
    width: isPhone ? '95%' : '92%',
    flexDirection: isPhone ? 'column' : 'row',
    maxHeight: isPhone ? '90%' : '88%',
  },
  
  // Mobile profile
  profilePanelMobile: {
    margin: isSmallPhone ? 6 : 12,
  },
  profileHeaderMobile: {
    paddingVertical: scaleHeight(24),
    paddingHorizontal: isSmallPhone ? 8 : 16,
  },
  profileAvatarMobile: {
    width: isPhone ? 72 : 88,
    height: isPhone ? 72 : 88,
    borderRadius: isPhone ? 36 : 44,
  },
  profileNameMobile: {
    fontSize: scale(20),
  },
  
  // Mobile settings
  settingsPanelMobile: {
    margin: isSmallPhone ? 6 : 12,
  },
  settingsContentMobile: {
    padding: isSmallPhone ? 8 : 16,
  },
  settingsRowMobile: {
    paddingVertical: isSmallPhone ? 8 : 12,
    paddingHorizontal: isSmallPhone ? 2 : 4,
  },
  
  // Mobile search
  searchPanelMobile: {
    margin: isSmallPhone ? 6 : 12,
  },
  searchHeaderMobile: {
    padding: isSmallPhone ? 8 : 14,
    gap: isSmallPhone ? 8 : 12,
  },
  filterOptionMobile: {
    paddingHorizontal: isSmallPhone ? 8 : 12,
    paddingVertical: 6,
  },
  itemResultMobile: {
    marginBottom: isSmallPhone ? 6 : 10,
  },
  userResultMobile: {
    padding: isSmallPhone ? 8 : 12,
  },
  
  // Mobile modal
  modalBoxMobile: {
    width: isSmallPhone ? '90%' : '85%',
    padding: isSmallPhone ? 14 : 22,
  },
  modalTitleMobile: {
    fontSize: scale(17),
  },
  
  // Mobile forms
  inputMobile: {
    padding: isSmallPhone ? 8 : 10,
    fontSize: scale(15),
  },
  postInputMobile: {
    padding: isSmallPhone ? 8 : 10,
    minHeight: isSmallPhone ? 70 : 90,
  },
  imagePlaceholderMobile: {
    height: isSmallPhone ? 80 : 100,
  },
})

// ─── Tablet Specific Styles ───────────────────────────────────────────────────
export const tabletStyles = StyleSheet.create({
  // Tablet multi-column layouts
  bodyTablet: {
    flexDirection: 'row',
    gap: 12,
    padding: 12,
  },
  
  // Expanded panels
  leftPanelTablet: {
    width: 240,
    padding: 14,
  },
  rightPanelTablet: {
    width: 100,
  },
  
  // Larger grid for tablet
  gridRowTablet: {
    gap: 16,
  },
  cardTablet: {
    flex: 1,
    maxWidth: 30,
  },
  
  // Larger detail view
  detailBoxTablet: {
    width: '80%',
    maxHeight: '80%',
  },
  
  // Larger modals
  modalBoxTablet: {
    width: '70%',
    maxWidth: 600,
  },
})

// ─── Small Phone Styles (< 375px) ────────────────────────────────────────────
export const smallPhoneStyles = StyleSheet.create({
  safe: {
    flex: 1,
    backgroundColor: '#f2f2f2',
  },
  navbar: {
    height: 48,
    paddingHorizontal: 8,
  },
  logo: {
    fontSize: 14,
    marginRight: 6,
  },
  panelTitle: {
    fontSize: 13,
    marginBottom: 6,
  },
  filterBtn: {
    paddingHorizontal: 8,
    paddingVertical: 3,
  },
  filterBtnText: {
    fontSize: 10,
  },
  postBox: {
    padding: 10,
    marginBottom: 10,
  },
  profilePanel: {
    margin: 6,
  },
  settingsPanel: {
    margin: 6,
  },
  modalBox: {
    width: '90%',
    padding: 14,
  },
})

