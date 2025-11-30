
import React, { useState, useEffect, useMemo, useCallback } from 'react';
import { ethers } from 'ethers'; // Kept ONLY for decryption
import { Account } from "@aptos-labs/ts-sdk"; // Aptos SDK
import { Home } from './components/Home';
import { Assistant } from './components/Assistant';
import { Charts } from './components/Charts';
import { DecibelMarkets } from './components/DecibelMarkets';
import { DeFi } from './components/DeFi';
import { TransactionHistory } from './components/TransactionHistory';
import { Courses } from './components/Courses';
import { Settings } from './components/Settings';
import { Launchpad } from './components/Launchpad';
import { 
    BriefcaseIcon, HomeIcon, NewsIcon, AssistantIcon, ChartBarIcon, 
    CurrencyDollarIcon, ClipboardIcon, BookOpenIcon, BellIcon, MenuIcon, 
    AppLogoIcon, LogOutIcon, GridIcon, RocketIcon 
} from './components/Icons';
import { SplashScreen } from './components/SplashScreen';
import { WalletGate } from './components/WalletGate';
import CryptoBackground3D from './components/CryptoBackground3D';
import { Alerts } from './components/Alerts';
import { ToastContainer } from './components/Toast';
import type { PriceAlert, ToastMessage, Token, Transaction, Wallet, StoredWallet, Network } from './types';
import { Onboarding } from './components/Onboarding';
import { fetchTokenPricesAndChanges, fetchTopCoins } from './services/marketService';
import type { MarketData, TokenForPricing } from './services/marketService';
import { NETWORKS } from './networks';
import { AptosService } from './services/aptosService';
import { PhotonService } from './services/photonService';
import { News } from './components/News';
import { JobsAndEvents } from './components/JobsAndEvents';

type View = 'home' | 'news' | 'jobs_events' | 'assistant' | 'charts' | 'decibel' | 'history' | 'courses' | 'alerts' | 'settings' | 'defi' | 'launch';
type AppState = 'loading' | 'onboarding' | 'walletGate' | 'loggedIn';
type MenuView = 'home' | 'alerts' | 'news' | 'jobs_events' | 'courses' | 'settings' | 'defi' | 'charts';
type Theme = 'light' | 'dark';

type TokenWithBalance = Omit<Token, 'usdValue' | 'priceChangePercentage24h' | 'price' | 'sparkline_7d'>;

interface ProcessedWallet extends Wallet {
    totalUsdValue: number;
    change24h: {
        percentage: number;
        absolute: number;
    };
}

const VIEW_TITLES: Record<View, string> = {
    home: 'Portfolio',
    news: 'Latest News',
    jobs_events: 'Opportunities',
    assistant: 'AI Assistant',
    charts: 'Market Charts',
    decibel: 'Decibel Markets',
    history: 'Transaction History',
    courses: 'Learning Hub',
    alerts: 'Price Alerts',
    settings: 'Account Details',
    defi: 'DeFi Hub',
    launch: 'Token Launchpad',
};

// ... Menu Component (same as before) ...
interface MenuProps {
  isOpen: boolean;
  onClose: () => void;
  onNavigate: (view: MenuView) => void;
  onLogout: () => void;
  currentView: View;
}

const MenuItem: React.FC<{ icon: React.ReactNode; label: string; onClick: () => void; isActive: boolean; isDestructive?: boolean }> = ({ icon, label, onClick, isActive, isDestructive }) => (
    <button onClick={onClick} className={`w-full flex items-center gap-4 p-2 text-left text-lg rounded-full transition-all duration-300 ease-in-out group ${isDestructive ? 'text-red-500 hover:text-red-400' : (isActive ? 'bg-neutral-700 text-white' : 'text-neutral-400 hover:text-white')}`}>
        <div className={`w-11 h-11 rounded-full flex items-center justify-center transition-all duration-300 ${isActive ? 'bg-neutral-800' : 'bg-neutral-700 group-hover:bg-neutral-600'}`}>
            {icon}
        </div>
        <span className="font-semibold">{label}</span>
    </button>
);

const Menu: React.FC<MenuProps> = ({ isOpen, onClose, onNavigate, onLogout, currentView }) => {
  const handleNavigation = (view: MenuView) => { onNavigate(view); onClose(); };
  return (
    <>
        <div className={`fixed inset-0 bg-black/60 backdrop-blur-sm z-40 transition-opacity duration-300 ${isOpen ? 'opacity-100' : 'opacity-0 pointer-events-none'}`} onClick={onClose} />
        <div className={`fixed top-0 right-0 h-full w-72 bg-[#1C1C1E] shadow-2xl z-50 p-4 flex flex-col transform transition-transform duration-300 ease-in-out ${isOpen ? 'translate-x-0' : 'translate-x-full'}`}>
            <div className="flex-grow pt-8 space-y-2">
                <MenuItem icon={<HomeIcon />} label="Dashboard" onClick={() => handleNavigation('home')} isActive={currentView === 'home'} />
                <MenuItem icon={<ChartBarIcon />} label="Market Charts" onClick={() => handleNavigation('charts')} isActive={currentView === 'charts'} />
                <MenuItem icon={<CurrencyDollarIcon />} label="DeFi Hub" onClick={() => handleNavigation('defi')} isActive={currentView === 'defi'} />
                <MenuItem icon={<NewsIcon />} label="News" onClick={() => handleNavigation('news')} isActive={currentView === 'news'} />
                <MenuItem icon={<BriefcaseIcon />} label="Opportunities" onClick={() => handleNavigation('jobs_events')} isActive={currentView === 'jobs_events'} />
                <MenuItem icon={<BookOpenIcon />} label="Courses" onClick={() => handleNavigation('courses')} isActive={currentView === 'courses'} />
                <MenuItem icon={<BellIcon />} label="Alerts" onClick={() => handleNavigation('alerts')} isActive={currentView === 'alerts'} />
                <MenuItem icon={<GridIcon />} label="Manage" onClick={() => handleNavigation('settings')} isActive={currentView === 'settings'} />
            </div>
            <div className="flex-shrink-0 pb-4"><MenuItem icon={<LogOutIcon />} label="Logout" onClick={() => {onLogout(); onClose();}} isDestructive isActive={false} /></div>
        </div>
    </>
  );
};

const CyberNavItem: React.FC<{ icon: React.ReactNode; label: string; isActive: boolean; onClick: () => void; accentColor: string; }> = ({ icon, label, isActive, onClick, accentColor }) => {
    const isNeon = accentColor === '#f4ffb8';
  return (
    <button onClick={onClick} className="relative flex flex-col items-center justify-start pt-4 gap-1 w-16 h-16 transition-all duration-300 transform hover:-translate-y-1 focus:outline-none group">
    <div className={`absolute inset-x-2 top-3 h-10 rounded-full blur-md transition-opacity duration-300 ${isActive ? 'opacity-100' : 'opacity-0'}`} style={{ backgroundColor: isNeon ? 'rgba(244,255,184,0.2)' : 'rgba(52, 211, 153, 0.2)' }} />
      <div className={`relative w-8 h-8 transition-all duration-300 ${isActive ? '[filter:drop-shadow(0_0_8px_currentColor)]' : 'text-gray-500 group-hover:text-slate-800 dark:group-hover:text-white'}`} style={{ color: isActive ? accentColor : undefined }}>{icon}</div>
      <span className={`relative text-xs transition-all duration-300 ${isActive ? 'text-slate-800 dark:text-white font-semibold' : 'text-gray-500 group-hover:text-gray-700 dark:group-hover:text-gray-400'}`}>{label}</span>
    </button>
  );
};

const App: React.FC = () => {
  const [appState, setAppState] = useState<AppState>('loading');
  
  // PRIMARY STATE: APTOS ACCOUNT
  const [activeAccount, setActiveAccount] = useState<Account | null>(null);
  
  const [storedWallets, setStoredWallets] = useState<StoredWallet[]>([]);
  const [activeWalletIndex, setActiveWalletIndex] = useState<number>(0);
  const [activeNetwork, setActiveNetwork] = useState<Network>(NETWORKS[0]); // Default to Aptos
  const [sessionPassword, setSessionPassword] = useState<string | null>(null);
  const [view, setView] = useState<View>('home');
  const [isMenuOpen, setIsMenuOpen] = useState(false);
  const [alerts, setAlerts] = useState<PriceAlert[]>([]);
  const [toasts, setToasts] = useState<ToastMessage[]>([]);
  const [priceData, setPriceData] = useState<Record<string, MarketData>>({});
  const [isMarketLoading, setIsMarketLoading] = useState(true);
  const [tokensWithBalance, setTokensWithBalance] = useState<TokenWithBalance[]>([]);
  const [transactions, setTransactions] = useState<Transaction[]>([]);
  const [isHistoryLoading, setIsHistoryLoading] = useState(true);
  const [marketTokens, setMarketTokens] = useState<Token[]>([]);

  const [theme, setTheme] = useState<Theme>(() => (localStorage.getItem('theme') as Theme) || (window.matchMedia('(prefers-color-scheme: light)').matches ? 'light' : 'dark'));
  const bgClass = useMemo(() => (view === 'home' && theme === 'dark') ? 'bg-[linear-gradient(to_bottom,_#000000_0%,_#000000_30%,_#d5fad3_50%,_#000000_70%,_#000000_100%)]' : 'bg-slate-50 dark:bg-black', [view, theme]);

  const addToast = useCallback((title: string, message: string) => setToasts(prev => [...prev, { id: `toast-${Date.now()}`, title, message }]), []);

  useEffect(() => {
    const timer = setTimeout(() => {
      const stored = localStorage.getItem('userWallets');
      const idx = localStorage.getItem('activeWalletIndex');
      if (stored) setStoredWallets(JSON.parse(stored));
      if (idx) setActiveWalletIndex(parseInt(idx, 10));
      setAppState(localStorage.getItem('hasOnboarded') ? (stored ? 'walletGate' : 'walletGate') : 'onboarding');
    }, 4500); 
    return () => clearTimeout(timer);
  }, []);

  useEffect(() => {
    document.documentElement.classList.toggle('dark', theme === 'dark');
    localStorage.setItem('theme', theme);
  }, [theme]);

  // Login: Decrypt ETH wallet to get entropy, then derive Aptos Account
  const handleLogin = async (decryptedWallet: ethers.Wallet, password: string) => {
    try {
        let aptosAccount: Account;
        
        // Try to derive from mnemonic if available
        if (decryptedWallet.mnemonic?.phrase) {
            aptosAccount = PhotonService.getAptosAccountFromMnemonic(decryptedWallet.mnemonic.phrase);
        } else {
            // Fallback: If wallet was restored from JSON without mnemonic metadata, use private key
            aptosAccount = PhotonService.getAptosAccountFromEthPrivateKey(decryptedWallet.privateKey);
        }
        
        setActiveAccount(aptosAccount);
        setSessionPassword(password);
        setAppState('loggedIn');
    } catch (e) {
        console.error("Login failed", e);
        addToast("Error", "Failed to derive Aptos account.");
    }
  };

  const handleLogout = () => { setActiveAccount(null); setSessionPassword(null); setAppState('walletGate'); };
  const handleResetWallet = () => { localStorage.removeItem('userWallets'); setStoredWallets([]); setActiveWalletIndex(0); setActiveAccount(null); };

  const fetchWalletBalances = useCallback(async (): Promise<TokenWithBalance[]> => {
    if (!activeAccount) return [];
    try {
        const balance = await AptosService.getAccountBalance(activeAccount.accountAddress.toString());
        return [{ symbol: 'APT', name: 'Aptos Coin', balance: balance, logo: 'https://cryptologos.cc/logos/aptos-apt-logo.png' }];
    } catch (error) {
        console.error("Error fetching balance:", error);
        return [];
    }
  }, [activeAccount]);

  const fetchHistory = useCallback(async () => {
      setIsHistoryLoading(true);
      if (!activeAccount) return;
      const txs = await AptosService.getAccountTransactions(activeAccount.accountAddress.toString());
      setTransactions(txs.map(tx => ({ ...tx, usdAmount: tx.tokenAmount * (priceData['APT']?.price ?? 0) })));
      setIsHistoryLoading(false);
  }, [activeAccount, priceData]);

  const refreshAllData = useCallback(async () => {
    if (!activeAccount) return;
    setIsMarketLoading(true);
    const [userTokens, topCoins] = await Promise.all([fetchWalletBalances(), fetchTopCoins(50)]);
    setTokensWithBalance(userTokens);
    
    const pricingMap = new Map<string, TokenForPricing>();
    userTokens.forEach(t => pricingMap.set(t.symbol, { symbol: t.symbol }));
    topCoins.forEach(t => pricingMap.set(t.symbol, { symbol: t.symbol }));
    
    const newPriceData = await fetchTokenPricesAndChanges(Array.from(pricingMap.values()));
    setPriceData(newPriceData);
    setMarketTokens(topCoins.map(coin => ({
        symbol: coin.symbol, name: coin.name, logo: coin.logo,
        price: newPriceData[coin.symbol]?.price ?? 0,
        priceChangePercentage24h: newPriceData[coin.symbol]?.change24h ?? 0,
        sparkline_7d: newPriceData[coin.symbol]?.sparkline_7d,
        balance: '0', usdValue: 0,
    })).filter(t => t.price > 0));
    setIsMarketLoading(false);
  }, [activeAccount, fetchWalletBalances]);

  useEffect(() => { if (appState === 'loggedIn' && activeAccount) { refreshAllData(); const i = setInterval(refreshAllData, 60000); return () => clearInterval(i); } }, [appState, activeAccount, refreshAllData]);
  useEffect(() => { if (appState === 'loggedIn' && activeAccount && Object.keys(priceData).length > 0) fetchHistory(); }, [appState, activeAccount, priceData, fetchHistory]);

  const processedWallet = useMemo((): ProcessedWallet => {
      let totalValueNow = 0;
      const tokens = tokensWithBalance.map(tb => {
          const market = priceData[tb.symbol];
          const usdValue = parseFloat(tb.balance) * (market?.price ?? 0);
          totalValueNow += usdValue;
          return { ...tb, price: market?.price ?? 0, usdValue, priceChangePercentage24h: market?.change24h ?? 0, sparkline_7d: market?.sparkline_7d };
      }).sort((a, b) => b.usdValue - a.usdValue);
      return {
          name: 'Aptos Account',
          address: activeAccount?.accountAddress.toString() || '',
          tokens,
          chain: 'Aptos' as any,
          totalUsdValue: totalValueNow,
          change24h: { percentage: 0, absolute: 0 } // simplified
      };
  }, [tokensWithBalance, priceData, activeAccount]);

  const renderView = () => {
      if (!activeAccount) return null;
      // Pass activeAccount as "signer" prop where expected, casting to any since components were expecting ethers.Wallet
      const accountAsSigner = activeAccount as any; 
      switch (view) {
          case 'home': return <Home signer={accountAsSigner} wallet={processedWallet} marketTokens={marketTokens} isLoading={isMarketLoading} allWallets={storedWallets} activeWalletIndex={activeWalletIndex} activeNetwork={activeNetwork} networks={NETWORKS} onSelectNetwork={()=>{}} onSwitchWallet={()=>{}} onAddWallet={()=>{}} onRefresh={refreshAllData} />;
          case 'news': return <News />;
          case 'jobs_events': return <JobsAndEvents />;
          case 'assistant': return <Assistant wallet={processedWallet} signer={accountAsSigner} activeNetwork={activeNetwork} />;
          case 'charts': return <Charts theme={theme} />;
          case 'decibel': return <DecibelMarkets theme={theme} />;
          case 'history': return <TransactionHistory transactions={transactions} isLoading={isHistoryLoading} onRefresh={fetchHistory} />;
          case 'courses': return <Courses />;
          case 'alerts': return <Alerts priceData={priceData} />;
          case 'defi': return <DeFi />;
          case 'launch': return <Launchpad />;
          case 'settings': return <Settings signer={accountAsSigner} sessionPassword_DO_NOT_USE_DIRECTLY={sessionPassword!} storedWallets={storedWallets} activeWalletIndex={activeWalletIndex} onUpdateName={()=>{}} wallet={processedWallet} theme={theme} onUpdateTheme={setTheme} />;
          default: return null;
      }
  };

  if (appState === 'loading') return <SplashScreen />;
  if (appState === 'onboarding') return <Onboarding onOnboardingComplete={() => { localStorage.setItem('hasOnboarded', 'true'); setAppState('walletGate'); }} />;
  if (appState === 'walletGate' || !activeAccount) return <WalletGate onLogin={handleLogin} walletsJson={JSON.stringify(storedWallets)} activeIndex={activeWalletIndex} onResetWallet={handleResetWallet} />;

    const navAccentColor = view === 'home' ? '#10b981' : '#f4ffb8';

  return (
    <div className={`h-screen w-screen ${bgClass} text-slate-800 dark:text-white font-sans relative overflow-hidden`}>
        <CryptoBackground3D />
        <ToastContainer toasts={toasts} onDismiss={(id) => setToasts(p => p.filter(t => t.id !== id))} />
        <div className="fixed top-4 left-4 right-4 z-20 p-[1px] rounded-2xl overflow-hidden">
            <div className="absolute inset-[-200%] animate-[spin_4s_linear_infinite]" style={{ background: `conic-gradient(from 90deg at 50% 50%, #0000 0%, ${navAccentColor} 50%, #0000 100%)` }} />
            <header className="relative z-10 h-16 grid grid-cols-[1fr_auto_1fr] items-center px-4 bg-white/60 dark:bg-black/80 backdrop-blur-xl transition-colors duration-300 rounded-[15px]">
                <div className="flex justify-start"><AppLogoIcon className="w-10 h-10" /></div>
                <div className="text-center animate-fade-in-up"><h1 className="text-lg font-bold tracking-tight text-slate-900 dark:text-white truncate px-2">{VIEW_TITLES[view]}</h1></div>
                <div className="flex justify-end items-center gap-2">
                     <button className="p-2 text-gray-500 dark:text-gray-300 hover:text-black dark:hover:text-white transition-colors" onClick={() => setView('alerts')}><BellIcon className="w-6 h-6" /></button>
                    <button onClick={() => setIsMenuOpen(!isMenuOpen)} className="p-2 text-gray-500 dark:text-gray-300 hover:text-black dark:hover:text-white transition-colors"><MenuIcon className="w-7 h-7" /></button>
                </div>
            </header>
        </div>
        <Menu isOpen={isMenuOpen} onClose={() => setIsMenuOpen(false)} onNavigate={(v) => {setView(v as View)}} onLogout={handleLogout} currentView={view} />
        <main className="h-full overflow-y-auto pt-24 pb-24">{renderView()}</main>
        <nav className="fixed bottom-0 left-0 right-0 h-28 z-30">
            <div className="absolute inset-0 bg-white/80 dark:bg-gradient-to-b dark:from-black/90 dark:to-black/95 backdrop-blur-2xl" style={{ maskImage: `url("data:image/svg+xml,%3csvg viewBox='0 0 375 112' preserveAspectRatio='none' xmlns='http://www.w3.org/2000/svg'%3e%3cpath d='M 0 112 L 0 64 A 32 32 0 0 1 32 32 L 142.5 32 C 152.5 0, 222.5 0, 232.5 32 L 343 32 A 32 32 0 0 1 375 64 L 375 112 Z' fill='black' /%3e%3c/svg%3e")`, maskSize: '100% 100%', WebkitMaskImage: `url("data:image/svg+xml,%3csvg viewBox='0 0 375 112' preserveAspectRatio='none' xmlns='http://www.w3.org/2000/svg'%3e%3cpath d='M 0 112 L 0 64 A 32 32 0 0 1 32 32 L 142.5 32 C 152.5 0, 222.5 0, 232.5 32 L 343 32 A 32 32 0 0 1 375 64 L 375 112 Z' fill='black' /%3e%3c/svg%3e")`, WebkitMaskSize: '100% 100%' }} />
            <svg className="absolute inset-0 w-full h-full pointer-events-none" viewBox="0 0 375 112" preserveAspectRatio="none">
                 <defs><filter id="nav-glow"><feGaussianBlur stdDeviation="1.5" /></filter></defs>
                <path d="M 0 64 A 32 32 0 0 1 32 32 L 142.5 32 C 152.5 0, 222.5 0, 232.5 32 L 343 32 A 32 32 0 0 1 375 64" fill="none" className="stroke-gray-200/80 dark:stroke-white/10" strokeWidth="1" />
                 <path d="M 0 64 A 32 32 0 0 1 32 32 L 142.5 32 C 152.5 0, 222.5 0, 232.5 32 L 343 32 A 32 32 0 0 1 375 64" fill="none" stroke={navAccentColor} strokeWidth="1" filter="url(#nav-glow)"><animate attributeName="stroke-opacity" values="0.3; 1; 0.3" dur="4s" repeatCount="indefinite" /></path>
            </svg>
            <div className="relative flex justify-around items-center h-full px-2 pb-[env(safe-area-inset-bottom)]">
                <CyberNavItem icon={<HomeIcon />} label="Home" isActive={view === 'home'} onClick={() => setView('home')} accentColor={navAccentColor} />
                <CyberNavItem icon={<RocketIcon />} label="Launch" isActive={view === 'launch'} onClick={() => setView('launch')} accentColor={navAccentColor} />
                <div className="w-16 h-16" aria-hidden="true">
                    <button onClick={() => setView('assistant')} className={`absolute left-1/2 -translate-x-1/2 top-2 w-16 h-16 rounded-full flex items-center justify-center transition-all duration-300 transform hover:scale-110 bg-black border group relative shadow-lg ${view === 'assistant' ? `shadow-[0_0_20px_${navAccentColor}] border-[${navAccentColor}]/30` : `dark:shadow-[${navAccentColor}]/10 group-hover:shadow-xl dark:group-hover:shadow-[${navAccentColor}]/30 border-[${navAccentColor}]/30`}`} style={{ borderColor: `${navAccentColor}4D` }}>
                        <div className={`absolute inset-0 rounded-full animate-spin transition-opacity duration-500 ${view === 'assistant' ? 'opacity-100' : 'opacity-0 group-hover:opacity-100'}`} style={{ animationDuration: '3s', background: `conic-gradient(from 90deg at 50% 50%, #0000 0%, ${navAccentColor} 50%, #0000 100%)` }} />
                        <div className="absolute inset-[2px] rounded-full bg-black" />
                        <AssistantIcon className={`relative w-9 h-9 transition-colors duration-300`} style={{ color: view === 'assistant' ? navAccentColor : '#9ca3af' }} />
                    </button>
                </div>
                <CyberNavItem icon={<CurrencyDollarIcon />} label="Decibel" isActive={view === 'decibel'} onClick={() => setView('decibel')} accentColor={navAccentColor} />
                <CyberNavItem icon={<ClipboardIcon />} label="History" isActive={view === 'history'} onClick={() => setView('history')} accentColor={navAccentColor} />
            </div>
        </nav>
    </div>
  );
};

export default App;
