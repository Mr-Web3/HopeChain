import {
  ConnectWallet,
  Wallet,
  WalletDropdown,
  WalletDropdownDisconnect,
} from '@coinbase/onchainkit/wallet';
import { Address, Avatar, Name, Identity } from '@coinbase/onchainkit/identity';

export function WalletComponents() {
  return (
    <div className='flex items-center md:w-20 justify-end'>
      <Wallet className='z-10'>
        <ConnectWallet className=' font-orbitron bg-transparent border border-primary text-white rounded-full hover:bg-transparent'>
          <Name className='text-inherit text-white' />
        </ConnectWallet>
        <WalletDropdown className='z-50 mt-1 bg-[#000000]'>
          <Identity
            className='px-4 pt-3 pb-2 bg-transparent text-white'
            hasCopyAddressOnClick
          >
            <Avatar />
            <Name className='font-orbitron text-white' />
            <Address className='font-orbitron text-white' />
          </Identity>
          <WalletDropdownDisconnect className='bg-transparent text-red-500 hover:bg-transparent' />
        </WalletDropdown>
      </Wallet>
    </div>
  );
}
