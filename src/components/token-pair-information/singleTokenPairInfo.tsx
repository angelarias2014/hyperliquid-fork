import React from 'react';
import { TokenPairsWrapper } from '@/styles/tokenPairs.styles';
import { Box } from '@mui/material';
import UpDownIcon from '../../../public/upDownIcon';
import { usePairTokensContext } from '@/context/pairTokensContext';

interface SingleTokenPairInfoProps {
  tableisopen: boolean;
  toggleTablePairs: () => void;
}

const PairDetail = ({ label, value, isRed }: any) => (
  <Box className="pairDetails">
    <span>{label}</span>
    <span className={isRed ? 'value toRed' : 'value'}>{value}</span>
  </Box>
);

const SingleTokenPairInfo = ({
  tableisopen,
  toggleTablePairs,
}: SingleTokenPairInfoProps) => {
  const { tokenPairData, assetId, selectedPairsTokenData } =
    usePairTokensContext();

  const pairDataInformation = () => {
    if (tokenPairData.length > 0) {
      return tokenPairData[assetId];
    } else {
      return selectedPairsTokenData;
    }
  };

  return (
    <TokenPairsWrapper tableisopen={tableisopen}>
      <Box className="pair_tokens" onClick={toggleTablePairs}>
        <span>{pairDataInformation()?.pairs}</span>
        <div className="upDownIcon">
          <UpDownIcon />
        </div>
      </Box>
    </TokenPairsWrapper>
  );
};

export default SingleTokenPairInfo;
