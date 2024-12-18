import React from 'react';
import PairTokensProvider from './pairTokensContext';
import OrderBookTradesProvider from './orderBookTradesContext';
import WebDataProvider from './webDataContext';
import HyperliquidProvider from './hyperLiquidContext';
import OrderHistoryProvider from './orderHistoryContext';

const ContextProviders = ({ children }: { children: React.ReactNode }) => {
  return (
    <WebDataProvider>
      <HyperliquidProvider>
        <PairTokensProvider>
          <OrderBookTradesProvider>
            <OrderHistoryProvider>
              <React.Fragment>{children}</React.Fragment>
            </OrderHistoryProvider>
          </OrderBookTradesProvider>
        </PairTokensProvider>
      </HyperliquidProvider>
    </WebDataProvider>
  );
};

export default ContextProviders;
