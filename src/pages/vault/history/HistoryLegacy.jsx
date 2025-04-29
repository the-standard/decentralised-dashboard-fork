import Card from "../../../components/ui/Card";

const HistoryLegacy = ({vaultNav}) => {

  return (
    <div>
      <Card className="card-compact">
        <div className="card-body overflow-x-scroll">
          {vaultNav()}

          <div role="alert" className="alert alert-warning bg-yellow-400/20 mb-2">
            <span>
              <b>History Unavailable</b>
              <br/>
              Vault history is currently not available for older vault versions.
            </span>
          </div>
          <table className="table table-zebra">
            <thead>
              <tr>
                <th>Type</th>
                <th>Time</th>
                <th>Asset</th>
                <th>Amount</th>
                <th>Minted (EUROs)</th>
                <th>Total Collateral Value (€)</th>
                <th>&nbsp;</th>
              </tr>
            </thead>
          </table>
          <div className="card-actions pt-4 justify-between items-center">
            <div>&nbsp;</div>
          </div>
        </div>
       
      </Card>
    </div>
  )
};

export default HistoryLegacy;
