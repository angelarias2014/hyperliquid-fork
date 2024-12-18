import React, { useState } from 'react';
import SingleTokenPairInfo from './singleTokenPairInfo';
import TokenPairsInfoTable from './tokenPairsInfoTable';
import { Box } from '@mui/material';

const TokenPairInformation = () => {
  const [tableisopen, setTableisopen] = useState(false);

  const toggleTablePairs = () => {
    setTableisopen((prev) => !prev);
  };

  return (
    <Box sx={{ position: 'relative' }}>
      <SingleTokenPairInfo
        tableisopen={tableisopen}
        toggleTablePairs={toggleTablePairs}
      />
      {tableisopen && (
        <TokenPairsInfoTable
          handleClose={toggleTablePairs}
          tableisopen={tableisopen}
        />
      )}
    </Box>
  );
};

export default TokenPairInformation;
