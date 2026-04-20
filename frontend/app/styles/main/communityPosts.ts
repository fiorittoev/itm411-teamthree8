import { StyleSheet } from "react-native"

export const communityPostsStyles = StyleSheet.create({
  communityHeader: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 8,
    marginBottom: 12,
  },
  communityHeaderTitle: {
    flex: 1,
    fontSize: 20,
    fontWeight: '700',
    color: '#222',
  },
  communityLakeInfo: {
    fontSize: 12,
    color: '#666',
  },
  communityFeedHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    paddingHorizontal: 14,
    paddingVertical: 10,
  },
  communityFeedLabel: {
    fontSize: 12,
    color: '#666',
    fontWeight: '600',
  },
  communityFilterOption: {
    paddingHorizontal: 8,
    paddingVertical: 4,
  },
  communityFeedContent: {
    paddingHorizontal: 14,
    paddingVertical: 10,
  },
  communityPostHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
  },
  communityPostModalHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
  },
  communityPostCloseText: {
    fontSize: 16,
    color: '#4F728C',
    fontWeight: '600',
  },
  communityPostTitleText: {
    fontSize: 16,
    fontWeight: '700',
    color: '#222',
  },
  communityPostSubmitText: {
    fontSize: 16,
    fontWeight: '600',
  },
  communityPostSubmitDisabled: {
    color: '#ccc',
  },
  communityPostSubmitEnabled: {
    color: '#4F728C',
  },
  communityPostBox: {
    borderRadius: 8,
    borderWidth: 1,
  },
  communityPostBoxDefault: {
    borderColor: '#ddd',
    backgroundColor: 'white',
  },
})
