
import React, { useState } from 'react';
import { Card, Modal } from './UI';
import { AlertTriangleIcon, ChevronRightIcon, CopyIcon, CheckCircleIcon } from './Icons';

interface SettingsProps {
    signer: any; // Aptos Account
    sessionPassword_DO_NOT_USE_DIRECTLY: string;
    storedWallets: any[];
    activeWalletIndex: number;
    onUpdateName: any;
    wallet: any;
    theme: any;
    onUpdateTheme: any;
}

export const Settings: React.FC<SettingsProps> = ({ signer }) => {
    const [isCopied, setIsCopied] = useState(false);
    const [showKey, setShowKey] = useState(false);

    const handleCopy = (text: string) => { navigator.clipboard.writeText(text); setIsCopied(true); setTimeout(() => setIsCopied(false), 2000); };

    return (
        <div className="p-4 h-full flex flex-col animate-fade-in-up space-y-4">
            <Card className="p-4">
                <h3 className="font-semibold text-white mb-2">Account</h3>
                <div className="space-y-3">
                    <div className="bg-gray-800 p-3 rounded-lg break-all">
                        <p className="text-xs text-gray-400">Address</p>
                        <div className="flex justify-between items-center">
                            <span className="text-sm font-mono text-white">{signer.accountAddress.toString()}</span>
                            <button onClick={() => handleCopy(signer.accountAddress.toString())}><CopyIcon className="w-4 h-4 text-[#f4ffb8]" /></button>
                        </div>
                    </div>
                    <div className="bg-gray-800 p-3 rounded-lg break-all">
                        <p className="text-xs text-gray-400">Private Key (Ed25519)</p>
                        {showKey ? (
                            <div className="flex justify-between items-center">
                                <span className="text-sm font-mono text-white">{signer.privateKey.toString()}</span>
                                <button onClick={() => handleCopy(signer.privateKey.toString())}><CopyIcon className="w-4 h-4 text-[#f4ffb8]" /></button>
                            </div>
                        ) : (
                            <button onClick={() => setShowKey(true)} className="text-sm text-[#f4ffb8]">Show Private Key</button>
                        )}
                    </div>
                </div>
            </Card>
        </div>
    );
};
