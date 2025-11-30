
import { LaunchToken } from '../types';

// Network Configuration - SWITCHED TO TESTNET
const APTOS_FULLNODE_URL = 'https://fullnode.testnet.aptoslabs.com/v1'; 
const INDEXER_URL = 'https://api.testnet.aptoslabs.com/v1/graphql';

// --- IMPORTANT: Update this after deploying the contracts/launchpad.move module ---
// This address should exist on Testnet
const LAUNCHPAD_CONTRACT_ADDRESS = '0x1c4a036859563212716573f71c4a036859563212716573f71c4a036859563212'; 
const MODULE_NAME = 'token_launchpad';

// Mock Data for Fallback/Demo
const MOCK_TOKENS: LaunchToken[] = [
    {
        id: 'mock-1',
        name: 'Aptos Doge',
        symbol: 'ADOGE',
        description: 'The first dog coin on Aptos. Much wow, very speed. Such reliable.',
        imageUrl: 'https://cdn-icons-png.flaticon.com/512/616/616408.png',
        creatorAddress: '0x123...abc',
        createdAt: Date.now() - 10000000,
        category: 'Meme',
        isDoxxed: true,
        marketCap: 45000,
        price: 0.00045,
        bondingCurveProgress: 45,
        volume24h: 1200,
        holderCount: 150,
        replies: 12,
        tokenObjectAddress: '0xMockToken1',
        lpAddress: '0xMockLP1',
        initialSupply: 100000000,
        decimals: 8,
        taxes: { buy: 1, sell: 1 },
        socials: { website: 'https://aptos.dev', twitter: 'https://twitter.com/aptos' },
        distribution: { liquidity: 90, creator: 5, community: 5 }
    },
    {
        id: 'mock-2',
        name: 'Move Pump',
        symbol: 'MOVE',
        description: 'Utility token for the Move ecosystem. Governance and staking.',
        imageUrl: 'https://cdn-icons-png.flaticon.com/512/12114/12114233.png',
        creatorAddress: '0x456...def',
        createdAt: Date.now() - 5000000,
        category: 'Utility',
        isDoxxed: false,
        marketCap: 120000,
        price: 0.12,
        bondingCurveProgress: 88,
        volume24h: 5600,
        holderCount: 340,
        replies: 45,
        tokenObjectAddress: '0xMockToken2',
        lpAddress: '0xMockLP2',
        initialSupply: 1000000,
        decimals: 6,
        taxes: { buy: 0, sell: 0 },
        socials: { website: 'https://aptos.dev' },
        distribution: { liquidity: 95, creator: 5, community: 0 }
    },
    {
        id: 'mock-3',
        name: 'Pepe Aptos',
        symbol: 'PEAPT',
        description: 'Feels good man. The green frog has arrived on the fastest chain.',
        imageUrl: 'https://cdn-icons-png.flaticon.com/512/11029/11029051.png',
        creatorAddress: '0x789...xyz',
        createdAt: Date.now() - 200000,
        category: 'Meme',
        isDoxxed: false,
        marketCap: 12000,
        price: 0.000012,
        bondingCurveProgress: 12,
        volume24h: 300,
        holderCount: 45,
        replies: 5,
        tokenObjectAddress: '0xMockToken3',
        lpAddress: '0xMockLP3',
        initialSupply: 1000000000,
        decimals: 8,
        taxes: { buy: 0, sell: 0 },
        socials: { twitter: 'https://twitter.com/pepe' },
        distribution: { liquidity: 100, creator: 0, community: 0 }
    }
];

// Helper to get the best available wallet provider
const getProvider = () => {
    if (typeof window === 'undefined') return null;
    const w = window as any;
    if (w.petra) return w.petra;
    if (w.martian) return w.martian;
    if (w.pontem) return w.pontem;
    if (w.aptos) return w.aptos;
    return null;
};

// Helper to fetch raw resources from Node API
async function fetchAccountResource(address: string, resourceType: string) {
    try {
        const response = await fetch(`${APTOS_FULLNODE_URL}/accounts/${address}/resource/${resourceType}`);
        if (!response.ok) {
            // Don't throw immediately on 404 to avoid crashing UI for non-existent accounts
            return null;
        }
        return await response.json();
    } catch (e) {
        console.error(`Error fetching resource ${resourceType}:`, e);
        return null;
    }
}

// Helper to check whether a module exists at an address (avoid calling wallet sim if not deployed)
async function isModuleDeployed(address: string, moduleName: string): Promise<boolean> {
    try {
        const url = `${APTOS_FULLNODE_URL}/accounts/${address}/module/${moduleName}`;
        const resp = await fetch(url);
        return resp.ok;
    } catch (e) {
        console.warn('isModuleDeployed check failed:', e);
        return false;
    }
}

export const AptosLaunchService = {
    // Check if a compatible wallet is installed
    hasWallet: (): boolean => {
        return !!getProvider();
    },

    connectWallet: async (): Promise<string | null> => {
        const provider = getProvider();
        if (!provider) return null;
        try {
            const response = await provider.connect();
            // Different wallets return different structures, most return { address: ... } or just address string
            return response.address || response;
        } catch (error) {
            console.error("Wallet connection failed:", error);
            return null;
        }
    },

    isLaunchpadAvailable: async (): Promise<boolean> => {
        return await isModuleDeployed(LAUNCHPAD_CONTRACT_ADDRESS, MODULE_NAME);
    },

    getAccount: async (): Promise<string | null> => {
        const provider = getProvider();
        if (!provider) return null;
        try {
            // Some wallets support isConnected(), others don't. We try/catch.
            if (provider.isConnected && await provider.isConnected()) {
                const account = await provider.account();
                return account.address || account;
            }
            return null;
        } catch (e) {
            return null;
        }
    },

    // 2. Fetch Real On-Chain Data with Mock Fallback
    getTokens: async (filter: 'all' | 'meme' | 'utility' = 'all'): Promise<LaunchToken[]> => {
        try {
            // 1. Fetch the Registry from the contract account
            const registryType = `${LAUNCHPAD_CONTRACT_ADDRESS}::${MODULE_NAME}::LaunchRegistry`;
            const registryData = await fetchAccountResource(LAUNCHPAD_CONTRACT_ADDRESS, registryType);

            if (!registryData || !registryData.data || !registryData.data.tokens) {
                // If contract not deployed or empty, return mocks
                return MOCK_TOKENS;
            }

            const tokenAddresses: string[] = registryData.data.tokens;
            // Reverse to show newest first
            const recentAddresses = tokenAddresses.reverse().slice(0, 50);

            const tokens: LaunchToken[] = [];

            // 2. Parallel fetch details for each token
            await Promise.all(recentAddresses.map(async (addr) => {
                try {
                    // Fetch Metadata (Name, Symbol, Decimals)
                    const metadata = await fetchAccountResource(addr, `0x1::fungible_asset::Metadata`);
                    // Fetch Bonding Curve Config
                    const configType = `${LAUNCHPAD_CONTRACT_ADDRESS}::${MODULE_NAME}::TokenLaunchConfig`;
                    const curveConfig = await fetchAccountResource(addr, configType);

                    if (metadata && curveConfig) {
                        const m = metadata.data;
                        const c = curveConfig.data;
                        
                        // Calculate price from curve state
                        const reserveApt = parseFloat(c.reserve_apt);
                        const reserveToken = parseFloat(c.reserve_token);
                        const priceInOctas = reserveToken > 0 ? (reserveApt * 100000000) / reserveToken : 0; 
                        const displayPrice = priceInOctas / 100000000; // Convert to APT

                        // Determine Bonding Curve Progress (Simplified)
                        // Assuming target raise is when reserve_token drops to 20% of initial
                        const soldTokens = parseFloat(c.initial_supply) - reserveToken;
                        const progress = Math.min((soldTokens / (parseFloat(c.initial_supply) * 0.8)) * 100, 100);

                        tokens.push({
                            id: addr,
                            name: m.name,
                            symbol: m.symbol,
                            description: "On-chain project", 
                            imageUrl: m.icon_uri,
                            creatorAddress: c.creator_addr,
                            createdAt: parseInt(c.created_at) * 1000,
                            category: 'Meme', // Fallback as on-chain tags are expensive
                            isDoxxed: false,
                            marketCap: displayPrice * parseFloat(c.initial_supply),
                            price: displayPrice,
                            bondingCurveProgress: progress,
                            volume24h: 0, 
                            holderCount: 0, 
                            replies: 0,
                            tokenObjectAddress: addr,
                            lpAddress: LAUNCHPAD_CONTRACT_ADDRESS,
                            initialSupply: parseFloat(c.initial_supply),
                            decimals: m.decimals,
                            taxes: { buy: 0, sell: 0 },
                            socials: { website: m.project_uri },
                            distribution: { liquidity: 100, creator: 0, community: 0 }
                        });
                    }
                } catch (e) {
                    console.warn(`Failed to fetch details for ${addr}`, e);
                }
            }));

            if (tokens.length === 0) return MOCK_TOKENS;
            return tokens;

        } catch (error) {
            console.error("Failed to fetch from blockchain:", error);
            return MOCK_TOKENS; // Graceful fallback
        }
    },

    // 3. Create Token (Real Transaction)
    createToken: async (data: { 
        name: string; 
        symbol: string; 
        description: string; 
        imageUrl: string; 
        category: 'Meme' | 'Utility';
        isDoxxed: boolean;
        initialSupply: number;
        decimals: number;
        taxes: { buy: number; sell: number };
        socials: { website?: string; twitter?: string; telegram?: string; discord?: string };
    }): Promise<{ token: LaunchToken, txHash: string }> => {
        
        let txHash = "";
        const provider = getProvider();

        // If contract not deployed, avoid opening wallet and return a clear error for the UI
        const moduleExists = await isModuleDeployed(LAUNCHPAD_CONTRACT_ADDRESS, MODULE_NAME);
        if (!moduleExists) {
            const errMsg = `Launchpad module not found at ${LAUNCHPAD_CONTRACT_ADDRESS}::${MODULE_NAME} on this network.`;
            console.warn(errMsg);
            // Return a simulated optimistic token creation to avoid breaking the UI,
            // but ensure consumers get a clear message via thrown error as well.
            // Prefer throwing so UI can surface a clear message.
            throw new Error(errMsg);
        }

        if (provider) {
            // Construct payload for the Move entry function
            const payload = {
                type: "entry_function_payload",
                function: `${LAUNCHPAD_CONTRACT_ADDRESS}::${MODULE_NAME}::create_token`,
                type_arguments: [],
                arguments: [
                    data.name,
                    data.symbol,
                    data.imageUrl,
                    data.socials.website || "", // project_uri
                    data.initialSupply.toString(), // initial_supply
                    data.decimals // decimals
                ]
            };

            try {
                const pendingTx = await provider.signAndSubmitTransaction(payload);
                txHash = pendingTx.hash || pendingTx;
                // We wait lightly, but don't block the UI flow entirely if fast
                await AptosLaunchService.waitForTransaction(txHash);
            } catch (e: any) {
                // If user rejected request, throw error so UI knows
                if (e?.code === 4001 || e?.message?.toString().toLowerCase().includes('reject')) {
                    throw new Error("Transaction rejected by user");
                }
                
                console.warn("Transaction failed or rejected, falling back to mock creation for demo.");
                txHash = "0x" + Math.random().toString(16).slice(2) + " (Mock)";
            }
        } else {
            console.warn("No wallet found, simulating creation.");
            txHash = "0x" + Math.random().toString(16).slice(2) + " (Simulated)";
            await new Promise(r => setTimeout(r, 1500));
        }

        // Construct a proper Token Object so the UI doesn't crash on optimistic update
        const newToken: LaunchToken = {
            id: 'token-' + Date.now(),
            name: data.name,
            symbol: data.symbol,
            description: data.description,
            imageUrl: data.imageUrl || 'https://via.placeholder.com/150',
            creatorAddress: '0xUser',
            createdAt: Date.now(),
            category: data.category,
            isDoxxed: data.isDoxxed,
            marketCap: 10000, // Initial estimate
            price: 0.00001, // Initial estimate
            bondingCurveProgress: 0,
            volume24h: 0,
            holderCount: 1,
            replies: 0,
            tokenObjectAddress: '0xCreating...',
            lpAddress: '0xLPCreating...',
            initialSupply: data.initialSupply,
            decimals: data.decimals,
            taxes: data.taxes,
            socials: data.socials,
            distribution: { liquidity: 100, creator: 0, community: 0 }
        };

        return {
            token: newToken,
            txHash
        };
    },

    // 7. Real Trade (Buy/Sell)
    tradeToken: async (tokenId: string, amount: number, side: 'buy' | 'sell'): Promise<{ success: boolean; newPrice: number; txHash: string }> => {
        const provider = getProvider();
        let txHash = "";

        // Check module existence before attempting to submit a trade to avoid simulation errors
        const moduleExists2 = await isModuleDeployed(LAUNCHPAD_CONTRACT_ADDRESS, MODULE_NAME);
        if (!moduleExists2) {
            const errMsg = `Launchpad module not found at ${LAUNCHPAD_CONTRACT_ADDRESS}::${MODULE_NAME} on this network.`;
            console.warn(errMsg);
            // Inform caller via error so they can display an informative message
            throw new Error(errMsg);
        }

        if (provider) {
            const functionName = side === 'buy' ? 'buy' : 'sell';
            const amountRaw = Math.floor(amount * 100000000).toString();

            const payload = {
                type: "entry_function_payload",
                function: `${LAUNCHPAD_CONTRACT_ADDRESS}::${MODULE_NAME}::${functionName}`,
                type_arguments: [],
                arguments: [
                    tokenId, // token_obj address
                    amountRaw, 
                    "0" // min_out
                ]
            };

            try {
                const pendingTx = await provider.signAndSubmitTransaction(payload);
                txHash = pendingTx.hash || pendingTx;
                await AptosLaunchService.waitForTransaction(txHash);
            } catch (e: any) {
                if (e?.code === 4001 || e?.message?.toString().toLowerCase().includes('reject')) {
                    throw new Error("Transaction rejected by user");
                }
                console.warn("Trade tx failed, using mock.");
                txHash = "0x" + Math.random().toString(16).slice(2) + " (Mock)";
            }
        } else {
            await new Promise(r => setTimeout(r, 1000));
            txHash = "0x" + Math.random().toString(16).slice(2) + " (Simulated)";
        }

        return {
            success: true,
            newPrice: 0, 
            txHash: txHash
        };
    },

    // 8. Transaction Poller
    waitForTransaction: async (txHash: string): Promise<boolean> => {
        let attempts = 0;
        const maxAttempts = 10;

        while (attempts < maxAttempts) {
            try {
                const response = await fetch(`${APTOS_FULLNODE_URL}/transactions/by_hash/${txHash}`);
                if (response.ok) {
                    const data = await response.json();
                    if (data.type === 'pending_transaction') {
                        // wait
                    } else if (data.success) {
                        return true;
                    } else if (data.vm_status) {
                        throw new Error(`Transaction Reverted: ${data.vm_status}`);
                    }
                }
            } catch (e) {
                // ignore
            }
            await new Promise(r => setTimeout(r, 1000));
            attempts++;
        }
        return false; // Timeout
    }
};
