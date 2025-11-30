
import { ethers } from 'ethers';
import { Account, Ed25519PrivateKey } from "@aptos-labs/ts-sdk";

// Photon SDK Wrapper for Aptos
// We use ethers ONLY for its robust Keystore V3 encryption compatible with the existing WalletGate.
// The private key generated is used to derive an Aptos Account.

export class PhotonService {
    
    // Create an Aptos Account and return the Mnemonic
    static createHDWallet(): string {
        const account = Account.generate();
        // Since the TS SDK simple Account.generate() doesn't expose a mnemonic easily in the browser version without extra packages,
        // we will stick to the previous entropy method: Generate random entropy -> Mnemonic -> Use Key.
        // For simplicity in this environment:
        const wallet = ethers.Wallet.createRandom();
        return wallet.mnemonic!.phrase;
    }

    // Recover an Aptos Account from Mnemonic (Using the ETH path entropy for simplicity in this hybrid setup)
    static getAptosAccountFromMnemonic(mnemonic: string): Account {
        // In a real production app, we'd use Aptos-specific derivation paths (m/44'/637'/...).
        // Here we use the entropy of the mnemonic to deterministically seed an Ed25519 key.
        const wallet = ethers.Wallet.fromPhrase(mnemonic);
        // Use the 32-byte private key as the seed for Ed25519
        const privateKeyBytes = ethers.getBytes(wallet.privateKey);
        const privateKey = new Ed25519PrivateKey(privateKeyBytes);
        return Account.fromPrivateKey({ privateKey });
    }

    // Recover an Aptos Account directly from an ETH Private Key (Fallback)
    static getAptosAccountFromEthPrivateKey(ethPrivateKey: string): Account {
        const privateKeyBytes = ethers.getBytes(ethPrivateKey);
        const privateKey = new Ed25519PrivateKey(privateKeyBytes);
        return Account.fromPrivateKey({ privateKey });
    }

    // "Seedless Cloud Backup"
    static async cloudBackup(mnemonic: string, password: string): Promise<boolean> {
        await new Promise(resolve => setTimeout(resolve, 1500));
        try {
            const dummyWallet = ethers.Wallet.fromPhrase(mnemonic);
            const encryptedJson = await dummyWallet.encrypt(password);
            localStorage.setItem('photon_cloud_backup', encryptedJson);
            return true;
        } catch (e) {
            console.error("Cloud backup failed", e);
            return false;
        }
    }

    // "Restore from Cloud"
    static async cloudRestore(password: string): Promise<string | null> {
        await new Promise(resolve => setTimeout(resolve, 1500));
        const backup = localStorage.getItem('photon_cloud_backup');
        if (!backup) throw new Error("No cloud backup found.");

        try {
            const wallet = await ethers.Wallet.fromEncryptedJson(backup, password);
            const phrase = (wallet as any).mnemonic?.phrase;
            return phrase || null;
        } catch (e) {
            throw new Error("Incorrect password or corrupt backup.");
        }
    }
    
    static hasCloudBackup(): boolean {
        return !!localStorage.getItem('photon_cloud_backup');
    }
}
