import { StyleSheet } from "react-native"

export const deleteModalStyles = StyleSheet.create({
  deleteModalOverlay: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    backgroundColor: 'rgba(0,0,0,0.5)',
  },
  deleteModalContent: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    gap: 10,
  },
  deleteModalTitle: {
    fontSize: 16,
    fontWeight: '700',
    color: '#222',
    marginBottom: 10,
  },
  deleteModalText: {
    fontSize: 14,
    color: '#666',
    marginBottom: 20,
  },
  deleteModalButtonRow: {
    flexDirection: 'row',
    justifyContent: 'flex-end',
    gap: 10,
  },
  deleteModalButtonText: {
    fontSize: 14,
    fontWeight: '600',
    color: '#333',
  },
  deleteModalButtonTextDanger: {
    fontSize: 14,
    fontWeight: '600',
    color: 'white',
  },
  deleteConfirmBox: {
    backgroundColor: 'white',
    borderRadius: 10,
    paddingHorizontal: 20,
    paddingVertical: 20,
    width: '80%',
    maxWidth: 300,
  },
  deleteConfirmButton: {
    paddingHorizontal: 16,
    paddingVertical: 8,
    borderRadius: 6,
  },
  deleteConfirmButtonCancel: {
    backgroundColor: '#f0f0f0',
  },
  deleteConfirmButtonDelete: {
    backgroundColor: '#E67E73',
  },
})
