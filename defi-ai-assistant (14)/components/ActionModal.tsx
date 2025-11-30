
import React, { useState } from 'react';
import { Account } from "@aptos-labs/ts-sdk"; // Aptos SDK
import { Modal, Loader } from './UI';
import type { Token, Wallet } from '../types';
import { CheckCircleIcon, ArrowUpRightIcon, AlertTriangleIcon } from './Icons';
import { aptos } from '../services/aptosService'; // use shared instance

export type ActionType = 'buy_sell' | 'send' | 'receive' | 'swap' | 'bridge';

interface ActionModalProps {
    isOpen: boolean;
    onClose: () => void;
    action: ActionType;
    wallet: Wallet;
    signer: any; // Aptos Account
}

const SendForm: React.FC<{ wallet: Wallet; signer: Account; onClose: () => void; }> = ({ wallet, signer, onClose }) => {
    const [recipient, setRecipient] = useState('');
    const [amount, setAmount] = useState('');
    const [txState, setTxState] = useState<'idle' | 'pending' | 'success' | 'error'>('idle');
    const [txHash, setTxHash] = useState('');
    const [error, setError] = useState<string | null>(null);

    const handleSend = async () => {
        if (!signer) return;
        setTxState('pending'); setError(null);
        try {
            // Build transaction
            const transaction = await aptos.transaction.build.simple({
                sender: signer.accountAddress,
                data: {
                    function: "0x1::coin::transfer",
                    typeArguments: ["0x1::aptos_coin::AptosCoin"],
                    functionArguments: [recipient, Math.floor(parseFloat(amount) * 100000000)], // Octas
                },
            });

            // Sign and submit
            const pendingTx = await aptos.transaction.signAndSubmitTransaction({ signer, transaction });
            await aptos.waitForTransaction({ transactionHash: pendingTx.hash });
            
            setTxHash(pendingTx.hash);
            setTxState('success');
        } catch (err: any) {
            console.error(err);
            setError(err.message || "Transaction failed");
            setTxState('error');
        }
    };

    if (txState === 'success') {
        return (
            <div className="text-center flex flex-col items-center animate-fade-in-up">
                <CheckCircleIcon className="w-20 h-20 text-[#f4ffb8] mb-4" />
                <h3 className="text-2xl font-bold text-white mb-2">Transfer Successful!</h3>
                <a href={`https://explorer.aptoslabs.com/txn/${txHash}?network=testnet`} target="_blank" className="text-[#f4ffb8] hover:text-[#f4ffb8] mb-6 flex items-center gap-2">View on Explorer <ArrowUpRightIcon className="w-4 h-4"/></a>
                <button onClick={onClose} className="w-full bg-[#f4ffb8] text-black font-semibold py-3 rounded-lg">Done</button>
            </div>
        );
    }

    if (txState === 'pending') return <div className="text-center p-8"><Loader /><h3 className="text-xl font-bold text-white mt-6">Processing on Aptos...</h3></div>;

    return (
        <div className="space-y-4">
            <div>
                <label className="block text-sm font-medium text-gray-300 mb-1">Recipient Address</label>
                <input type="text" placeholder="0x..." value={recipient} onChange={e => setRecipient(e.target.value)} className="w-full bg-gray-800/70 border border-gray-600 rounded-md p-3 text-white focus:border-[#f4ffb8]" />
            </div>
            <div>
                <label className="block text-sm font-medium text-gray-300 mb-1">Amount (APT)</label>
                <input type="number" placeholder="0.00" value={amount} onChange={e => setAmount(e.target.value)} className="w-full bg-gray-800/70 border border-gray-600 rounded-md p-3 text-white focus:border-[#f4ffb8]" />
            </div>
            {txState === 'error' && <div className="p-3 bg-red-900/50 border border-red-600 rounded-lg text-red-200 text-sm flex gap-2"><AlertTriangleIcon className="w-6 h-6"/> {error}</div>}
            <button onClick={handleSend} disabled={!recipient || !amount} className="w-full mt-2 bg-[#f4ffb8] text-black font-semibold py-3 rounded-lg hover:bg-[#f4ffb8] disabled:opacity-50">Send</button>
        </div>
    );
};

const ReceiveContent: React.FC<{ wallet: Wallet; }> = ({ wallet }) => {
    return (
        <div className="text-center">
            <div className="bg-white p-4 rounded-xl inline-block mb-4">
                {/* QR Code would go here, simplified text for now */}
                <div className="w-48 h-48 bg-black flex items-center justify-center text-white text-xs break-all p-2">{wallet.address}</div>
            </div>
            <p className="text-gray-400 text-sm mb-2">Your Aptos Address</p>
            <div className="bg-gray-800/70 p-3 rounded-md border border-gray-600 break-all font-mono text-sm text-white">{wallet.address}</div>
        </div>
    );
};

export const ActionModal: React.FC<ActionModalProps> = ({ isOpen, onClose, action, wallet, signer }) => {
    if (!isOpen) return null;
    return (
        <Modal isOpen={isOpen} onClose={onClose} title={action === 'send' ? 'Send Aptos' : 'Receive Aptos'}>
            {action === 'send' ? <SendForm wallet={wallet} signer={signer} onClose={onClose} /> : <ReceiveContent wallet={wallet} />}
        </Modal>
    );
};
