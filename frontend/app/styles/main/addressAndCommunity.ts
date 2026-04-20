import { StyleSheet } from "react-native"

export const addressAndCommunityStyles = StyleSheet.create({
  addressInputContainer: {
    position: 'relative',
    zIndex: 10,
  },
  addressInputBase: {
    marginBottom: 0,
  },
  addressSuggestions: {
    position: 'absolute',
    top: '100%',
    left: 0,
    right: 0,
    backgroundColor: 'white',
    borderRadius: 8,
    zIndex: 20,
    shadowColor: '#000',
    shadowOpacity: 0.12,
    shadowRadius: 6,
    elevation: 6,
  },
  addressSuggestionItem: {
    padding: 12,
  },
  addressSuggestionText: {
    fontSize: 14,
    color: '#333',
  },
  addressAptField: {
    marginTop: 10,
  },
  addressConfirmed: {
    padding: 12,
    borderRadius: 8,
    marginVertical: 8,
    backgroundColor: '#f0f7ff',
    borderWidth: 1,
    borderColor: '#4F728C',
  },
  addressConfirmedLabel: {
    fontSize: 13,
    color: '#4F728C',
    fontWeight: '600',
    marginBottom: 4,
  },
  addressConfirmedText: {
    fontSize: 13,
    color: '#333',
  },
  addressChangeLink: {
    color: '#4F728C',
    fontSize: 13,
    marginTop: 6,
  },
  communitySelectorContainer: {
    marginTop: 12,
  },
  communityLoadingContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 8,
    padding: 8,
  },
  communityLoadingText: {
    color: '#666',
    fontSize: 13,
  },
  communityNotFound: {
    padding: 12,
    backgroundColor: '#fff8e1',
    borderRadius: 8,
  },
  communityNotFoundText: {
    color: '#b8860b',
    fontWeight: '600',
  },
  communityNotFoundSubtext: {
    color: '#b8860b',
    fontSize: 12,
    marginTop: 4,
  },
  communityOption: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    padding: 12,
    borderRadius: 8,
    marginBottom: 6,
    borderWidth: 1.5,
  },
  communityOptionSelected: {
    borderColor: '#4F728C',
    backgroundColor: '#eaf2f8',
  },
  communityOptionUnselected: {
    borderColor: '#ddd',
    backgroundColor: '#fafafa',
  },
  communityOptionLabel: {
    fontWeight: '600',
  },
  communityOptionLabelSelected: {
    color: '#4F728C',
  },
  communityOptionLabelUnselected: {
    color: '#333',
  },
  communityOptionSubtext: {
    fontSize: 12,
    marginTop: 2,
  },
  communityOptionSubtextExisting: {
    color: '#888',
  },
  communityOptionSubtextNew: {
    color: '#e67e22',
  },
  communityOptionCheck: {
    color: '#4F728C',
    fontWeight: '700',
  },
})
