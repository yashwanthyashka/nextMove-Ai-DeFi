
import React, { useState, useEffect, useMemo } from 'react';
import { ethers } from 'ethers';
import { AppLogoIcon, KeyIcon, PlusCircleIcon, AlertTriangleIcon, ChevronLeftIcon, CopyIcon, CheckCircleIcon, EyeIcon, EyeOffIcon, CloudIcon, CloudArrowUpIcon } from './Icons';
import CryptoBackground3D from './CryptoBackground3D';
import { Loader } from './UI';
import type { StoredWallet } from '../types';
import { PhotonService } from '../services/photonService';

interface WalletGateProps {
  onLogin: (decryptedWallet: ethers.Wallet, password: string) => void;
  walletsJson: string;
  activeIndex: number;
  onResetWallet: () => void;
}

type View = 'initial' | 'create' | 'import' | 'setPassword' | 'login' | 'cloudRestore';

// ... (InitialView, ImportWalletView, CloudRestoreView, LoginView components remain mostly the same, ensuring visual consistency) ...
// For brevity, I'll update CreateWalletView and SetPasswordView which use PhotonService

const InitialView: React.FC<{ onCreate: () => void; onImport: () => void; onCloudRestore: () => void; hasCloudBackup: boolean }> = ({ onCreate, onImport, onCloudRestore, hasCloudBackup }) => (
    <div className="relative z-10 text-center flex flex-col items-center animate-fade-in-up">
        <div className="[transform-style:preserve-3d] mb-8">
            <AppLogoIcon className="w-24 h-24" />
        </div>
        <h1 className="text-4xl font-bold text-white mb-2">DeFi AI Assistant</h1>
        <p className="text-lg text-[#f4ffb8] mb-12">Your Aptos Gateway</p>
        <div className="space-y-4 w-full max-w-xs">
            <button onClick={onCreate} className="w-full flex items-center justify-center gap-3 bg-[#f4ffb8] text-black font-semibold py-3 px-6 rounded-lg shadow-lg hover:bg-[#f4ffb8] transition-all transform hover:scale-105 hover:-translate-y-1">
                <PlusCircleIcon className="w-6 h-6" /><span>Create Aptos Wallet</span>
            </button>
             <button onClick={onImport} className="w-full flex items-center justify-center gap-3 bg-gray-700/60 text-white font-semibold py-3 px-6 rounded-lg shadow-lg hover:bg-gray-600/80 transition-all transform hover:scale-105">
                <KeyIcon className="w-6 h-6" /><span>Import Wallet</span>
            </button>
            {hasCloudBackup && (
                <button onClick={onCloudRestore} className="w-full flex items-center justify-center gap-3 bg-indigo-600/80 text-white font-semibold py-3 px-6 rounded-lg shadow-lg hover:bg-indigo-500 transition-all transform hover:scale-105">
                    <CloudArrowUpIcon className="w-6 h-6" /><span>Restore from Cloud</span>
                </button>
            )}
        </div>
    </div>
);

const CreateWalletView: React.FC<{ onBack: () => void; onMnemonicReady: (mnemonic: string, backupType: 'manual' | 'cloud') => void; }> = ({ onBack, onMnemonicReady }) => {
    const [mnemonic, setMnemonic] = useState('');
    const [isCopied, setIsCopied] = useState(false);

    useEffect(() => {
        // Generates Aptos-compatible mnemonic source
        const phrase = PhotonService.createHDWallet();
        setMnemonic(phrase);
    }, []);

    const handleCopy = () => {
        navigator.clipboard.writeText(mnemonic);
        setIsCopied(true);
        setTimeout(() => setIsCopied(false), 2000);
    };

    return (
        <div className="relative z-10 w-full max-w-md p-6 animate-fade-in-up">
            <button onClick={onBack} className="flex items-center gap-2 text-[#f4ffb8] hover:text-white mb-4"><ChevronLeftIcon className="w-5 h-5" /> Back</button>
            <h2 className="text-2xl font-bold text-white text-center mb-2">New Aptos Wallet</h2>
            <p className="text-center text-gray-400 mb-4">This phrase is your master key.</p>
            <div className="bg-gray-900/50 border border-[#f4ffb8]/50 rounded-lg p-4 grid grid-cols-2 sm:grid-cols-3 gap-3 font-mono text-white mb-4">
                {mnemonic.split(' ').map((word, index) => (
                    <div key={index} className="flex items-center"><span className="text-gray-500 mr-2 w-6 text-right">{index + 1}.</span><span>{word}</span></div>
                ))}
            </div>
            <button onClick={handleCopy} className="w-full flex items-center justify-center gap-2 bg-gray-700/60 text-white py-2 px-4 rounded-lg hover:bg-gray-600/80 transition-colors mb-6">
                {isCopied ? <CheckCircleIcon className="w-5 h-5 text-[#f4ffb8]" /> : <CopyIcon className="w-5 h-5" />} {isCopied ? 'Copied!' : 'Copy to Clipboard'}
            </button>
            <div className="grid grid-cols-2 gap-4">
                <button onClick={() => onMnemonicReady(mnemonic, 'cloud')} className="flex flex-col items-center justify-center p-4 bg-indigo-600/20 border border-indigo-500/50 rounded-xl hover:bg-indigo-600/40 transition-all group">
                    <CloudIcon className="w-8 h-8 text-indigo-400 mb-2 group-hover:scale-110 transition-transform" /><span className="text-white font-semibold">Cloud Backup</span>
                </button>
                <button onClick={() => onMnemonicReady(mnemonic, 'manual')} className="flex flex-col items-center justify-center p-4 bg-gray-700/20 border border-gray-600/50 rounded-xl hover:bg-gray-700/40 transition-all group">
                    <KeyIcon className="w-8 h-8 text-gray-400 mb-2 group-hover:scale-110 transition-transform" /><span className="text-white font-semibold">Manual Backup</span>
                </button>
            </div>
        </div>
    );
};

// ... ImportWalletView (same as original logic, just uses mnemonic) ...
const ImportWalletView: React.FC<{ onBack: () => void; onMnemonicReady: (mnemonic: string) => void; }> = ({ onBack, onMnemonicReady }) => {
    const [phrase, setPhrase] = useState('');
    const handleImport = () => { if (phrase.trim()) onMnemonicReady(phrase.trim().toLowerCase()); };
    return (
         <div className="relative z-10 w-full max-w-md p-6 animate-fade-in-up">
            <button onClick={onBack} className="flex items-center gap-2 text-[#f4ffb8] hover:text-white mb-4"><ChevronLeftIcon className="w-5 h-5" /> Back</button>
            <h2 className="text-2xl font-bold text-white text-center mb-2">Import Wallet</h2>
            <textarea value={phrase} onChange={(e) => setPhrase(e.target.value)} rows={4} className="w-full bg-gray-900/50 border border-[#f4ffb8]/50 rounded-lg p-3 font-mono text-white" placeholder="Recovery phrase..." />
            <button onClick={handleImport} className="w-full mt-6 bg-[#f4ffb8] text-black font-semibold py-3 rounded-lg hover:bg-[#f4ffb8] transition-all">Import Wallet</button>
        </div>
    );
};

const SetPasswordView: React.FC<{ mnemonic: string; backupMethod: 'manual' | 'cloud' | null; onLogin: (wallet: ethers.Wallet, password: string) => void; onBack: () => void; }> = ({ mnemonic, backupMethod, onLogin, onBack }) => {
    const [walletName, setWalletName] = useState('Aptos Main');
    const [password, setPassword] = useState('');
    const [isProcessing, setIsProcessing] = useState(false);

    const handleSubmit = async () => {
        setIsProcessing(true);
        try {
            await new Promise(resolve => setTimeout(resolve, 50)); 
            if (backupMethod === 'cloud') await PhotonService.cloudBackup(mnemonic, password);
            
            // Encrypt using ethers for secure local storage
            const wallet = ethers.Wallet.fromPhrase(mnemonic);
            const encryptedJson = await wallet.encrypt(password);
            
            const walletsArray: StoredWallet[] = [{ name: walletName.trim(), json: encryptedJson }];
            localStorage.setItem('userWallets', JSON.stringify(walletsArray));
            localStorage.setItem('activeWalletIndex', '0');
            
            // Directly pass the wallet object which contains the mnemonic
            onLogin(wallet, password);
        } catch (e) { setIsProcessing(false); }
    };

    return (
        <div className="relative z-10 w-full max-w-md p-6 animate-fade-in-up">
            <button onClick={onBack} className="flex items-center gap-2 text-[#f4ffb8] hover:text-white mb-4"><ChevronLeftIcon className="w-5 h-5" /> Back</button>
            <h2 className="text-2xl font-bold text-white text-center mb-2">Secure Wallet</h2>
            <input type="text" value={walletName} onChange={(e) => setWalletName(e.target.value)} placeholder="Wallet Name" className="w-full bg-gray-900/50 border border-[#f4ffb8]/50 rounded-lg p-3 text-white mb-4" />
            <input type="password" value={password} onChange={(e) => setPassword(e.target.value)} placeholder="Password" className="w-full bg-gray-900/50 border border-[#f4ffb8]/50 rounded-lg p-3 text-white mb-6" />
            <button onClick={handleSubmit} disabled={isProcessing || !password} className="w-full bg-[#f4ffb8] text-black font-semibold py-3 rounded-lg hover:bg-[#f4ffb8] transition-all flex justify-center gap-2">
                {isProcessing ? <Loader /> : 'Create & Encrypt'}
            </button>
        </div>
    );
};

// ... CloudRestoreView, LoginView (Standard) ...
const CloudRestoreView: React.FC<{ onBack: () => void; onRestoreComplete: (mnemonic: string) => void; }> = ({ onBack, onRestoreComplete }) => {
    const [password, setPassword] = useState('');
    const handleRestore = async (e: React.FormEvent) => {
        e.preventDefault();
        try {
            const phrase = await PhotonService.cloudRestore(password);
            if (phrase) onRestoreComplete(phrase);
        } catch (err) {}
    };
    return (
        <div className="relative z-10 w-full max-w-md p-6 text-center flex flex-col items-center animate-fade-in-up">
            <button onClick={onBack} className="absolute top-6 left-6 flex items-center gap-2 text-[#f4ffb8] hover:text-white"><ChevronLeftIcon className="w-5 h-5" /> Back</button>
            <CloudIcon className="w-20 h-20 mb-4 text-indigo-400" />
            <h2 className="text-2xl font-bold text-white mb-2">Cloud Restore</h2>
            <input type="password" value={password} onChange={(e) => setPassword(e.target.value)} placeholder="Backup Password" className="w-full bg-gray-900/50 border border-[#f4ffb8]/50 rounded-lg p-3 text-white text-center mb-4" />
            <button onClick={handleRestore} className="w-full bg-indigo-600 text-white font-semibold py-3 rounded-lg hover:bg-indigo-500">Restore</button>
        </div>
    );
};

const LoginView: React.FC<{ walletsJson: string; activeIndex: number; onLogin: (wallet: ethers.Wallet, password: string) => void; onReset: () => void; }> = ({ walletsJson, activeIndex, onLogin, onReset }) => {
    const [password, setPassword] = useState('');
    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();
        try {
            const wallets: StoredWallet[] = JSON.parse(walletsJson);
            const decryptedWallet = await ethers.Wallet.fromEncryptedJson(wallets[activeIndex].json, password);
            // Pass the decrypted wallet directly, which might contain metadata
            onLogin(decryptedWallet, password);
        } catch (err) {}
    };
    return (
        <div className="relative z-10 w-full max-w-md p-6 text-center flex flex-col items-center animate-fade-in-up">
            <AppLogoIcon className="w-20 h-20 mb-4" />
            <h2 className="text-2xl font-bold text-white mb-2">Welcome Back</h2>
            <input type="password" value={password} onChange={(e) => setPassword(e.target.value)} placeholder="Password" className="w-full bg-gray-900/50 border border-[#f4ffb8]/50 rounded-lg p-3 text-white text-center mb-4" />
            <button onClick={handleSubmit} className="w-full bg-[#f4ffb8] text-black font-semibold py-3 rounded-lg hover:bg-[#f4ffb8]">Unlock</button>
            <button onClick={onReset} className="text-gray-500 text-sm mt-6 hover:text-red-400">Forgot password? Reset.</button>
        </div>
    );
};

export const WalletGate: React.FC<WalletGateProps> = ({ onLogin, walletsJson, activeIndex, onResetWallet }) => {
    const [view, setView] = useState<View>('initial');
    const [mnemonic, setMnemonic] = useState<string | null>(null);
    const [backupMethod, setBackupMethod] = useState<'manual' | 'cloud' | null>(null);
    const hasExistingWallets = useMemo(() => { try { return JSON.parse(walletsJson).length > 0; } catch { return false; } }, [walletsJson]);

    useEffect(() => { setView(hasExistingWallets ? 'login' : 'initial'); }, [hasExistingWallets]);

    const handleMnemonicReady = (phrase: string, method: 'manual' | 'cloud') => { setMnemonic(phrase); setBackupMethod(method); setView('setPassword'); };
    const handleRestoreComplete = (phrase: string) => { setMnemonic(phrase); setBackupMethod(null); setView('setPassword'); };

    const renderContent = () => {
        switch (view) {
            case 'login': return <LoginView walletsJson={walletsJson} activeIndex={activeIndex} onLogin={onLogin} onReset={() => {onResetWallet(); setView('initial');}} />;
            case 'setPassword': return <SetPasswordView mnemonic={mnemonic!} backupMethod={backupMethod} onLogin={onLogin} onBack={() => setView('initial')} />;
            case 'create': return <CreateWalletView onBack={() => setView('initial')} onMnemonicReady={handleMnemonicReady} />;
            case 'import': return <ImportWalletView onBack={() => setView('initial')} onMnemonicReady={(phrase) => handleMnemonicReady(phrase, 'manual')} />;
            case 'cloudRestore': return <CloudRestoreView onBack={() => setView('initial')} onRestoreComplete={handleRestoreComplete} />;
            default: return <InitialView onCreate={() => setView('create')} onImport={() => setView('import')} onCloudRestore={() => setView('cloudRestore')} hasCloudBackup={PhotonService.hasCloudBackup()} />;
        }
    };

    return (
        <div className="relative w-full h-screen bg-transparent flex flex-col justify-center items-center p-4 overflow-hidden [perspective:800px]">
            <CryptoBackground3D />
            {renderContent()}
        </div>
    );
};
