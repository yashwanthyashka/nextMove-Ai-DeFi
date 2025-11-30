
import React from 'react';
import type { Network } from './types';
import { AptosIcon } from './components/Icons';

export const NETWORKS: Network[] = [
    {
        id: 'aptos-testnet',
        name: 'Aptos',
        type: 'Testnet',
        longName: 'Aptos Testnet',
        icon: (props) => React.createElement(AptosIcon, { ...props, style: { color: '#89F336' } }),
        chainId: 2,
        rpcUrl: 'https://fullnode.testnet.aptoslabs.com/v1',
        currencySymbol: 'APT',
        currencyName: 'Aptos Coin',
        currencyLogo: 'https://cryptologos.cc/logos/aptos-apt-logo.png',
        explorerUrl: 'https://explorer.aptoslabs.com/?network=testnet',
        tags: [{ text: 'Active', color: 'bg-[#89F336]/20 text-[#89F336]' }, { text: 'Move VM', color: 'bg-blue-500/20 text-blue-400' }],
    }
];
