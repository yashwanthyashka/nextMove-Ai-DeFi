

import type { Wallet, StockPortfolio, Transaction, DeFiOpportunity } from './types';

export const MOCK_STOCK_PORTFOLIO: StockPortfolio = {
  name: 'Brokerage Account',
  accountId: 'BROKER...XYZ',
  holdings: [
    { symbol: 'NASDAQ:AAPL', name: 'Apple Inc.', shares: 10, price: 190.50, logo: 'https://companieslogo.com/img/orig/AAPL.D-f3a35561.png?t=1633216834' },
    { symbol: 'NASDAQ:TSLA', name: 'Tesla, Inc.', shares: 5, price: 250.75, logo: 'https://companieslogo.com/img/orig/TSLA_BIG-85c3924f.png?t=1633216834' },
    { symbol: 'NASDAQ:NVDA', name: 'NVIDIA Corporation', shares: 2, price: 450.00, logo: 'https://companieslogo.com/img/orig/NVDA.D-826c715a.png?t=1633216834' },
  ],
};

export const MOCK_DEFI_OPPORTUNITIES: DeFiOpportunity[] = [
    { 
        type: 'Staking', 
        protocol: 'Lido', 
        tokenSymbol: 'ETH', 
        apy: 3.1, 
        tvl: 35_000_000_000, 
        logo: 'https://s2.coinmarketcap.com/static/img/coins/64x64/8000.png', 
        description: 'Lido is a liquid staking solution for Ethereum. Lido lets users stake their ETH - with no minimum deposits or maintaining of infrastructure - whilst participating in on-chain activities, e.g. lending, to compound returns.',
        url: 'https://lido.fi/',
        tags: ['Liquid Staking', 'Ethereum'] 
    },
    { 
        type: 'Lending', 
        protocol: 'Aave', 
        tokenSymbol: 'USDC', 
        apy: 8.2, 
        tvl: 11_500_000_000, 
        logo: 'https://s2.coinmarketcap.com/static/img/coins/64x64/7278.png', 
        description: 'Aave is a decentralized non-custodial liquidity protocol where users can participate as suppliers or borrowers. Suppliers provide liquidity to the market to earn a passive income, while borrowers are able to borrow in an overcollateralized (perpetually) or undercollateralized (one-block liquidity) fashion.',
        url: 'https://aave.com/',
        tags: ['Lending', 'Borrowing', 'Multi-Chain'] 
    },
    { 
        type: 'Staking', 
        protocol: 'Rocket Pool', 
        tokenSymbol: 'ETH', 
        apy: 3.0, 
        tvl: 4_200_000_000, 
        logo: 'https://s2.coinmarketcap.com/static/img/coins/64x64/17757.png', 
        description: 'Rocket Pool is a decentralized Ethereum staking pool offering liquid staking. It provides a way for individuals and businesses to stake ETH without needing to run their own validator node.',
        url: 'https://rocketpool.net/',
        tags: ['Liquid Staking', 'Ethereum'] 
    },
     { 
        type: 'Lending', 
        protocol: 'Compound', 
        tokenSymbol: 'DAI', 
        apy: 6.7, 
        tvl: 4_100_000_000, 
        logo: 'https://s2.coinmarketcap.com/static/img/coins/64x64/5692.png', 
        description: 'Compound is an algorithmic, autonomous interest rate protocol built for developers, to unlock a universe of open financial applications. Users can supply assets to earn interest or borrow assets against collateral.',
        url: 'https://compound.finance/',
        tags: ['Lending', 'Governance', 'Ethereum'] 
    },
];


// Minimal ABI for fetching ERC20 balance and decimals
export const ERC20_ABI = [
  "function balanceOf(address owner) view returns (uint256)",
  "function decimals() view returns (uint8)",
  "function approve(address spender, uint256 amount) returns (bool)",
  "function allowance(address owner, address spender) view returns (uint256)",
];

// Uniswap V2 Router on Sepolia
export const UNISWAP_V2_ROUTER_ADDRESS = '0xC532a74256D3Db42174Dcff2cDE245660A944827';
export const UNISWAP_V2_ROUTER_ABI = [
    "function getAmountsOut(uint amountIn, address[] memory path) public view returns (uint[] memory amounts)",
    "function swapExactTokensForTokens(uint amountIn, uint amountOutMin, address[] calldata path, address to, uint deadline) external returns (uint[] memory amounts)",
    "function swapExactETHForTokens(uint amountOutMin, address[] calldata path, address to, uint deadline) external payable returns (uint[] memory amounts)",
    "function swapExactTokensForETH(uint amountIn, uint amountOutMin, address[] calldata path, address to, uint deadline) external returns (uint[] memory amounts)"
];


// Common ERC20 tokens on the Sepolia testnet
export const SEPOLIA_ERC20_METADATA = [
    {
        address: '0x7b79995e5f793A07Bc00c21412e50Ea00A77fa28',
        name: 'Wrapped Ether',
        symbol: 'WETH',
        decimals: 18,
        logo: 'https://s2.coinmarketcap.com/static/img/coins/64x64/2396.png',
        mockPrice: 3500,
    },
    {
        address: '0x2E21603123847a514b434455855342426372134C',
        name: 'Wrapped BTC',
        symbol: 'WBTC',
        decimals: 8,
        logo: 'https://s2.coinmarketcap.com/static/img/coins/64x64/3717.png',
        mockPrice: 65000,
    },
    {
        address: '0x94a9D9AC8a22534E3FaCa9F4e7F2E2cf85d5E4C8',
        name: 'USD Coin',
        symbol: 'USDC',
        decimals: 6,
        logo: 'https://s2.coinmarketcap.com/static/img/coins/64x64/3408.png',
        mockPrice: 1, 
    },
    {
        address: '0x68194a729C24503B1E623436E7260759755F65A2',
        name: 'Dai Stablecoin',
        symbol: 'DAI',
        decimals: 18,
        logo: 'https://s2.coinmarketcap.com/static/img/coins/64x64/4943.png',
        mockPrice: 1,
    },
    {
        address: '0x1f9840a85d5aF5bf1D1762F925BDADdC4201F984',
        name: 'Uniswap',
        symbol: 'UNI',
        decimals: 18,
        logo: 'https://s2.coinmarketcap.com/static/img/coins/64x64/7083.png',
        mockPrice: 10.5,
    },
    {
        address: '0x779877A7B0D9E8603169DdbD7836e478b4624789',
        name: 'Chainlink',
        symbol: 'LINK',
        decimals: 18,
        logo: 'https://s2.coinmarketcap.com/static/img/coins/64x64/1975.png',
        mockPrice: 14.2,
    },
    {
        address: '0x3a61f021245318A5190A814341d655382552f20B',
        name: 'Shiba Inu',
        symbol: 'SHIB',
        decimals: 18,
        logo: 'https://s2.coinmarketcap.com/static/img/coins/64x64/5994.png',
        mockPrice: 0.000025,
    },
    {
        address: '0x34905A7c58849463404179342201275338661642',
        name: 'Polygon',
        symbol: 'MATIC',
        decimals: 18,
        logo: 'https://s2.coinmarketcap.com/static/img/coins/64x64/3890.png',
        mockPrice: 0.7,
    },
    {
        address: '0xda5E8504B615921A378376375d52bD23a234b6E3',
        name: 'Aave',
        symbol: 'AAVE',
        decimals: 18,
        logo: 'https://s2.coinmarketcap.com/static/img/coins/64x64/7278.png',
        mockPrice: 90,
    },
    {
        address: '0x95AE143A261A3925565C8342C44645258211a75b',
        name: 'Curve DAO Token',
        symbol: 'CRV',
        decimals: 18,
        logo: 'https://s2.coinmarketcap.com/static/img/coins/64x64/6538.png',
        mockPrice: 0.45,
    },
    {
        address: '0x507A21d25832a8138768A785121A15a510f22538',
        name: 'The Sandbox',
        symbol: 'SAND',
        decimals: 18,
        logo: 'https://s2.coinmarketcap.com/static/img/coins/64x64/6210.png',
        mockPrice: 0.45,
    },
    {
        address: '0xcB1688B5c56F74A72c918e38A1451f284561a3A4',
        name: 'Decentraland',
        symbol: 'MANA',
        decimals: 18,
        logo: 'https://s2.coinmarketcap.com/static/img/coins/64x64/1966.png',
        mockPrice: 0.45,
    },
    {
        address: '0x517334966144a7E6242885a69c02F6B316109242',
        name: 'ApeCoin',
        symbol: 'APE',
        decimals: 18,
        logo: 'https://s2.coinmarketcap.com/static/img/coins/64x64/18876.png',
        mockPrice: 1.3,
    },
    {
        address: '0x5B6496420B2393a525287B8144075b8830703923',
        name: 'Lido DAO',
        symbol: 'LDO',
        decimals: 18,
        logo: 'https://s2.coinmarketcap.com/static/img/coins/64x64/8000.png',
        mockPrice: 2.3,
    },
    {
        address: '0x53B44DAA5178657B1578F49e612A614E5441b8F4',
        name: 'The Graph',
        symbol: 'GRT',
        decimals: 18,
        logo: 'https://s2.coinmarketcap.com/static/img/coins/64x64/6719.png',
        mockPrice: 0.3,
    },
    {
        address: '0x29B95133b5c425332B5945195325701831412051',
        name: 'Maker',
        symbol: 'MKR',
        decimals: 18,
        logo: 'https://s2.coinmarketcap.com/static/img/coins/64x64/1518.png',
        mockPrice: 2400,
    },
    {
        address: '0x6D4285b54E4133403d1599AE1731DAb631a788e9',
        name: '1inch Network',
        symbol: '1INCH',
        decimals: 18,
        logo: 'https://s2.coinmarketcap.com/static/img/coins/64x64/8104.png',
        mockPrice: 0.4,
    },
    {
        address: '0x23a315e98341640a321a6f3b01140087265a0379',
        name: 'Compound',
        symbol: 'COMP',
        decimals: 18,
        logo: 'https://s2.coinmarketcap.com/static/img/coins/64x64/5692.png',
        mockPrice: 50,
    },
    {
        address: '0x5a2A569845A39E92A9553648B1278C3a25A6517e',
        name: 'Synthetix',
        symbol: 'SNX',
        decimals: 18,
        logo: 'https://s2.coinmarketcap.com/static/img/coins/64x64/2586.png',
        mockPrice: 2.5,
    },
    {
        address: '0x904576B4673B8801454583a21F2425272a85ea82',
        name: 'yearn.finance',
        symbol: 'YFI',
        decimals: 18,
        logo: 'https://s2.coinmarketcap.com/static/img/coins/64x64/5864.png',
        mockPrice: 6000,
    },
    {
        address: '0x3a5496462991901555459308F1fA63A465711299',
        name: 'Pepe',
        symbol: 'PEPE',
        decimals: 18,
        logo: 'https://s2.coinmarketcap.com/static/img/coins/64x64/24478.png',
        mockPrice: 0.000012
    }
];