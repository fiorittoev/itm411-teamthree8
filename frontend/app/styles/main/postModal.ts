import { StyleSheet } from "react-native"

export const postModalStyles = StyleSheet.create({
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
})
