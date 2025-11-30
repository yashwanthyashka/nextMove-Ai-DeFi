
import type { ReactNode, FC } from 'react';

export interface Token {
  symbol: string;
  name: string;
  balance: string; // Changed to string for precision with large numbers from blockchain
  usdValue: number;
  logo: string;
  priceChangePercentage24h: number;
  contractAddress?: string; // Optional: for ERC20 tokens
  price?: number;
  sparkline_7d?: number[];
}

export interface Wallet {
  name: string;
  address: string;
  tokens: Token[];
  chain: 'Ethereum' | 'Solana' | 'BSC' | 'Bitcoin';
}

export enum MessageSender {
  USER = 'user',
  AI = 'ai',
  SYSTEM = 'system'
}

export interface ChatMessage {
  id: string;
  sender: MessageSender;
  text: string;
  isLoading?: boolean;
  relatedLinks?: Array<{ title: string; url: string; }>;
}

export interface NewsArticle {
  title: string;
  uri: string;
  source: string;
  imageUrl?: string;
}

export interface JobListing {
  title: string;
  company: string;
  location: string;
  url: string;
}

export interface Web3Event {
  name: string;
  date: string;
  location: string;
  url: string;
}

export interface TrendingCrypto {
  name: string;
  symbol: string;
}

export interface TrendingStock {
  name: string;
  symbol: string;
}

export interface Stock {
  symbol: string; // e.g., "NASDAQ:AAPL"
  name: string;
  shares: number;
  price: number; // current price per share
  logo: string;
}

export interface StockPortfolio {
  name: string;
  accountId: string;
  holdings: Stock[];
}

export interface Transaction {
  id: string;
  type: 'Buy' | 'Sell' | 'Send' | 'Receive';
  tokenSymbol: string;
  tokenName: string;
  tokenLogo: string;
  tokenAmount: number;
  usdAmount: number;
  date: string; // ISO String
  status: 'Completed' | 'Pending' | 'Failed';
}

export interface QuizQuestion {
  question: string;
  options: string[];
  correctAnswer: string;
}

export interface CourseContent {
  title: string;
  explanation: string;
  example: string;
  quiz: QuizQuestion;
}

export interface PriceAlert {
  id: string;
  tokenSymbol: string;
  tokenName: string;
  tokenLogo: string;
  condition: 'ABOVE' | 'BELOW';
  targetPrice: number;
  createdAt: string; // ISO String
}

export interface ToastMessage {
  id: string;
  message: string;
  title: string;
}

export interface StoredWallet {
  name: string;
  json: string;
}

export interface Network {
  id: string;
  name: string;
  type: 'Mainnet' | 'Testnet' | 'Layer 2';
  longName: string;
  icon: FC<{ className?: string; }>;
  chainId: number;
  rpcUrl: string;
  currencySymbol: string;
  currencyName: string;
  currencyLogo: string;
  explorerUrl?: string;
  tags?: Array<{ text: string, color: string }>;
  gasDisplay?: string;
}

// --- NEW TYPES for DeFi Hub ---

export interface StakingOpportunity {
  type: 'Staking';
  protocol: string;
  tokenSymbol: string;
  apy: number;
  tvl: number; // in USD
  logo: string;
  description: string;
  url: string;
  tags: string[];
}

export interface LendingOpportunity {
    type: 'Lending';
    protocol: string;
    tokenSymbol: string;
    apy: number;
    tvl: number;
    logo: string;
    description: string;
    url: string;
    tags: string[];
}

export type DeFiOpportunity = StakingOpportunity | LendingOpportunity;

// --- Backup Types ---
export type BackupMethod = 'manual' | 'cloud';

// --- Decibel API Types ---
export interface DecibelMarket {
  market_id: string; // e.g. "BTC-USD-PERP"
  base_asset: string;
  quote_asset: string;
  price: number;
  volume_24h: number;
  change_24h: number; // Percentage
  high_24h: number;
  low_24h: number;
}

export interface DecibelOrderBook {
  market_id: string;
  bids: [number, number][]; // [price, size]
  asks: [number, number][];
  timestamp: number;
}

export interface DecibelTrade {
  id: string;
  market_id: string;
  price: number;
  size: number;
  side: 'buy' | 'sell';
  timestamp: string;
}

// --- Launchpad Types ---

export interface LaunchToken {
    id: string; // Module ID (e.g. 0xCreator::Module::Coin)
    name: string;
    symbol: string;
    description: string;
    imageUrl: string;
    creatorAddress: string;
    createdAt: number;
    category: 'Meme' | 'Utility';
    isDoxxed: boolean;
    marketCap: number; // In APT
    price: number; // In APT
    bondingCurveProgress: number; // 0 to 100%
    volume24h: number;
    holderCount: number;
    replies: number;
    
    // Extended Metadata for Bots & Supply Management
    tokenObjectAddress: string; // The Object Address (Metadata) bots watch
    lpAddress: string; // The Liquidity Pool Object Address
    
    initialSupply: number;
    decimals: number;
    taxes: {
        buy: number; // %
        sell: number; // %
    };
    socials: {
        website?: string;
        telegram?: string;
        twitter?: string;
        discord?: string;
    };
    distribution?: {
        liquidity: number; // %
        creator: number; // %
        community: number; // %
    };
}

export interface BondingCurveState {
    reserveApt: number;
    reserveToken: number;
    virtualApt: number;
    virtualToken: number;
}
