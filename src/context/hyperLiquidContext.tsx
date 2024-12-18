import React, {
  createContext,
  Dispatch,
  ReactNode,
  SetStateAction,
  useContext,
  useEffect,
  useState,
} from 'react';
import { useAddress, useChainId } from '@thirdweb-dev/react';
import { Chain } from '@/types/hyperliquid';
import { Hyperliquid } from '@/utils/hyperliquid';
import toast from 'react-hot-toast';
import { providers } from 'ethers';
import { useWebDataContext } from './webDataContext';

const BASE_URL =
  process.env.NEXT_PUBLIC_BASE_URL || 'http://localhost:3000/api/hello';

interface AccountsProps {
  hyperliquid: Hyperliquid;
  setHyperliquid: Dispatch<SetStateAction<Hyperliquid>>;
  establishedConnection: boolean;
  setEstablishedConnection: Dispatch<SetStateAction<boolean>>;
  handleEstablishConnection: (props: {
    setIsLoading: Dispatch<SetStateAction<boolean>>;
    setEstablishedConnModal?: Dispatch<SetStateAction<boolean>>;
  }) => void;
}

const SESSION_STORAGE_PREFIX = 'hyperliquid';

const DEFAULT_AGENT = {
  agentAddress: '',
  userAddress: '',
};

const HyperLiquidContext = createContext({} as AccountsProps);

export const useHyperLiquidContext = () => {
  const context = useContext(HyperLiquidContext);
  if (!context) {
    throw new Error('context must be used within a HyperliquidProvider');
  }
  return context;
};

const HyperliquidProvider = ({ children }: { children: ReactNode }) => {
  //-------Hooks------
  const userAddress = useAddress();

  const chainId = useChainId();
  const { webData2 } = useWebDataContext();

  const agentAddressFromWebdata = webData2.agentAddress;
  let sessionAgentKey =
    userAddress &&
    `${SESSION_STORAGE_PREFIX}.agent.${userAddress.toLowerCase()}`;
  console.log('userAddress: ', userAddress, sessionAgentKey);

  //------Local State------
  const [establishedConnection, setEstablishedConnection] = useState(false);
  const [agent, setAgent] = useState(DEFAULT_AGENT);

  //------Hyperliquid------
  const [hyperliquid, setHyperliquid] = useState(
    new Hyperliquid(`${BASE_URL}`)
  );

  //establish connection
  const handleEstablishConnection = async ({
    setIsLoading,
    setEstablishedConnModal,
  }: {
    setIsLoading: Dispatch<SetStateAction<boolean>>;
    setEstablishedConnModal?: Dispatch<SetStateAction<boolean>>;
  }) => {
    try {
      //wallet address when connected to metamask
      if (!userAddress) {
        toast.error('Please connect your wallet to establish connection');
        return;
      }

      setIsLoading(true);
      let signer = new providers.Web3Provider(window.ethereum).getSigner();
      console.log('signer: ', signer);
      {
        // let walletAddress = await signer.getAddress();
        // console.log('walletAddress: ', walletAddress);
        // let {
        //   data: agentAddress,
        //   success,
        //   msg,
        // } = await hyperliquid.connect(walletAddress);

        // console.log('success: ', success);
        // console.log('agentAddress: ', agentAddress);

        // agentAddress = agentAddress as string;
        const agentAddress = '0xf91c175d38d2b37ef78295b134725260ccc168fb';
        const success = true;
        let msg = '';

        if (!success) {
          toast.error(
            (msg || 'Failed to establish connection: try again!').toString()
          );
          setIsLoading(false);
          return;
        }

        {
          // scope to avoid variable name conflict
          let { success, msg } = await hyperliquid.connectAgent(
            signer,
            agentAddress
          );
          console.log('success:', success, msg);
          if (!success) {
            toast.error(
              (msg || 'Failed to establish connection: try again!').toString()
            );
            setIsLoading(false);
            return;
          }
        }
        setIsLoading(false);
        // set agent to session storage
        if (sessionAgentKey) {
          sessionStorage.setItem(
            sessionAgentKey,
            JSON.stringify({
              agentAddress,
              userAddress,
            })
          );
          setAgent({
            agentAddress,
            userAddress,
          });
        }
      }
      toast.success('Connection established successfully!');
      setEstablishedConnection(true);
      setEstablishedConnModal?.(false);
    } catch (error) {
      console.error('error', error);
      toast.error('Failed to establish connection: try again!');
      setIsLoading(false);
    }
  };

  useEffect(() => {
    let chain = chainId === 42161 ? Chain.Arbitrum : Chain.ArbitrumTestnet;
    setHyperliquid(new Hyperliquid(BASE_URL, chain));
  }, [chainId]);

  useEffect(() => {
    let agent = sessionStorage.getItem(
      `hyperliquid.agent.${(userAddress || '').toLowerCase()}`
    );
    let parsedAgent = agent && JSON.parse(agent); // parse agent string from session storage

    // if agent address from webdata is different from agent address in session storage, set establishedConnection to false
    if (agentAddressFromWebdata !== parsedAgent?.agentAddress) {
      setEstablishedConnection(false);
      setAgent(DEFAULT_AGENT);
    } else {
      // if unable to get agent from session storage, set establishedConnection to false
      // set agent to state if it exists
      if (agent) {
        setEstablishedConnection(true);
        setAgent(JSON.parse(agent));
      } else {
        setEstablishedConnection(false);
        setAgent(DEFAULT_AGENT);
      }
    }
  }, [userAddress, webData2]);

  return (
    <HyperLiquidContext.Provider
      value={{
        hyperliquid,
        setHyperliquid,
        establishedConnection,
        setEstablishedConnection,
        handleEstablishConnection,
      }}
    >
      {children}
    </HyperLiquidContext.Provider>
  );
};

export default HyperliquidProvider;
