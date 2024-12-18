import React, { useState } from 'react';
import {
  PositionTabsButtonsWrapper,
  PositionsOrdersHistoryWrapper,
} from '@/styles/positionsOrdersHistory.styles';
import PositionComponentTable from './positions';
import OpenOrdersComponentTable from './openOrders';
import { TabsButtons } from '@/styles/common.styles';

const PositionsOrdersHistory = () => {
  const tabLabels = ['Positions', 'Open Orders'];

  const [activeTab, setActiveTab] = useState(tabLabels[0]);

  const handleTabClick = (tab: string) => {
    setActiveTab(tab);
  };

  return (
    <PositionsOrdersHistoryWrapper>
      <PositionTabsButtonsWrapper>
        {tabLabels.map((label, index) => (
          <TabsButtons
            key={index}
            className={activeTab === label ? 'active' : ''}
            onClick={() => handleTabClick(label)}
          >
            {label}
          </TabsButtons>
        ))}
      </PositionTabsButtonsWrapper>

      {/*tableComponents*/}
      {activeTab === 'Positions' && <PositionComponentTable />}
      {activeTab === 'Open Orders' && <OpenOrdersComponentTable />}
    </PositionsOrdersHistoryWrapper>
  );
};

export default PositionsOrdersHistory;
