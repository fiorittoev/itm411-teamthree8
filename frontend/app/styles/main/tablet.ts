import { StyleSheet } from "react-native"

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
