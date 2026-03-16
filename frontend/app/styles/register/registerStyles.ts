import { StyleSheet, Dimensions } from "react-native"

import { COLORS, isSmallPhone, isPhone, isTablet, scale, scaleHeight } from "../theme"
export { COLORS, isSmallPhone, isPhone, isTablet, scale, scaleHeight }

export const registerStyles = StyleSheet.create({
  // ===== Layout =====
  container: {
    flex: 1,
    backgroundColor: COLORS.background,
    paddingHorizontal: 24,
    paddingTop: 40,
  },
  section: {
    marginBottom: 28,
  },
  card: {
    backgroundColor: "white",
    borderRadius: 14,
    padding: 18,
    borderWidth: 1,
    borderColor: COLORS.border,
  },
  paddingContainer: {
    padding: 20,
  },
  scrollContainer: {
    padding: 20,
  },

  // ===== Typography =====
  title: {
    fontSize: 26,
    fontWeight: "700",
    color: COLORS.primary,
    marginBottom: 8,
  },
  titleLarge: {
    fontSize: 22,
    marginBottom: 10,
  },
  titleMedium: {
    fontSize: 20,
    fontWeight: "600",
    marginBottom: 16,
  },
  subtitle: {
    fontSize: 15,
    color: COLORS.mutedText,
    marginBottom: 24,
    lineHeight: 20,
  },
  subtitleMedium: {
    marginBottom: 20,
  },
  label: {
    fontSize: 13,
    color: COLORS.mutedText,
    marginBottom: 6,
  },
  labelSmall: {
    fontSize: 12,
    color: COLORS.darkGray,
    marginBottom: 3,
  },
  labelMedium: {
    fontSize: 12,
    color: COLORS.darkGray,
    marginBottom: 4,
    marginTop: 4,
  },
  bodyText: {
    fontSize: 15,
    color: COLORS.black,
  },
  helperText: {
    fontSize: 12,
    marginTop: 6,
  },
  errorText: {
    fontSize: 12,
    color: COLORS.error,
    marginTop: 4,
  },
  errorTextSmall: {
    color: COLORS.error,
    marginTop: 5,
    fontSize: 12,
  },
  successText: {
    fontSize: 12,
    color: COLORS.success,
    marginTop: 4,
  },
  successTextSmall: {
    color: COLORS.success,
    marginTop: 5,
  },
  backButton: {
    fontSize: 16,
  },
  headerText: {
    fontSize: 16,
    color: COLORS.darkGray,
    marginBottom: 8,
  },
  infoText: {
    marginTop: 15,
  },
  infoTextSmall: {
    marginTop: 20,
  },
  emptyText: {
    color: COLORS.gray,
    fontSize: 13,
    textAlign: "center",
    marginTop: 8,
  },

  // ===== Inputs =====
  input: {
    borderWidth: 1.5,
    borderColor: COLORS.border,
    borderRadius: 10,
    paddingVertical: 12,
    paddingHorizontal: 14,
    fontSize: 15,
    backgroundColor: "white",
    color: COLORS.black,
  },
  inputFocused: {
    borderColor: COLORS.primary,
  },
  inputError: {
    borderColor: COLORS.error,
  },
  inputSuccess: {
    borderColor: COLORS.success,
  },
  inputWithMargin: {
    marginBottom: 10,
  },
  textarea: {
    height: 120,
    textAlignVertical: "top",
  },
  characterCounter: {
    marginTop: 5,
  },
  inputContainer: {
    position: "relative",
  },
  inputWithIcon: {
    paddingRight: 40,
  },
  iconContainer: {
    position: "absolute",
    right: 12,
    top: 12,
  },
  checkIcon: {
    position: "absolute",
    right: 12,
    top: 10,
    color: COLORS.success,
    fontSize: 18,
  },

  // ===== Buttons =====
  primaryButton: {
    backgroundColor: COLORS.primary,
    paddingVertical: 14,
    borderRadius: 10,
    alignItems: "center",
    justifyContent: "center",
  },
  primaryButtonText: {
    color: "white",
    fontSize: 16,
    fontWeight: "600",
  },
  secondaryButton: {
    borderWidth: 1.5,
    borderColor: COLORS.primary,
    paddingVertical: 12,
    borderRadius: 10,
    alignItems: "center",
  },
  secondaryButtonText: {
    color: COLORS.primary,
    fontSize: 15,
    fontWeight: "600",
  },
  editButton: {
    fontSize: 13,
    color: COLORS.blue,
  },
  editButtonActive: {
    fontSize: 13,
    color: COLORS.error,
  },
  cancelButton: {
    fontSize: 13,
    color: COLORS.blue,
  },
  linkButton: {
    color: COLORS.blue,
    fontSize: 13,
    marginTop: 6,
  },

  // ===== Chips (Interests / Categories) =====
  chip: {
    paddingHorizontal: 14,
    paddingVertical: 8,
    borderRadius: 20,
    borderWidth: 1.5,
    borderColor: COLORS.secondary,
    backgroundColor: COLORS.offWhite,
  },
  chipSelected: {
    backgroundColor: COLORS.primary,
    borderColor: COLORS.primary,
  },
  chipText: {
    fontSize: 13,
    color: COLORS.primary,
  },
  chipTextSelected: {
    color: "white",
    fontWeight: "600",
  },
  interestChip: {
    paddingVertical: 10,
    paddingHorizontal: 15,
    borderRadius: 20,
    marginBottom: 5,
  },
  interestChipSelected: {
    backgroundColor: "green",
  },
  interestChipUnselected: {
    backgroundColor: "#ddd",
  },
  interestChipText: {
    color: "black",
  },
  interestChipTextSelected: {
    color: "white",
  },
  categoryChip: {
    paddingHorizontal: 12,
    paddingVertical: 6,
    borderRadius: 20,
    borderWidth: 1.5,
  },
  categoryChipSelected: {
    borderColor: COLORS.blue,
    backgroundColor: COLORS.lightBlue,
  },
  categoryChipUnselected: {
    borderColor: "#ddd",
    backgroundColor: COLORS.white,
  },
  categoryChipText: {
    fontSize: 13,
    fontWeight: "400",
    color: COLORS.darkGray,
  },
  categoryChipTextSelected: {
    fontSize: 13,
    fontWeight: "600",
    color: COLORS.blue,
  },
  reviewChip: {
    backgroundColor: "#e8f5e9",
    borderRadius: 12,
    paddingHorizontal: 10,
    paddingVertical: 4,
  },
  reviewChipText: {
    color: COLORS.success,
  },

  // ===== Progress Bar =====
  progressBackground: {
    height: 6,
    backgroundColor: COLORS.secondary,
    borderRadius: 6,
    overflow: "hidden",
    marginTop: 16,
  },
  progressFill: {
    height: "100%",
    backgroundColor: COLORS.primary,
    borderRadius: 4,
  },
  progressFillDynamic: {
    height: "100%",
    backgroundColor: "green",
    borderRadius: 4,
  },

  // ===== Location Step =====
  autocompleteContainer: {
    position: "relative",
    zIndex: 10,
  },
  suggestionsContainer: {
    position: "absolute",
    top: "100%",
    left: 0,
    right: 0,
    backgroundColor: COLORS.white,
    borderRadius: 8,
    zIndex: 20,
    borderWidth: 1,
    borderColor: "#e0e0e0",
    shadowColor: "#000",
    shadowOpacity: 0.1,
    shadowRadius: 8,
    shadowOffset: { width: 0, height: 4 },
    elevation: 5,
  },
  suggestionItem: {
    padding: 12,
  },
  suggestionItemBorder: {
    borderBottomWidth: 1,
    borderBottomColor: COLORS.lightestGray,
  },
  suggestionText: {
    fontSize: 14,
    color: COLORS.darkerGray,
  },
  addressPreview: {
    marginTop: 4,
    marginBottom: 20,
    padding: 14,
    borderRadius: 10,
    borderLeftWidth: 4,
  },
  addressPreviewWarning: {
    backgroundColor: "#fff3e0",
    borderLeftColor: COLORS.orange,
  },
  addressPreviewNormal: {
    backgroundColor: "#f8f9fa",
    borderLeftColor: COLORS.blue,
  },
  addressPreviewChecking: {
    backgroundColor: "#f8f9fa",
    borderLeftColor: "#bbb",
  },
  addressStatusRow: {
    flexDirection: "row",
    alignItems: "center",
    gap: 6,
    marginBottom: 4,
  },
  addressStatusText: {
    fontSize: 12,
    color: COLORS.gray,
  },
  addressStatusTextWarning: {
    fontSize: 12,
    color: COLORS.orange,
  },
  addressText: {
    fontSize: 15,
    color: "#222",
    fontWeight: "500",
  },
  addressWarningText: {
    fontSize: 12,
    color: COLORS.darkOrange,
    marginTop: 4,
  },
  communitySelector: {
    borderRadius: 12,
    borderWidth: 1.5,
    overflow: "hidden",
  },
  communitySelectorDisabled: {
    borderColor: "#e0e0e0",
  },
  communitySelectorWarning: {
    borderColor: COLORS.orange,
  },
  communitySelectorActive: {
    borderColor: COLORS.blue,
  },
  communityHeader: {
    padding: 14,
  },
  communityHeaderDisabled: {
    backgroundColor: COLORS.lightGray,
  },
  communityHeaderActive: {
    backgroundColor: COLORS.lightBlue,
  },
  communityHeaderTitle: {
    fontSize: 15,
    fontWeight: "600",
  },
  communityHeaderTitleDisabled: {
    color: COLORS.gray,
  },
  communityHeaderTitleActive: {
    color: COLORS.blue,
  },
  communityHeaderSubtitle: {
    fontSize: 12,
    marginTop: 2,
  },
  communityHeaderSubtitleDisabled: {
    color: "#bbb",
  },
  communityHeaderSubtitleActive: {
    color: COLORS.darkGray,
  },
  communityContent: {
    padding: 14,
  },
  communityEmptyState: {
    alignItems: "center",
    paddingVertical: 20,
  },
  communityEmptyText: {
    color: COLORS.gray,
    fontSize: 14,
    textAlign: "center",
  },
  communityLoadingState: {
    alignItems: "center",
    paddingVertical: 20,
  },
  communityLoadingText: {
    color: COLORS.gray,
    fontSize: 13,
    marginTop: 8,
  },
  communityErrorState: {
    alignItems: "center",
    paddingVertical: 16,
  },
  communityErrorTitle: {
    color: COLORS.orange,
    fontWeight: "600",
    marginBottom: 4,
    textAlign: "center",
  },
  communityErrorText: {
    color: COLORS.darkOrange,
    fontSize: 13,
    textAlign: "center",
  },
  communityOption: {
    padding: 12,
    marginVertical: 4,
    borderRadius: 8,
    borderWidth: 1.5,
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
  },
  communityOptionSelected: {
    backgroundColor: COLORS.blue,
    borderColor: COLORS.blue,
  },
  communityOptionUnselected: {
    backgroundColor: COLORS.lightGray,
    borderColor: "#e0e0e0",
  },
  communityOptionText: {
    fontSize: 15,
    fontWeight: "400",
    color: COLORS.darkerGray,
  },
  communityOptionTextSelected: {
    fontSize: 15,
    fontWeight: "600",
    color: COLORS.white,
  },
  communityOptionSubtext: {
    fontSize: 11,
    marginTop: 1,
    fontStyle: "normal",
    color: COLORS.gray,
  },
  communityOptionSubtextSelected: {
    fontSize: 11,
    marginTop: 1,
    color: "rgba(255,255,255,0.7)",
  },
  communityOptionSubtextNew: {
    fontSize: 11,
    color: COLORS.blue,
  },
  communityOptionCheck: {
    color: COLORS.white,
    fontSize: 16,
  },

  // ===== Items Step =====
  itemCard: {
    backgroundColor: COLORS.lightGray,
    borderRadius: 10,
    padding: 14,
    marginBottom: 10,
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "flex-start",
  },
  itemCardContent: {
    flex: 1,
  },
  itemCardHeader: {
    flexDirection: "row",
    alignItems: "center",
    gap: 8,
  },
  itemCardName: {
    fontWeight: "600",
    fontSize: 15,
  },
  itemCardCategory: {
    backgroundColor: COLORS.lightBlue,
    borderRadius: 8,
    paddingHorizontal: 8,
    paddingVertical: 2,
  },
  itemCardCategoryText: {
    fontSize: 11,
    color: COLORS.blue,
  },
  itemCardDescription: {
    color: COLORS.mutedText,
    fontSize: 13,
    marginTop: 4,
  },
  itemCardDelete: {
    paddingLeft: 10,
  },
  itemCardDeleteText: {
    color: COLORS.error,
    fontSize: 18,
  },
  itemForm: {
    borderWidth: 1.5,
    borderColor: COLORS.blue,
    borderRadius: 12,
    padding: 16,
    marginBottom: 12,
  },
  itemFormTitle: {
    fontWeight: "600",
    fontSize: 15,
    marginBottom: 12,
  },
  itemFormAddButton: {
    borderWidth: 1.5,
    borderColor: COLORS.blue,
    borderStyle: "dashed",
    borderRadius: 12,
    padding: 16,
    alignItems: "center",
    marginBottom: 12,
  },
  itemFormAddButtonText: {
    color: COLORS.blue,
    fontSize: 15,
    fontWeight: "600",
  },
  itemFormActions: {
    flexDirection: "row",
    gap: 10,
  },
  itemFormCancelButton: {
    flex: 1,
    padding: 12,
    borderRadius: 8,
    borderWidth: 1,
    borderColor: "#ddd",
    alignItems: "center",
  },
  itemFormCancelButtonText: {
    color: COLORS.darkGray,
  },
  itemFormSubmitButton: {
    flex: 2,
    padding: 12,
    borderRadius: 8,
    backgroundColor: COLORS.blue,
    alignItems: "center",
  },
  itemFormSubmitButtonText: {
    color: COLORS.white,
    fontWeight: "600",
  },

  // ===== Review Step =====
  reviewContainer: {
    padding: 20,
    gap: 12,
  },
  reviewRow: {
    borderBottomWidth: 1,
    borderBottomColor: "#eee",
    paddingBottom: 10,
  },
  reviewRowHeader: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
  },
  reviewRowLabel: {
    fontSize: 12,
    color: COLORS.gray,
  },
  reviewRowValue: {
    fontSize: 15,
    marginTop: 2,
  },
  reviewSection: {
    marginBottom: 4,
  },
  reviewSectionTitle: {
    fontWeight: "600",
    marginBottom: 4,
  },
  reviewChipsContainer: {
    flexDirection: "row",
    flexWrap: "wrap",
    gap: 6,
  },
  reviewItemsContainer: {
    marginBottom: 6,
  },
  reviewItemCard: {
    backgroundColor: COLORS.lightGray,
    borderRadius: 8,
    padding: 10,
    marginBottom: 6,
  },
  reviewItemName: {
    fontWeight: "500",
  },
  reviewItemCategory: {
    fontWeight: "400",
    color: COLORS.gray,
  },
  reviewItemDescription: {
    color: COLORS.mutedText,
    fontSize: 13,
  },
  reviewEditInput: {
    borderWidth: 1,
    borderColor: COLORS.blue,
    borderRadius: 6,
    padding: 8,
    marginTop: 6,
    fontSize: 15,
  },
  reviewEditInputMultiline: {
    minHeight: 80,
    textAlignVertical: "top",
  },

  // ===== End Step =====
  endContainer: {
    padding: 20,
  },
  endText: {
    fontSize: 16,
    color: COLORS.darkGray,
  },

  // ===== Additional Layout Styles =====
  scrollGrowContainer: {
    flexGrow: 1,
    paddingBottom: 30,
  },
  overflowHidden: {
    flex: 1,
    overflow: 'hidden',
  },
  interestColumnWrapper: {
    justifyContent: 'space-between',
    marginBottom: 10,
  },
  categorySubtext: {
    fontWeight: '400',
    color: COLORS.gray,
  },
})

// ─── Mobile Responsive Styles ─────────────────────────────────────────────────
export const responsiveStyles = StyleSheet.create({
  // Mobile container adjustments
  containerMobile: {
    flex: 1,
    paddingHorizontal: isSmallPhone ? 12 : 24,
    paddingTop: isSmallPhone ? 24 : 40,
  },
  
  // Mobile spacing
  sectionMobile: {
    marginBottom: isSmallPhone ? 16 : 28,
  },
  
  // Mobile typography
  titleMobile: {
    fontSize: scale(26),
    marginBottom: isSmallPhone ? 4 : 8,
  },
  titleLargeMobile: {
    fontSize: scale(22),
    marginBottom: isSmallPhone ? 6 : 10,
  },
  titleMediumMobile: {
    fontSize: scale(20),
    marginBottom: isSmallPhone ? 8 : 16,
  },
  subtitleMobile: {
    fontSize: scale(15),
    marginBottom: isSmallPhone ? 12 : 24,
    lineHeight: isSmallPhone ? 18 : 20,
  },
  labelMobile: {
    fontSize: scale(13),
    marginBottom: isSmallPhone ? 3 : 6,
  },
  labelSmallMobile: {
    fontSize: scale(12),
    marginBottom: isSmallPhone ? 2 : 3,
  },
  bodyTextMobile: {
    fontSize: scale(15),
  },
  
  // Mobile inputs
  inputMobile: {
    paddingVertical: isSmallPhone ? 10 : 12,
    paddingHorizontal: isSmallPhone ? 10 : 14,
    fontSize: scale(15),
    borderRadius: isSmallPhone ? 8 : 10,
  },
  textareaMobile: {
    minHeight: isSmallPhone ? 100 : 120,
  },
  
  // Mobile buttons
  primaryButtonMobile: {
    paddingVertical: isSmallPhone ? 12 : 14,
    borderRadius: isSmallPhone ? 8 : 10,
  },
  primaryButtonTextMobile: {
    fontSize: scale(16),
  },
  secondaryButtonMobile: {
    paddingVertical: isSmallPhone ? 10 : 12,
    borderRadius: isSmallPhone ? 8 : 10,
  },
  secondaryButtonTextMobile: {
    fontSize: scale(15),
  },
  
  // Mobile chips
  chipMobile: {
    paddingHorizontal: isSmallPhone ? 10 : 14,
    paddingVertical: isSmallPhone ? 6 : 8,
    borderRadius: 20,
  },
  interestChipMobile: {
    paddingVertical: isSmallPhone ? 8 : 10,
    paddingHorizontal: isSmallPhone ? 10 : 15,
  },
  categoryChipMobile: {
    paddingHorizontal: isSmallPhone ? 8 : 12,
    paddingVertical: isSmallPhone ? 4 : 6,
  },
  
  // Mobile cards
  cardMobile: {
    borderRadius: isSmallPhone ? 10 : 14,
    padding: isSmallPhone ? 12 : 18,
  },
  itemCardMobile: {
    borderRadius: isSmallPhone ? 8 : 10,
    padding: isSmallPhone ? 10 : 14,
    marginBottom: isSmallPhone ? 8 : 10,
  },
  itemFormMobile: {
    borderRadius: isSmallPhone ? 10 : 12,
    padding: isSmallPhone ? 12 : 16,
  },
  
  // Mobile progress bar
  progressBackgroundMobile: {
    height: isSmallPhone ? 4 : 6,
    marginTop: isSmallPhone ? 10 : 16,
  },
  
  // Mobile containers
  paddingContainerMobile: {
    padding: isSmallPhone ? 12 : 20,
  },
  scrollContainerMobile: {
    padding: isSmallPhone ? 12 : 20,
  },
  reviewContainerMobile: {
    padding: isSmallPhone ? 12 : 20,
    gap: isSmallPhone ? 8 : 12,
  },
  endContainerMobile: {
    padding: isSmallPhone ? 12 : 20,
  },
  
  // Mobile address/community styles
  suggestionsContainerMobile: {
    borderRadius: isSmallPhone ? 6 : 8,
  },
  communityOptionMobile: {
    padding: isSmallPhone ? 10 : 12,
    borderRadius: isSmallPhone ? 6 : 8,
  },
  communityHeaderMobile: {
    padding: isSmallPhone ? 10 : 14,
  },
  communityContentMobile: {
    padding: isSmallPhone ? 10 : 14,
  },
})

// ─── Tablet Specific Styles ───────────────────────────────────────────────────
export const tabletStyles = StyleSheet.create({
  // Tablet container
  containerTablet: {
    flex: 1,
    paddingHorizontal: 32,
    paddingTop: 48,
  },
  
  // Tablet spacing
  sectionTablet: {
    marginBottom: 32,
  },
  
  // Tablet typography
  titleTablet: {
    fontSize: 28,
    marginBottom: 10,
  },
  titleLargeTablet: {
    fontSize: 24,
    marginBottom: 12,
  },
  titleMediumTablet: {
    fontSize: 22,
    marginBottom: 18,
  },
  subtitleTablet: {
    fontSize: 16,
    marginBottom: 28,
    lineHeight: 22,
  },
  
  // Tablet inputs & buttons
  inputTablet: {
    paddingVertical: 14,
    paddingHorizontal: 16,
    fontSize: 16,
  },
  primaryButtonTablet: {
    paddingVertical: 16,
  },
  primaryButtonTextTablet: {
    fontSize: 17,
  },
  
  // Tablet cards
  cardTablet: {
    borderRadius: 16,
    padding: 20,
  },
  itemCardTablet: {
    borderRadius: 12,
    padding: 16,
  },
})

// ─── Small Phone Styles (< 375px) ────────────────────────────────────────────
export const smallPhoneStyles = StyleSheet.create({
  container: {
    paddingHorizontal: 12,
    paddingTop: 24,
  },
  section: {
    marginBottom: 16,
  },
  title: {
    fontSize: 22,
    marginBottom: 4,
  },
  titleMedium: {
    fontSize: 18,
    marginBottom: 8,
  },
  subtitle: {
    fontSize: 13,
    marginBottom: 12,
    lineHeight: 18,
  },
  label: {
    fontSize: 11,
    marginBottom: 3,
  },
  input: {
    paddingVertical: 10,
    paddingHorizontal: 10,
    fontSize: 13,
    borderRadius: 8,
  },
  button: {
    paddingVertical: 12,
    borderRadius: 8,
  },
  card: {
    borderRadius: 10,
    padding: 12,
  },
  chip: {
    paddingHorizontal: 10,
    paddingVertical: 6,
  },
  paddingContainer: {
    padding: 12,
  },
  scrollContainer: {
    padding: 12,
  },
})
