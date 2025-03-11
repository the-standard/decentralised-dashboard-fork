import { useState, useEffect } from "react";
import { ethers } from "ethers";
import { Link, useNavigate } from "react-router-dom";

import {
  Tooltip,
  Progress,
} from 'react-daisyui';

import {
  useCurrentPageStore,
  usesUSDVaultListPageStore,
  usesEURVaultListPageStore,
} from "../../store/Store";

import Card from "../ui/Card";
import Pagination from "../ui/Pagination";
import CenterLoader from "../ui/CenterLoader";
import Typography from "../ui/Typography";

import seurologo from "../../assets/EUROs.svg";
import susdlogo from "../../assets/USDs.svg";

import LiquidationItem from "./LiquidationItem";
import ListItemLoader from "./ListItemLoader";

const LiquidationsList = (props) => {
  const { items, USDsBalance } = props;
  const [renderedItems, setRenderedItems] = useState([]);
  const [currentIndex, setCurrentIndex] = useState(0);
  const [isComplete, setIsComplete] = useState(false);

  // Handle completion of an item
  const handleItemComplete = (index, data, error) => {
    setRenderedItems(prev => {
      // Find if this item is already in the results
      const existingIndex = prev.findIndex(item => item.originalIndex === index);
      
      // Create the result object
      const result = {
        originalIndex: index,
        item: items[index],
        data,
        error,
        timestamp: new Date()
      };
      
      // Either update existing or append
      if (existingIndex >= 0) {
        const newResults = [...prev];
        newResults[existingIndex] = result;
        return newResults;
      } else {
        return [...prev, result];
      }
    });
    
    // Move to next item if this was the current one
    if (index === currentIndex && currentIndex < items.length - 1) {
      setCurrentIndex(prev => prev + 1);
    } else if (index === currentIndex) {
      setIsComplete(true);
    }
  };

  const totalVaults = items.length;

  const vaultsLoading = totalVaults - (currentIndex + 1);

  return (
    <Card className="card-compact mb-4">
      <div className="card-body overflow-x-scroll">
        <Typography variant="h2" className="card-title flex gap-0">
          Vaults At Risk
        </Typography>

        <div className="sequential-contract-reader">
          <table className="table">
            <thead>
              <tr>
                <th className="hidden md:table-cell">Type</th>
                <th className="hidden md:table-cell">Vault ID</th>
                <th>
                  Collateral
                  <span className="hidden md:inline-block">&nbsp;Value</span>
                  &nbsp;($)
                </th>
                <th>Debt (USDs)</th>
                <th>
                  Claimable
                  <span className="hidden md:inline-block">&nbsp;Value</span>
                  &nbsp;($)
                </th>
                <th className="hidden md:table-cell">Ratio</th>
              </tr>
            </thead>
            <tbody>
              {items.length >= 1 ? (
                <>
                  {items.slice(0, currentIndex + 1).map((item, index) => (
                    <LiquidationItem
                      key={`${item.tokenId}-${index}`}
                      item={item}
                      index={index}
                      onComplete={handleItemComplete}
                      USDsBalance={USDsBalance}
                    />
                  ))}
                  {Array.from(
                    { length: vaultsLoading },
                    (_, i) => (
                      <ListItemLoader index={i} />
                    )
                  )}
                </>
              ) : (
                <tr>
                  <td colSpan="6" className="text-center">
                    No vaults currently at risk of liquidation
                  </td>
                </tr>
              )}
            </tbody>
          </table>
        </div>

      </div>
    </Card>
  );
};

export default LiquidationsList;