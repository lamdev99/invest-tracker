import { GoldPrice, GoldType } from '../types';

const SJC_URL = 'https://sjc.com.vn/bieu-do-gia-vang';
const XAU_URL = 'https://www.tradingview-widget.com/embed-widget/single-quote/?locale=vi_VN#%7B%22symbol%22%3A%22PEPPERSTONE%3AXAUUSD%22%2C%22width%22%3A300%2C%22height%22%3A126%2C%22isTransparent%22%3Atrue%2C%22colorTheme%22%3A%22light%22%2C%22utm_source%22%3A%22sjc.com.vn%22%2C%22utm_medium%22%3A%22widget%22%2C%22utm_campaign%22%3A%22single-quote%22%2C%22page-uri%22%3A%22sjc.com.vn%2Fbieu-do-gia-vang%22%7D';

export const fetchGoldPrices = async (): Promise<GoldPrice[]> => {
  try {
    const prices: GoldPrice[] = [];

    // 1. Fetch SJC Price from HTML
    const sjcResponse = await fetch(SJC_URL);
    const sjcHtml = await sjcResponse.text();
    
    // Regex to find SJC Buy/Sell in the table
    // tr[1]/td[3] is Buy, td[4] is Sell. tr[1] usually has 1L SJC.
    const sjcMatches = sjcHtml.match(/\d{2,3},\d{3}/g) || [];
    if (sjcMatches.length >= 2) {
      const buyMatch = sjcMatches[0]!;
      const sellMatch = sjcMatches[1]!;
      const buyPrice = buyMatch.replace(/,/g, '') + '000';
      const sellPrice = sellMatch.replace(/,/g, '') + '000';
      
      prices.push({
        type: 'SJC',
        buy: buyPrice,
        sell: sellPrice,
        updatedAt: new Date().toISOString(),
      });
    }




    // 2. Fetch XAU/USD from TradingView widget
    const xauResponse = await fetch(XAU_URL);
    const xauHtml = await xauResponse.text();
    
    // Extract price from the widget HTML/JS
    // Look for "last":XXXX.XX
    const xauMatch = xauHtml.match(/"last":([\d.]+)/);
    const xauPriceValue = xauMatch ? xauMatch[1] : null;

    if (xauPriceValue) {
        // We'll treat XAU as a separate type or just use it for reference
        // For this app, we might need a 999.9 price too. 
        // 999.9 is often very close to XAU/USD converted to VND.
        // But for now, we'll just put it as a mock for '9999' or a new type.
        // Let's assume the user wants 9999 to be derived or they have a source.
        // Actually, let's just add XAU/USD for now if the type exists.
        
        // Let's find 9999 in the SJC table too (usually Row 2 or later)
        if (sjcMatches.length >= 4) {
             const buy9999 = sjcMatches[2].replace(/,/g, '') + '000';
             const sell9999 = sjcMatches[3].replace(/,/g, '') + '000';
             prices.push({
                type: '9999',
                buy: buy9999,
                sell: sell9999,
                updatedAt: new Date().toISOString(),
             });
        }
    }

    return prices;
  } catch (error) {
    console.error('Error fetching gold prices:', error);
    throw error;
  }
};
