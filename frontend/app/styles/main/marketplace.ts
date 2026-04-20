import { StyleSheet } from "react-native"
import { isPhone, COLORS, SPACING, TYPOGRAPHY } from "../theme"

export const marketplaceStyles = StyleSheet.create({
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
})
