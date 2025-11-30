
import { DecibelMarket, DecibelOrderBook, DecibelTrade } from '../types';

// Primary API (Decibel)
const DECIBEL_API_URL = 'https://api.netna.aptoslabs.com/decibel';

// Fallback API (CoinCap)
const COINCAP_API = 'https://api.coincap.io/v2';

// Helper to map symbol to CoinCap ID for individual price fetches
const SYMBOL_TO_ID: Record<string, string> = {
    'BTC': 'bitcoin',
    'ETH': 'ethereum',
    'SOL': 'solana',
    'APT': 'aptos',
    'BNB': 'binance-coin',
    'XRP': 'xrp',
    'ADA': 'cardano',
    'DOGE': 'dogecoin',
    'MATIC': 'polygon',
    'LTC': 'litecoin',
    'DOT': 'polkadot',
    'TRX': 'tron',
    'AVAX': 'avalanche',
    'SHIB': 'shiba-inu',
    'LEO': 'leo-token',
    'ATOM': 'cosmos',
    'LINK': 'chainlink'
};

// Static Mock Data for Absolute Fallback
const MOCK_MARKETS: DecibelMarket[] = [
    { market_id: 'BTC-USD-PERP', base_asset: 'BTC', quote_asset: 'USD', price: 64230.50, volume_24h: 24500000000, change_24h: 2.45, high_24h: 65000, low_24h: 63000 },
    { market_id: 'ETH-USD-PERP', base_asset: 'ETH', quote_asset: 'USD', price: 3450.20, volume_24h: 12000000000, change_24h: 1.8, high_24h: 3500, low_24h: 3400 },
    { market_id: 'SOL-USD-PERP', base_asset: 'SOL', quote_asset: 'USD', price: 145.80, volume_24h: 3000000000, change_24h: 5.2, high_24h: 150, low_24h: 138 },
    { market_id: 'APT-USD-PERP', base_asset: 'APT', quote_asset: 'USD', price: 12.40, volume_24h: 500000000, change_24h: -1.2, high_24h: 13, low_24h: 12 },
    { market_id: 'DOGE-USD-PERP', base_asset: 'DOGE', quote_asset: 'USD', price: 0.16, volume_24h: 800000000, change_24h: 8.5, high_24h: 0.17, low_24h: 0.15 },
];

const getRealPriceFromCoinCap = async (symbol: string): Promise<number> => {
    const id = SYMBOL_TO_ID[symbol.toUpperCase()];
    const assetId = id || symbol.toLowerCase();
    
    try {
        const res = await fetch(`${COINCAP_API}/assets/${assetId}`);
        if(res.ok) {
            const data = await res.json();
            return parseFloat(data.data.priceUsd);
        }
    } catch(e) {
        // Silent fail
    }
    return 0;
}

// --- CoinCap Fallback Implementation ---
const CoinCapService = {
    async getMarkets(): Promise<DecibelMarket[]> {
        const response = await fetch(`${COINCAP_API}/assets?limit=15`);
        if (!response.ok) throw new Error('CoinCap API Error');
        const json = await response.json();
        
        return json.data.map((asset: any) => ({
            market_id: `${asset.symbol}-USD-PERP`,
            base_asset: asset.symbol,
            quote_asset: 'USD',
            price: parseFloat(asset.priceUsd),
            volume_24h: parseFloat(asset.volumeUsd24Hr),
            change_24h: parseFloat(asset.changePercent24Hr),
            high_24h: parseFloat(asset.priceUsd) * 1.02, 
            low_24h: parseFloat(asset.priceUsd) * 0.98
        }));
    },
    async getOrderBook(marketId: string): Promise<DecibelOrderBook> {
        const symbol = marketId.split('-')[0];
        let price = await getRealPriceFromCoinCap(symbol);
        if (price === 0) {
            // Check mock data for price if API fails
            const mock = MOCK_MARKETS.find(m => m.base_asset === symbol);
            price = mock ? mock.price : 1000;
        }
        const spread = price * 0.0005;
        return {
            market_id: marketId,
            timestamp: Date.now(),
            bids: Array.from({ length: 15 }).map((_, i) => [
                price - (spread * (i + 1)) - (Math.random() * spread), 
                Math.random() * (10000 / price)
            ]),
            asks: Array.from({ length: 15 }).map((_, i) => [
                price + (spread * (i + 1)) + (Math.random() * spread), 
                Math.random() * (10000 / price)
            ]),
        };
    },
    async getRecentTrades(marketId: string): Promise<DecibelTrade[]> {
        const symbol = marketId.split('-')[0];
        let price = await getRealPriceFromCoinCap(symbol);
        if (price === 0) {
             const mock = MOCK_MARKETS.find(m => m.base_asset === symbol);
             price = mock ? mock.price : 1000;
        }
        return Array.from({ length: 25 }).map((_, i) => ({
            id: `trade-${Date.now()}-${i}`,
            market_id: marketId,
            price: price * (1 + (Math.random() - 0.5) * 0.002),
            size: Math.random() * (5000 / price),
            side: Math.random() > 0.5 ? 'buy' : 'sell',
            timestamp: new Date(Date.now() - i * 15000).toISOString(),
        }));
    }
};

export const DecibelService = {
    async getMarkets(): Promise<DecibelMarket[]> {
        // Try Primary API
        try {
            const response = await fetch(`${DECIBEL_API_URL}/markets`);
            if (response.ok) {
                const data = await response.json();
                if (Array.isArray(data) && data.length > 0) return data;
            }
        } catch (e) {
            console.warn("Decibel API unreachable, switching to CoinCap...");
        }

        // Fallback to CoinCap
        try {
            return await CoinCapService.getMarkets();
        } catch (e) {
            console.warn("CoinCap API failed, using static mock data.");
            return MOCK_MARKETS;
        }
    },

    async getOrderBook(marketId: string): Promise<DecibelOrderBook | null> {
        try {
            const response = await fetch(`${DECIBEL_API_URL}/orderbook?market_id=${marketId}`);
            if (response.ok) {
                return await response.json();
            }
        } catch (e) {
            // Ignore and fallback
        }
        return await CoinCapService.getOrderBook(marketId);
    },

    async getRecentTrades(marketId: string): Promise<DecibelTrade[]> {
        try {
            const response = await fetch(`${DECIBEL_API_URL}/trades?market_id=${marketId}`);
            if (response.ok) {
                return await response.json();
            }
        } catch (e) {
            // Ignore and fallback
        }
        return await CoinCapService.getRecentTrades(marketId);
    }
};
