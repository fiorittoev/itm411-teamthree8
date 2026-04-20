import { StyleSheet } from "react-native"

export const adStyles = StyleSheet.create({
  adCard: {
    backgroundColor: '#e8f4f8',
    borderRadius: 12,
    padding: 16,
    marginVertical: 12,
    borderWidth: 1,
    borderColor: '#d0e2f0',
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 4,
    elevation: 2,
  },
  adCardMarketplace: {
    backgroundColor: '#f0f9ff',
    borderColor: '#bae6fd',
  },
  adCardHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 12,
    paddingBottom: 8,
    borderBottomWidth: 1,
    borderBottomColor: 'rgba(79, 114, 140, 0.1)',
  },
  adCardBadge: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 4,
    backgroundColor: 'rgba(79, 114, 140, 0.1)',
    paddingHorizontal: 8,
    paddingVertical: 4,
    borderRadius: 12,
  },
  adCardSponsored: {
    fontSize: 10,
    fontWeight: '700',
    color: '#4F728C',
    textTransform: 'uppercase',
    letterSpacing: 0.5,
  },
  adCardOwner: {
    fontSize: 12,
    fontWeight: '600',
    color: '#666',
  },
  adPostContent: {
    gap: 8,
  },
  adMarketplaceContent: {
    flexDirection: 'row',
    gap: 12,
  },
  adMarketplaceImage: {
    width: 100,
    height: 100,
    borderRadius: 8,
    backgroundColor: '#ddd',
  },
  adTextContainer: {
    flex: 1,
    justifyContent: 'center',
  },
  adCardTitle: {
    fontSize: 16,
    fontWeight: '700',
    color: '#222',
    marginBottom: 4,
  },
  adCardBody: {
    fontSize: 14,
    lineHeight: 20,
    color: '#444',
    marginBottom: 8,
  },
})
