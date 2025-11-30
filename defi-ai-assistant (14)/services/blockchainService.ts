
import { ethers } from 'ethers';
import type { Transaction } from '../types';
import { ERC20_ABI, SEPOLIA_ERC20_METADATA } from '../constants';

export type RawTransaction = Omit<Transaction, 'usdAmount'>;

const ERC20_IFACE = new ethers.Interface(ERC20_ABI);

const processTransaction = (
    tx: any, // Etherscan/Blockscout transaction object
    myAddress: string
): RawTransaction | null => {
    try {
        let status: Transaction['status'];
        // Updated status logic for compatibility with both Etherscan and Blockscout
        // Etherscan uses txreceipt_status: "0" for failed txs.
        // Blockscout uses isError: "1" for failed txs.
        if (tx.isError === '1' || tx.txreceipt_status === '0') {
            status = 'Failed';
        } else {
            // History APIs generally return confirmed transactions.
            // If it's not explicitly marked as failed, we'll consider it completed.
            status = 'Completed';
        }
        
        const date = new Date(parseInt(tx.timeStamp, 10) * 1000).toISOString();
        const id = tx.hash;

        // --- Check for ERC20 Transfer ---
        const knownToken = SEPOLIA_ERC20_METADATA.find(t => t.address.toLowerCase() === tx.to?.toLowerCase());
        if (knownToken && tx.input.startsWith('0xa9059cbb')) { // 'transfer' function selector
            const decodedData = ERC20_IFACE.parseTransaction({ data: tx.input });
            if (decodedData && decodedData.name === 'transfer') {
                const recipient = decodedData.args.to as string;
                const amount = decodedData.args.amount as bigint;
                
                const from = tx.from.toLowerCase();
                const to = recipient.toLowerCase();
                const selfAddress = myAddress.toLowerCase();

                let type: Transaction['type'] | null = null;
                if (from === selfAddress && to !== selfAddress) type = 'Send';
                else if (to === selfAddress && from !== selfAddress) type = 'Receive';

                if (type) {
                    return {
                        id, type, date, status,
                        tokenSymbol: knownToken.symbol,
                        tokenName: knownToken.name,
                        tokenLogo: knownToken.logo,
                        tokenAmount: parseFloat(ethers.formatUnits(amount, knownToken.decimals)),
                    };
                }
            }
        }

        // --- Check for Native ETH Transfer ---
        const value = BigInt(tx.value);
        if (value > 0) {
            const from = tx.from.toLowerCase();
            const to = (tx.to || '').toLowerCase();
            const selfAddress = myAddress.toLowerCase();

            let type: Transaction['type'] | null = null;
            if (from === selfAddress && to !== selfAddress) type = 'Send';
            else if (to === selfAddress && from !== selfAddress) type = 'Receive';

            if (type) {
                return {
                    id, type, date, status,
                    tokenSymbol: 'ETH',
                    tokenName: 'Ethereum',
                    tokenLogo: 'https://s2.coinmarketcap.com/static/img/coins/64x64/1027.png',
                    tokenAmount: parseFloat(ethers.formatEther(value)),
                };
            }
        }
        
        return null; // Not a relevant transaction type
    } catch (error) {
        console.warn(`Skipping transaction ${tx.hash} due to processing error:`, error);
        return null;
    }
};

// Fix: Switched from Etherscan to Blockscout API to avoid mandatory API key errors.
export const fetchTransactionHistory = async (address: string): Promise<RawTransaction[]> => {
    // Blockscout provides a public API for testnets without requiring an API key.
    const API_URL = `https://eth-sepolia.blockscout.com/api?module=account&action=txlist&address=${address}&sort=desc`;

    try {
        const response = await fetch(API_URL);
        if (!response.ok) {
            throw new Error(`Blockscout API responded with status: ${response.status}`);
        }
        const data = await response.json();

        if (data.status !== '1' && data.message !== 'No transactions found') {
            throw new Error(`Blockscout API error: ${data.message} - ${data.result}`);
        }

        const history = data.result;

        if (!Array.isArray(history)) {
            console.warn("Blockscout API did not return an array for txlist, it might be that there are no transactions.", history);
            return [];
        }

        const processedTxs = history.map(tx => processTransaction(tx, address));
        
        return processedTxs.filter((tx): tx is RawTransaction => tx !== null);
    } catch (error) {
        console.error("Failed to fetch transaction history from Blockscout:", error);
        return [];
    }
};
