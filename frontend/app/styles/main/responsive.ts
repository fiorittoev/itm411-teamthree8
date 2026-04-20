import { StyleSheet } from "react-native"
import { isSmallPhone, isPhone, width, scale, scaleHeight } from "../theme"

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
  
  // Mobile feed
  feedMobile: {
    flex: 1,
    borderRadius: isPhone ? 0 : 8,
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
