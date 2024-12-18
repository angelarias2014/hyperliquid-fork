import { RiskManagerWrapper } from '@/styles/riskManager.styles';
import { useState } from 'react';
import MarginTypeModal from '../Modals/marginTypeModal';
import MarketComponent from './market';

// Interface to define the shape of the modals state
interface optionsProps {
  [key: string]: any;
  riskManager: boolean;
  leverage: boolean;
  marginType: boolean;
}

const OrderPlacementTerminal = () => {
  // ------Modal Visibility states------
  const [modals, setModals] = useState<optionsProps>({
    riskManager: false,
    leverage: false,
    marginType: false,
  });

  // Close a specific modal and reset the active button
  const closeModal = (modalType: string) => {
    setModals({
      ...modals,
      [modalType]: false,
    });
  };

  return (
    <RiskManagerWrapper id="order-placement-terminal">
      {modals.marginType && (
        <MarginTypeModal onClose={() => closeModal('marginType')} />
      )}

      {/* Conditionally render components based on active tab */}
      <MarketComponent />
    </RiskManagerWrapper>
  );
};

export default OrderPlacementTerminal;
