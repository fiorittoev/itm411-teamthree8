import { StyleSheet } from "react-native"
import { COLORS, SPACING } from "../theme"

export const homeStyles = StyleSheet.create({
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
})
