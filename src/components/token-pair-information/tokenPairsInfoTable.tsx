import { usePairTokensContext } from '@/context/pairTokensContext';
import {
  PairTableContainer,
  TokenPairsInfoTableWrapper,
} from '@/styles/tokenPairs.styles';
import StarIcon from '@mui/icons-material/Star';
import StarBorderIcon from '@mui/icons-material/StarBorder';
import { Box, ClickAwayListener } from '@mui/material';
import React, { useEffect, useState } from 'react';

interface TokenPairsInfoTableProps {
  handleClose?: () => void;
  tableisopen?: boolean;
  fav?: any;
  setFav?: React.Dispatch<React.SetStateAction<any>>;
  id?: any;
}

//on click of star icon return the filled start else the outlined star
const FavButton = ({ fav, setFav, id }: TokenPairsInfoTableProps) => {
  const handleFavToggle = (id: any) => {
    const newFav = [...fav];
    const indexExists = newFav.indexOf(id) !== -1; //check if the id is already selected
    if (indexExists) {
      // Deselect the row
      setFav?.(newFav.filter((favIndex) => favIndex !== id));
      sessionStorage.setItem(
        'fav',
        JSON.stringify(newFav.filter((favIndex) => favIndex !== id))
      );
    } else {
      // Select the row
      newFav.push(id);
      setFav?.(newFav);

      sessionStorage.setItem('fav', JSON.stringify(newFav));
    }
  };

  return (
    <span className="favButton" onClick={() => handleFavToggle(id)}>
      {fav.includes(id) ? (
        <StarIcon fontSize="small" sx={{ color: '#049260' }} />
      ) : (
        <StarBorderIcon fontSize="small" sx={{ color: '#FFFFFF99' }} />
      )}
    </span>
  );
};

const TokenPairsInfoTable = ({
  tableisopen,
  handleClose,
}: TokenPairsInfoTableProps) => {
  //------Hooks------
  const { tokenPairData, setAssetId, setSelectPairsTokenData } =
    usePairTokensContext();

  //------Local State------
  const [activeTab, setActiveTab] = useState('All'); // Default active tab
  const [fav, setFav] = useState<string[]>([]);
  const [searchQuery, setSearchQuery] = useState('');

  const handleClickTab = (tabName: string) => {
    setActiveTab(tabName);
  };

  const handleSelectPairs = (
    data: any,
    event: any,
    assetId: number | string
  ) => {
    if (event.target.tagName === 'svg' || event.target.tagName === 'path') {
      return;
    }
    setSelectPairsTokenData(data);
    setAssetId(assetId);

    //store to local storage
    sessionStorage.setItem('assetId', JSON.stringify(assetId));
    sessionStorage.setItem('selectPairsTokenData', JSON.stringify(data));
  };

  // Sort the data based on the fav array
  const sortingDataFunction = (tokenPairData: any) => {
    const sortedPairDataArray = [...tokenPairData].sort((a, b) => {
      const isAFav = fav.includes(a.assetId);
      const isBFav = fav.includes(b.assetId);
      if (isAFav && !isBFav) return -1;
      if (!isAFav && isBFav) return 1;
      return 0;
    });
    return sortedPairDataArray;
  };

  // Filter the data based on the search query
  const filteredPairDataArray = tokenPairData?.filter((pairData: any) =>
    pairData.universe.name.toLowerCase().includes(searchQuery.toLowerCase())
  );

  const sortedOrBySearchData = () => {
    if (searchQuery.trim() === '') {
      return sortingDataFunction(tokenPairData);
    } else {
      return sortingDataFunction(filteredPairDataArray);
    }
  };

  useEffect(() => {
    // Load fav from sessionStorage when component mounts
    const savedFav = sessionStorage.getItem('fav');
    if (savedFav && tableisopen) {
      setFav(JSON.parse(savedFav));
    }
  }, [tableisopen]);

  return (
    <ClickAwayListener onClickAway={() => handleClose?.()}>
      <TokenPairsInfoTableWrapper>
        <input
          placeholder="Search coins..."
          value={searchQuery}
          onChange={(e) => setSearchQuery(e.target.value)}
        />

        <Box
          sx={{
            maxHeight: '100%',
            overflowY: 'auto',
            overflowX: 'auto',

            '@media (max-width :599px)': {
              '&::-webkit-scrollbar': {
                display: 'none',
              },
            },
          }}
        >
          <PairTableContainer>
            <thead
              style={{
                position: 'sticky',
                top: '0',
                zIndex: '1',
                background: '#000000',
              }}
            >
              <tr>
                <th>Symbol</th>
              </tr>
            </thead>
            <tbody>
              {sortedOrBySearchData()?.map((pairData, index) => (
                <tr
                  key={index}
                  onClick={(event) =>
                    handleSelectPairs(pairData, event, pairData.assetId)
                  }
                >
                  <td id="centered-content">
                    <span>{pairData.pairs}</span>
                  </td>
                </tr>
              ))}
            </tbody>
          </PairTableContainer>
        </Box>
      </TokenPairsInfoTableWrapper>
    </ClickAwayListener>
  );
};

export default TokenPairsInfoTable;
