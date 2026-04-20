import { StyleSheet } from "react-native"
import { COLORS, SPACING } from "../theme"

export const detailModalStyles = StyleSheet.create({
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
  detailScrollContent: {
    gap: 10,
  },
})
