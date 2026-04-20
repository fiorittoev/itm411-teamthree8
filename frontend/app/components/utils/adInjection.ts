import { AdOut } from '../../services/api';

/**
 * Injects ads into a list of items every 5 items.
 */
export function injectAds(items: any[], ads: AdOut[]): any[] {
  if (!ads.length) return items;
  
  const result: any[] = [];
  let adIndex = 0;
  
  items.forEach((item, index) => {
    result.push(item);
    // Inject an ad every 5 items, cyclical through ads
    if ((index + 1) % 5 === 0 && ads.length > 0) {
      result.push({ ...ads[adIndex % ads.length], _isAd: true });
      adIndex++;
    }
  });
  
  return result;
}
