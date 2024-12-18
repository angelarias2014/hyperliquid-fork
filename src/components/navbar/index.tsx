import { NavbarContainer, TradingAccSwitcherBtn } from '@/styles/navbar.styles';
import { Box } from '@mui/material';
import { useAddress } from '@thirdweb-dev/react';
import { useRouter } from 'next/router';
import UpDownIcon from '../../../public/upDownIcon';
import WalletConnectModal from '../wallet-connect';

const Navbar = () => {
  //------Hooks------
  const userAddress = useAddress();

  //------Router------
  const router = useRouter();

  //------Local State------

  return (
    <NavbarContainer>
      <Box className="user-config">
        {userAddress ? (
          <Box sx={{ position: 'relative' }}>
            {userAddress.slice(0, 6) + '...' + userAddress.slice(-4)}
          </Box>
        ) : (
          <WalletConnectModal />
        )}
      </Box>
    </NavbarContainer>
  );
};

export default Navbar;
