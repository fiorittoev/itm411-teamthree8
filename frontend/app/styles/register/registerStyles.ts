import { StyleSheet, Dimensions } from "react-native"

import { COLORS, SPACING, TYPOGRAPHY, isSmallPhone, isPhone, isTablet, scale, scaleHeight } from "../theme"
export { COLORS, SPACING, TYPOGRAPHY, isSmallPhone, isPhone, isTablet, scale, scaleHeight }

export const registerStyles = StyleSheet.create({
  // ===== Layout =====
  container: {
    flex: 1,
    backgroundColor: COLORS.background,
    paddingHorizontal: SPACING.xl,
    paddingTop: 60,
    width: '100%',
    maxWidth: 600,
    alignSelf: 'center',
  },
  stepContainer: {
    paddingBottom: SPACING.xl,
    paddingHorizontal: isPhone ? SPACING.md : SPACING.xl,
    marginHorizontal: isPhone ? SPACING.md : SPACING.lg,
  },
  section: {
    marginBottom: SPACING.xxl,
  },
  card: {
    backgroundColor: COLORS.surface,
    borderRadius: 20,
    padding: SPACING.xl,
    borderWidth: 1,
    borderColor: COLORS.border,
    shadowColor: "#000",
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.05,
    shadowRadius: 12,
    elevation: 3,
    marginHorizontal: isPhone ? SPACING.sm : SPACING.md,
  },
  paddingContainer: {
    padding: SPACING.xl,
    marginHorizontal: isPhone ? SPACING.md : SPACING.lg,
  },
  scrollContainer: {
    padding: SPACING.xl,
    paddingHorizontal: isPhone ? SPACING.md : SPACING.xl,
    marginHorizontal: isPhone ? SPACING.md : SPACING.lg,
  },

  // ===== Typography =====
  title: {
    ...TYPOGRAPHY.display,
    color: COLORS.primary,
    marginBottom: SPACING.sm,
    letterSpacing: -0.5,
  },
  titleLarge: {
    ...TYPOGRAPHY.h1,
    color: COLORS.primary,
    marginBottom: SPACING.md,
  },
  titleMedium: {
    ...TYPOGRAPHY.h2,
    color: COLORS.text,
    marginBottom: SPACING.lg,
  },
  subtitle: {
    ...TYPOGRAPHY.body,
    color: COLORS.textMuted,
    marginBottom: SPACING.xxl,
    lineHeight: 24,
  },
  subtitleMedium: {
    marginBottom: SPACING.xl,
  },
  label: {
    fontSize: 13,
    color: COLORS.textMuted,
    marginBottom: SPACING.xs,
  },
  labelSmall: {
    fontSize: 12,
    color: COLORS.textMuted,
    marginBottom: SPACING.xs,
  },
  labelMedium: {
    fontSize: 12,
    color: COLORS.textMuted,
    marginBottom: SPACING.xs,
    marginTop: SPACING.xs,
  },
  bodyText: {
    fontSize: 15,
    color: COLORS.text,
  },
  helperText: {
    fontSize: 12,
    marginTop: SPACING.sm,
  },
  errorText: {
    fontSize: 12,
    color: COLORS.error,
    marginTop: SPACING.xs,
  },
  errorTextSmall: {
    color: COLORS.error,
    marginTop: SPACING.xs,
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
    borderRadius: 12,
    paddingVertical: 14,
    paddingHorizontal: 16,
    fontSize: 16,
    backgroundColor: COLORS.surface,
    color: COLORS.text,
    marginBottom: 16,
  },
  inputFocused: {
    borderColor: COLORS.primary,
    backgroundColor: COLORS.surface,
  },
  inputError: {
    borderColor: COLORS.error,
  },
  inputSuccess: {
    borderColor: COLORS.success,
  },
  inputWithMargin: {
    marginBottom: 20,
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
    paddingVertical: 16,
    borderRadius: 14,
    alignItems: "center",
    justifyContent: "center",
    shadowColor: COLORS.primary,
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.2,
    shadowRadius: 8,
    elevation: 4,
  },
  primaryButtonText: {
    color: COLORS.white,
    fontSize: 18,
    fontWeight: "700",
    letterSpacing: 0.5,
  },
  secondaryButton: {
    borderWidth: 2,
    borderColor: COLORS.primary,
    paddingVertical: 14,
    borderRadius: 14,
    alignItems: "center",
  },
  secondaryButtonText: {
    color: COLORS.primary,
    fontSize: 16,
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
    color: COLORS.primary,
    fontSize: 15,
    fontWeight: "600",
    marginTop: 12,
    textAlign: 'center',
  },

  // ===== Selection Cards (Account Type, etc.) =====
  selectionCard: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 16,
    borderWidth: 2,
    borderRadius: 16,
    padding: 20,
    marginBottom: 16,
    backgroundColor: COLORS.surface,
    // Shadows
    shadowColor: "#000",
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.05,
    shadowRadius: 8,
    elevation: 2,
  },
  selectionCardSelected: {
    borderColor: COLORS.primary,
    backgroundColor: COLORS.lightBlue,
  },
  selectionCardUnselected: {
    borderColor: COLORS.border,
    backgroundColor: COLORS.surface,
  },
  selectionCardTitle: {
    fontSize: 18,
    fontWeight: '700',
    color: COLORS.text,
    marginBottom: 4,
  },
  selectionCardTitleSelected: {
    color: COLORS.primary,
  },
  selectionCardSubtitle: {
    fontSize: 14,
    color: COLORS.textMuted,
    lineHeight: 20,
  },
  selectionIconContainer: {
    width: 48,
    height: 48,
    borderRadius: 24,
    backgroundColor: COLORS.lightGray,
    justifyContent: 'center',
    alignItems: 'center',
  },
  selectionIconContainerSelected: {
    backgroundColor: COLORS.primary,
  },

  // ===== Chips (Interests / Categories) =====
  chip: {
    paddingHorizontal: 16,
    paddingVertical: 10,
    borderRadius: 20,
    borderWidth: 1.5,
    borderColor: COLORS.border,
    backgroundColor: COLORS.surface,
  },
  chipSelected: {
    backgroundColor: COLORS.primary,
    borderColor: COLORS.primary,
  },
  chipText: {
    fontSize: 14,
    fontWeight: "500",
    color: COLORS.text,
  },
  chipTextSelected: {
    color: COLORS.white,
    fontWeight: "600",
  },
  interestChip: {
    paddingVertical: 12,
    paddingHorizontal: 18,
    borderRadius: 24,
    marginBottom: 8,
    borderWidth: 1.5,
    borderColor: COLORS.border,
  },
  interestChipSelected: {
    backgroundColor: COLORS.secondary,
    borderColor: COLORS.secondary,
  },
  interestChipUnselected: {
    backgroundColor: COLORS.surface,
  },
  interestChipText: {
    color: COLORS.text,
    fontWeight: "500",
  },
  interestChipTextSelected: {
    color: COLORS.white,
    fontWeight: "700",
  },
  categoryChip: {
    paddingHorizontal: 14,
    paddingVertical: 8,
    borderRadius: 20,
    borderWidth: 1.5,
  },
  categoryChipSelected: {
    borderColor: COLORS.primary,
    backgroundColor: COLORS.lightBlue,
  },
  categoryChipUnselected: {
    borderColor: COLORS.border,
    backgroundColor: COLORS.surface,
  },
  categoryChipText: {
    fontSize: 14,
    fontWeight: "500",
    color: COLORS.textMuted,
  },
  categoryChipTextSelected: {
    fontWeight: "700",
    color: COLORS.primary,
  },
  reviewChip: {
    backgroundColor: COLORS.lightBlue,
    borderRadius: 12,
    paddingHorizontal: 12,
    paddingVertical: 6,
  },
  reviewChipText: {
    color: COLORS.primary,
    fontWeight: "600",
  },

  // ===== Progress Bar =====
  progressBackground: {
    height: 10,
    backgroundColor: COLORS.border,
    borderRadius: 5,
    overflow: "hidden",
    marginTop: 32,
  },
  progressFillDynamic: {
    height: "100%",
    backgroundColor: COLORS.secondary, // Or use a nice gradient if possible
    borderRadius: 5,
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
