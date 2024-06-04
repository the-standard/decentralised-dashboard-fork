import { useState, useMemo, useEffect } from "react";
import { useLocation, useSearchParams } from 'react-router-dom';

import PoolV1 from "../../components/liquidation-pools/V1/PoolV1";
import PoolV2 from "../../components/liquidation-pools/V2/PoolV2";

function useQuery() {
  const { search } = useLocation();
  return useMemo(() => new URLSearchParams(search), [search]);
}

const LiquidationPools = () => {
  const query = useQuery();
  const [searchParams, setSearchParams] = useSearchParams();
  const queryView = query.get("v") || 'V2';

  const [activeView, setActiveView] = useState();

  const handleSetActiveView = (e) => {
    setSearchParams(`v=${e.target.value}`);
  };

  useEffect(() => {
    setActiveView(queryView)
  }, [queryView]);

  if (activeView === 'V1') {
    return (
     <PoolV1 setActiveView={setActiveView} activeView={activeView}/>
    )
  }

  return (
    <PoolV2 setActiveView={handleSetActiveView} activeView={activeView}/>
  );
};

export default LiquidationPools;