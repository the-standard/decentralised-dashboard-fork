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
                  <tr
                    key={i}
                    className="active animate-pulse"
                  >
                    <td className="hidden md:table-cell">
                      <div className="rounded-full bg-base-content h-[42px] w-[42px] opacity-30"></div>
                    </td>
                    <td className="hidden md:table-cell">
                      <div className="rounded-lg bg-base-content h-[12px] w-[38px] opacity-30"></div>
                    </td>
                    <td>
                      <div className="rounded-lg bg-base-content h-[12px] w-[72px] opacity-30"></div>
                    </td>
                    <td>
                      <div className="rounded-lg bg-base-content h-[12px] w-[92px] opacity-30"></div>
                    </td>
                    <td className="hidden md:table-cell">
                      <div className="rounded-lg bg-base-content h-[12px] w-full opacity-30"></div>
                    </td>
                    <td className="text-right flex justify-end">
                      <div className="rounded-lg bg-base-content h-[38px] w-[160px] opacity-30"></div>
                    </td>
                  </tr>
                )
              )}
            </tbody>
          </table>
        </div>

      </div>
    </Card>
  );
};

export default LiquidationsList;