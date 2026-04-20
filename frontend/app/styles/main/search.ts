import { StyleSheet } from "react-native"

export const searchStyles = StyleSheet.create({
  searchPanel: {
    flex: 1,
    margin: 12,
    backgroundColor: 'white',
    borderRadius: 8,
    overflow: 'hidden',
    flexDirection: 'column',
  },
  searchHeader: {
    padding: 14,
    borderBottomWidth: 1,
    borderBottomColor: '#eee',
    gap: 12,
  },
  searchInputContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    borderWidth: 1,
    borderColor: '#ccc',
    borderRadius: 8,
    paddingHorizontal: 10,
    backgroundColor: '#f9f9f9',
  },
  searchInput: {
    flex: 1,
    paddingVertical: 10,
    paddingHorizontal: 8,
    fontSize: 15,
    color: '#222',
  },
  searchClearBtn: {
    padding: 4,
  },
  filterSection: {
    gap: 10,
  },
  filterLabel: {
    fontSize: 12,
    fontWeight: '600',
    color: '#555',
  },
  filterOptions: {
    flexDirection: 'row',
    gap: 8,
    flexWrap: 'wrap',
  },
  filterOption: {
    paddingHorizontal: 12,
    paddingVertical: 6,
    borderRadius: 20,
    borderWidth: 1,
    borderColor: '#ccc',
    backgroundColor: '#fafafa',
  },
  filterOptionActive: {
    backgroundColor: '#4F728C',
    borderColor: '#4F728C',
  },
  filterOptionText: {
    fontSize: 12,
    color: '#333',
    fontWeight: '500',
  },
  filterOptionTextActive: {
    color: 'white',
  },
  searchContent: {
    flex: 1,
    paddingHorizontal: 14,
    paddingVertical: 12,
  },
  categorySection: {
    marginBottom: 20,
  },
  categoryTitle: {
    fontSize: 14,
    fontWeight: '700',
    color: '#222',
    marginBottom: 10,
    paddingLeft: 2,
  },
  
  // Item Results
  itemResult: {
    flexDirection: 'row',
    backgroundColor: '#fafafa',
    borderRadius: 8,
    marginBottom: 10,
    overflow: 'hidden',
    borderWidth: 1,
    borderColor: '#e0e0e0',
  },
  itemResultImage: {
    width: 80,
    height: 80,
    backgroundColor: '#e0e0e0',
  },
  itemResultContent: {
    flex: 1,
    padding: 10,
    justifyContent: 'space-between',
  },
  itemResultTop: {
    gap: 4,
  },
  itemResultName: {
    fontSize: 13,
    fontWeight: '600',
    color: '#222',
  },
  itemResultDesc: {
    fontSize: 11,
    color: '#666',
    lineHeight: 14,
  },
  itemResultFooter: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
  },
  itemResultPrice: {
    fontSize: 12,
    fontWeight: '700',
    color: '#187bcd',
  },
  itemResultSeller: {
    fontSize: 10,
    color: '#999',
  },

  // User Results
  userResult: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: '#f5f7fa',
    borderRadius: 8,
    padding: 12,
    marginBottom: 10,
    borderWidth: 1,
    borderColor: '#dce8f1',
    gap: 12,
  },
  userResultAvatar: {
    width: 56,
    height: 56,
    borderRadius: 28,
    backgroundColor: '#9fb7c8',
    alignItems: 'center',
    justifyContent: 'center',
  },
  userResultContent: {
    flex: 1,
    gap: 3,
  },
  userResultName: {
    fontSize: 14,
    fontWeight: '600',
    color: '#222',
  },
  userResultBio: {
    fontSize: 12,
    color: '#666',
    lineHeight: 16,
  },
  userResultAddress: {
    fontSize: 10,
    color: '#999',
  },

  // Community Results
  communityResult: {
    backgroundColor: '#f0f7fc',
    borderRadius: 8,
    padding: 12,
    marginBottom: 10,
    borderWidth: 1,
    borderColor: '#c8dce8',
    gap: 8,
  },
  communityResultName: {
    fontSize: 14,
    fontWeight: '700',
    color: '#1c3b54',
  },
  communityResultDesc: {
    fontSize: 12,
    color: '#555',
    lineHeight: 16,
  },
  communityResultFooter: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
  },
  communityResultLake: {
    fontSize: 11,
    color: '#666',
    fontWeight: '500',
  },
  communityResultMembers: {
    fontSize: 11,
    color: '#4F728C',
    fontWeight: '600',
  },

  searchEmpty: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    paddingVertical: 40,
  },
  searchEmptyText: {
    fontSize: 14,
    color: '#888',
    textAlign: 'center',
  },

  // Search & Results helpers
  searchProfileContainer: {
    alignItems: 'center',
    gap: 8,
  },
  searchItemsRow: {
    flexDirection: 'row',
    backgroundColor: '#fafafa',
    borderRadius: 6,
    padding: 8,
    marginBottom: 6,
    gap: 8,
  },
  searchItemImage: {
    width: 50,
    height: 50,
    borderRadius: 4,
  },
  searchItemContainer: {
    flex: 1,
    justifyContent: 'space-between',
  },
  searchItemName: {
    fontSize: 13,
    fontWeight: '600',
    color: '#222',
  },
  searchItemPrice: {
    fontSize: 12,
    color: '#187bcd',
    fontWeight: '700',
  },
  userProfileLabel: {
    fontSize: 12,
    color: '#666',
    fontWeight: '600',
    marginBottom: 4,
  },
  userProfileText: {
    fontSize: 14,
    color: '#222',
  },
  userListingLabel: {
    fontSize: 12,
    color: '#666',
    fontWeight: '600',
    marginBottom: 8,
  },
  userListingEmpty: {
    fontSize: 12,
    color: '#aaa',
  },
})
