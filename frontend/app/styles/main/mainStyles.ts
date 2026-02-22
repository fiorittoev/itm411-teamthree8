import { StyleSheet } from "react-native"

export const mainStyles = StyleSheet.create({
  // ─── Common ──────────────────────────────────────────────────────────────────
  safe: { 
    flex: 1, 
    backgroundColor: '#f2f2f2'
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
    margin: 12, 
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
    maxWidth: 25 
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
})
