// Main styles barrel export - imports from specialized style modules
import { isSmallPhone, isPhone, isTablet, scale, scaleHeight, width, COLORS, SPACING, TYPOGRAPHY } from "../theme"

// Import all style modules
import { commonStyles } from "./common"
import { homeStyles } from "./homeScreen"
import { marketplaceStyles } from "./marketplace"
import { formStyles } from "./forms"
import { modalStyles } from "./modals"
import { detailModalStyles } from "./detailModal"
import { profileStyles } from "./profile"
import { settingsStyles } from "./settings"
import { searchStyles } from "./search"
import { addressAndCommunityStyles } from "./addressAndCommunity"
import { communityPostsStyles } from "./communityPosts"
import { deleteModalStyles } from "./deleteModals"
import { connectionStyles } from "./connections"
import { postModalStyles } from "./postModal"
import { adStyles } from "./ads"
import { helperStyles } from "./helpers"
import { responsiveStyles } from "./responsive"
import { tabletStyles } from "./tablet"
import { smallPhoneStyles } from "./smallPhone"

// Re-export all styles combined into a single mainStyles object
export const mainStyles = {
  // ─── Common ──────────────────────────────────────────────────────────────────
  safe: { 
    flex: 1, 
    backgroundColor: COLORS.background,
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
    backgroundColor: COLORS.secondaryDark, 
    flexDirection: 'row', 
    alignItems: 'center', 
    paddingHorizontal: SPACING.lg
  },
  communityDescription: {
  fontSize: 13,
  color: COLORS.textMuted,
  marginTop: 2,
},
communityMemberCount: {
  fontSize: 12,
  color: COLORS.textLight,
  marginTop: 2,
},
  logo: { 
    color: COLORS.white, 
    fontSize: 17, 
    fontWeight: '700',
    marginRight: SPACING.md
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
    borderColor: COLORS.white, 
    alignItems: 'center',
    justifyContent: 'center'
  },
  body: { 
    flex: 1, 
    flexDirection: 'row', 
    gap: SPACING.sm, 
    padding: SPACING.sm 
  },
  
  // ─── Home Screen ─────────────────────────────────────────────────────────────
  leftPanel: { 
    width: 190, 
    backgroundColor: COLORS.surface, 
    borderRadius: 8, 
    padding: SPACING.md 
  },
  panelTitle: { 
    fontSize: 15, 
    fontWeight: '700', 
    marginBottom: SPACING.sm, 
    color: COLORS.text 
  },
  filterRow: { 
    flexDirection: 'row', 
    gap: SPACING.xs,
    marginBottom: SPACING.sm, 
    flexWrap: 'wrap' 
  },
  filterBtn: { 
    backgroundColor: COLORS.secondaryLight, 
    paddingHorizontal: SPACING.sm, 
    paddingVertical: SPACING.xs, 
    borderRadius: 20 
  },
  filterBtnText: { 
    fontSize: 12, 
    color: COLORS.white, 
    fontWeight: '600'
  },
  listingGrid: { 
    flex: 1, 
    flexDirection: 'row', 
    flexWrap: 'wrap', 
    gap: SPACING.xs 
  },
  listingCard: { 
    width: (190 - 24 - 6) / 2,
    height: (190 - 24 - 6) / 2, 
    borderRadius: 8, 
    overflow: 'hidden', 
    borderWidth: 1,
    borderColor: COLORS.borderDark, 
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
    color: COLORS.white, 
    fontSize: 11, 
    fontWeight: '700'
  },
  shopBtn: { 
    marginTop: SPACING.sm,
    backgroundColor: COLORS.secondaryLight,
    borderRadius: 8,
    paddingVertical: SPACING.sm,
    alignItems: 'center'
  },
  shopBtnText: { 
    color: COLORS.white, 
    fontWeight: '700',
    fontSize: 13
  },
  feed: { 
    flex: 1, 
    backgroundColor: COLORS.surface, 
    borderRadius: 8, 
    overflow: 'hidden' 
  },
  feedHeader: { 
    flexDirection: 'row', 
    justifyContent: 'space-between', 
    alignItems: 'center', 
    padding: SPACING.md,
    borderBottomWidth: 1,
    borderBottomColor: COLORS.borderLight
  },
  feedTitle: {
    fontSize: 16, 
    fontWeight: '700', 
    color: COLORS.text
  },
  addBtn: {
    width: 32, 
    height: 32,
    borderRadius: 6, 
    borderWidth: 1, 
    borderColor: COLORS.text, 
    alignItems: 'center', 
    justifyContent: 'center'
  },
  addBtnText: { 
    fontSize: 20, 
    color: COLORS.text, 
    lineHeight: 24 
  },
  postBox: { 
    backgroundColor: COLORS.backgroundLight, 
    borderRadius: 8,
    padding: SPACING.md, 
    marginBottom: SPACING.md, 
    paddingBottom: 36 
  },
  postTitle: {
    fontSize: 18,
    fontWeight: '700',
    color: COLORS.text,
    marginBottom: SPACING.sm,
  },
  postLabel: {
    fontSize: 13,
    fontWeight: '600',
    color: COLORS.textMuted,
    marginBottom: SPACING.xs,
  },
  postHeader: { 
    flexDirection: 'row', 
    justifyContent: 'space-between', 
    alignItems: 'baseline',
    marginBottom: SPACING.xs 
  },
  postAuthor: {
    fontWeight: '700', 
    fontSize: 13,
    color: COLORS.text
  },
  postTime: { 
    fontSize: 11, 
    color: COLORS.textMuted 
  },
  postText: { 
    fontSize: 14, 
    lineHeight: 20,
    color: COLORS.text
  },
  deleteBtn: {
    position: 'absolute',
    bottom: 10, 
    right: 12 
  },
  rightPanel: {
    width: 80, 
    backgroundColor: COLORS.surface, 
    borderRadius: 8,
    padding: SPACING.md,
    alignItems: 'center', 
    paddingTop: 20, 
    gap: 30
  },
  sideItem: {
    alignItems: 'center', 
    gap: SPACING.xs 
  },
  sideLabel: { 
    fontSize: 12, 
    color: COLORS.text 
  },
  emptyText: { 
    color: COLORS.textLight, 
    fontSize: 12, 
    textAlign: 'center', 
    marginTop: SPACING.sm 
  },
  
  // ─── Marketplace Screen ───────────────────────────────────────────────────────
  marketplace: { 
    flex: 1, 
    margin: isPhone ? SPACING.md : 15, 
    backgroundColor: COLORS.surface, 
    borderRadius: 8, 
    overflow: 'hidden'
  },
  marketHeader: { 
    flexDirection: 'row', 
    justifyContent: 'space-between', 
    alignItems: 'center',
    padding: SPACING.md, 
    borderBottomWidth: 1, 
    borderBottomColor: COLORS.borderLight
  },
  headerLeft: { 
    flexDirection: 'row', 
    alignItems: 'center',
    gap: SPACING.md, 
    flex: 1, 
    flexWrap: 'wrap'
  },
  marketTitle: { 
    fontSize: isPhone ? 16 : 18, 
    fontWeight: '700', 
    color: COLORS.text 
  },
  filterBtnActive: { 
    backgroundColor: COLORS.secondaryDark
  },
  gridContent: { 
    padding: isPhone ? SPACING.sm : SPACING.md, 
    paddingBottom: SPACING.xl
  },
  gridRow: { 
    flexDirection: 'row',
    gap: isPhone ? SPACING.xs : SPACING.sm, 
  },
  card: { 
    flex: 1,
    maxWidth: isPhone ? 200 : 300,
  },
  cardImg: {
    width: '100%', 
    aspectRatio: isPhone ? 1 : 0.85,
    borderRadius: 10, 
    marginBottom: isPhone ? SPACING.xs : 0,
    backgroundColor: COLORS.backgroundLight,
  },
  cardInfo: {
    flexDirection: 'row', 
    justifyContent: 'space-between', 
    alignItems: 'flex-start',
    paddingHorizontal: SPACING.xs,
    paddingVertical: isPhone ? 0 : SPACING.xs,
  },
  cardText: { 
    flex: 1,
    gap: SPACING.xs
  },
  cardName: { 
    fontSize: isPhone ? 12 : 13, 
    fontWeight: '500', 
    color: COLORS.text 
  },
  cardPrice: { 
    fontSize: isPhone ? 12 : 13, 
    fontWeight: '700', 
    color: COLORS.primary
  },
  cardFav: { 
    fontSize: 16, 
    color: COLORS.text, 
    marginLeft: SPACING.xs, 
    marginTop: 0
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
    backgroundColor: COLORS.surface,
    width: '85%', 
    maxWidth: 480, 
    borderRadius: 12, 
    padding: SPACING.xl, 
    gap: SPACING.lg
  },
  modalTitle: { 
    fontSize: 17, 
    fontWeight: '700', 
    textAlign: 'center', 
    color: COLORS.text 
  },
  modalActions: { 
    flexDirection: 'row', 
    gap: SPACING.sm,
    marginTop: SPACING.xs 
  },
  btn: { 
    flex: 1, 
    paddingVertical: 11, 
    borderRadius: 8, 
    alignItems: 'center' 
  },
  btnCancel: { 
    backgroundColor: COLORS.borderLight
  },
  btnCancelText: {
    color: COLORS.text,
    fontWeight: '600',
    fontSize: 15 
  },
  btnBlue: {
    backgroundColor: COLORS.primary
  },
  btnRed: { 
    backgroundColor: COLORS.error 
  },
  btnText: { 
    color: COLORS.white, 
    fontWeight: '700', 
    fontSize: 15
  },
  
  // ─── Forms ────────────────────────────────────────────────────────────────────
  input: { 
    borderWidth: 1, 
    borderColor: COLORS.borderDark, 
    borderRadius: 8, 
    padding: SPACING.sm, 
    fontSize: TYPOGRAPHY.body.fontSize, 
    color: COLORS.text 
  },
  textarea: { 
    minHeight: 70, 
    textAlignVertical: 'top'
  },
  postInput: { 
    borderWidth: 1, 
    borderColor: COLORS.borderDark,
    borderRadius: 8,
    padding: SPACING.sm, 
    fontSize: TYPOGRAPHY.body.fontSize, 
    minHeight: 90, 
    textAlignVertical: 'top' 
  },
  imagePicker: { 
    borderWidth: 1, 
    borderColor: COLORS.borderDark, 
    borderRadius: 8, 
    overflow: 'hidden' 
  },
  imagePlaceholder: { 
    height: 100, 
    alignItems: 'center', 
    justifyContent: 'center', 
    gap: SPACING.sm, 
    backgroundColor: COLORS.backgroundLight
  },
  imagePlaceholderText: { 
    color: COLORS.textLight, 
    fontSize: TYPOGRAPHY.body.fontSize 
  },
  imagePreview: { 
    width: '100%', 
    height: 160 
  },
  
  // ─── Detail Modal ────────────────────────────────────────────────────────────
  detailBox: {
    backgroundColor: COLORS.surface, 
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
    padding: SPACING.lg 
  },
  detailName: { 
    fontSize: 20, 
    fontWeight: '700', 
    color: COLORS.text 
  },
  detailPrice: {
    fontSize: 18, 
    fontWeight: '700', 
    color: COLORS.text 
  },
  detailSeller: { 
    fontSize: 13, 
    color: COLORS.textMuted 
  },
  detailDesc: {
    fontSize: 14, 
    color: COLORS.text, 
    lineHeight: 20 
  },
  favBtn: { 
    borderWidth: 1, 
    borderColor: COLORS.borderDark, 
    borderRadius: 8, 
    paddingVertical: SPACING.sm, 
    alignItems: 'center'
  },
  favBtnText: {
    fontSize: 15, 
    color: COLORS.text 
  },
  contactBox: { 
    borderTopWidth: 1, 
    borderTopColor: COLORS.borderLight, 
    paddingTop: SPACING.sm, 
    gap: SPACING.xs 
  },
  contactTitle: { 
    fontWeight: '700', 
    fontSize: 14, 
    marginBottom: SPACING.xs, 
    color: COLORS.text 
  },
  contactText: { 
    fontSize: 13, 
    color: COLORS.textMuted 
  },

  // ─── Profile Screen ──────────────────────────────────────────────────────────
  profilePanel: {
    flex: 1,
    margin: SPACING.md,
    backgroundColor: COLORS.surface,
    borderRadius: 8,
    overflow: 'hidden',
  },
  profileHeader: {
    alignItems: 'center',
    paddingVertical: SPACING.xl,
    paddingHorizontal: SPACING.lg,
    borderBottomWidth: 1,
    borderBottomColor: COLORS.borderLight,
  },
  profileAvatar: {
    width: 88,
    height: 88,
    borderRadius: 44,
    backgroundColor: COLORS.secondaryLight,
    alignItems: 'center',
    justifyContent: 'center',
    marginBottom: SPACING.md,
  },
  profileName: {
    fontSize: 20,
    fontWeight: '700',
    color: COLORS.text,
    marginBottom: SPACING.xs,
  },
  profileMeta: {
    fontSize: 13,
    color: COLORS.textMuted,
  },
  profileBody: {
    padding: SPACING.lg,
    gap: SPACING.md,
  },
  profileRow: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: SPACING.sm,
    paddingVertical: SPACING.sm,
    borderBottomWidth: 1,
    borderBottomColor: COLORS.backgroundLight,
  },
  profileRowIcon: {
    width: 36,
    alignItems: 'center',
  },
  profileRowLabel: {
    fontSize: 12,
    color: COLORS.textMuted,
    marginBottom: SPACING.xs,
  },
  profileRowValue: {
    fontSize: 15,
    fontWeight: '500',
    color: COLORS.text,
    flex: 1,
  },
  profileAction: {
    marginTop: SPACING.lg,
    backgroundColor: COLORS.secondaryLight,
    borderRadius: 8,
    paddingVertical: SPACING.md,
    alignItems: 'center',
  },
  profileActionText: {
    color: COLORS.white,
    fontWeight: '700',
    fontSize: 15,
  },

  // ─── Settings Screen ─────────────────────────────────────────────────────────
  settingsPanel: {
    flex: 1,
    margin: SPACING.md,
    backgroundColor: COLORS.surface,
    borderRadius: 8,
    overflow: 'hidden',
  },
  settingsContent: {
    padding: SPACING.lg,
    paddingBottom: 30,
  },
  settingsSection: {
    marginBottom: 20,
  },
  settingsSectionTitle: {
    fontSize: 13,
    fontWeight: '700',
    color: COLORS.textMuted,
    marginBottom: SPACING.sm,
    textTransform: 'uppercase',
    letterSpacing: 0.5,
  },
  settingsRow: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    paddingVertical: SPACING.md,
    paddingHorizontal: SPACING.xs,
    borderBottomWidth: 1,
    borderBottomColor: COLORS.backgroundLight,
  },
  settingsRowLeft: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: SPACING.md,
    flex: 1,
  },
  settingsRowText: {
    flex: 1,
  },
  settingsRowLabel: {
    fontSize: 15,
    fontWeight: '600',
    color: COLORS.text,
  },
  settingsRowValue: {
    fontSize: 14,
    color: COLORS.textMuted,
    marginTop: SPACING.xs,
  },
  settingsRowSubtext: {
    fontSize: 12,
    color: COLORS.textLight,
    marginTop: SPACING.xs,
  },
  settingsModal: {
    backgroundColor: COLORS.surface,
    width: '85%',
    maxWidth: 480,
    borderRadius: 12,
    padding: SPACING.xl,
    gap: SPACING.lg,
  },
  settingsModalTitle: {
    fontSize: 17,
    fontWeight: '700',
    textAlign: 'center',
    color: COLORS.text,
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
  
  // Form Errors & States
  inputError: {
    borderColor: COLORS.error,
    borderWidth: 1.5,
  },
  imagePlaceholderError: {
    color: COLORS.error,
  },
  logoutBtn: {
    backgroundColor: COLORS.errorDark,
  },

  // ─── Additional Shared Styles ─────────────────────────────────────────────────
  connectionRow: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingVertical: SPACING.sm,
    gap: SPACING.sm,
    borderBottomWidth: 1,
    borderBottomColor: COLORS.backgroundLight,
  },
  connectionAvatar: {
    width: 40,
    height: 40,
    borderRadius: 20,
    backgroundColor: COLORS.secondaryDark,
    alignItems: 'center',
    justifyContent: 'center',
    overflow: 'hidden',
  },
  connectionName: {
    fontSize: 14,
    fontWeight: '600',
    color: COLORS.text,
  },
  connectionMeta: {
    fontSize: 12,
    color: COLORS.textLight,
    marginTop: SPACING.xs,
  },
  connectionAcceptBtn: {
    backgroundColor: COLORS.secondaryDark,
    borderRadius: 6,
    padding: SPACING.xs,
  },
  connectionDeclineBtn: {
    backgroundColor: COLORS.borderLight,
    borderRadius: 6,
    padding: SPACING.xs,
  },
  connectionEmpty: {
    textAlign: 'center',
    color: COLORS.textLight,
    marginTop: SPACING.lg,
    fontSize: 14,
  },

  // ─── State-specific Colors ────────────────────────────────────────────────────
  postAvatar: {
    width: 36,
    height: 36,
    borderRadius: 18,
    backgroundColor: COLORS.secondaryDark,
    justifyContent: 'center',
    alignItems: 'center',
    overflow: 'hidden',
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

  ...commonStyles,
  ...homeStyles,
  ...marketplaceStyles,
  ...formStyles,
  ...modalStyles,
  ...detailModalStyles,
  ...profileStyles,
  ...settingsStyles,
  ...searchStyles,
  ...addressAndCommunityStyles,
  ...communityPostsStyles,
  ...deleteModalStyles,
  ...connectionStyles,
  ...postModalStyles,
  ...adStyles,
  ...helperStyles,
}

// Re-export all style categories
export {
  commonStyles,
  homeStyles,
  marketplaceStyles,
  formStyles,
  modalStyles,
  detailModalStyles,
  profileStyles,
  settingsStyles,
  searchStyles,
  addressAndCommunityStyles,
  communityPostsStyles,
  deleteModalStyles,
  connectionStyles,
  postModalStyles,
  adStyles,
  helperStyles,
  responsiveStyles,
  tabletStyles,
  smallPhoneStyles,
}

// Re-export theme utilities
export { isSmallPhone, isPhone, isTablet, scale, scaleHeight, width }

