import { StyleSheet } from "react-native"

export const helperStyles = StyleSheet.create({
  spacerSmall: {
    height: 20,
  },
  spacerMedium: {
    height: 40,
  },
  spacerSmallHeight: {
    height: 20,
  },
  centeredContent: {
    justifyContent: 'center',
    alignItems: 'center',
  },
  flexContainer: {
    flex: 1,
  },
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
