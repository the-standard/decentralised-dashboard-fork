import { useState } from "react";

import { Box, Typography, CircularProgress } from "@mui/material";

import { styled } from '@mui/material/styles';
import { DataGrid, GridColDef } from '@mui/x-data-grid';
import { formatEther } from "viem";

import Button from "../../Button";
import Card from "../../Card";
import TokenIcon from "../../TokenIcon";

import StakingDecreaseModal from "./StakingDecreaseModal";


interface StakingAssetsProps {
  positions;
}

function NoDataOverlay() {
  return (
    <div
      sx={{
        display: 'flex',
        flexDirection: 'column',
        alignItems: 'center',
        justifyContent: 'center',
        height: '100%',
      }}
    >
      <div sx={{ mt: 1, color: "white" }}>No Data</div>
    </div>
  );
}

const StakingAssets: React.FC<StakingAssetsProps> = ({
  positions,
}) => {
  const [open, setOpen] = useState(false);

  const [paginationModel, setPaginationModel] = useState({
    page: 0,
    pageSize: 10,
  });

  if (!positions) {
    return (
      <Card
        sx={{
          padding: "1.5rem",
        }}
      >
        <div
        sx={{
          minHeight: "250px",
          display: "flex",
          justifyContent: "center",
          alignItems: "center",
          flexDirection: "column",
        }}
        >
          <CircularProgress size="4rem" />
        </div>
      </Card>
    )  
  }

  const tstAmount = positions[1] || 0;
  const eurosAmount = positions[2] || 0;

  const useRows = [
    {
      asset: 'TST',
      amount: tstAmount || 0
    },
    {
      asset: 'EUROs',
      amount: eurosAmount || 0
    },
  ]

  const handleCloseModal = () => {
    setOpen(false)
  };

  const colData = [
    {
      minWidth: 90,
      flex: 1,
      field: 'asset',
      headerName: 'Asset',
      sortable: false,
      disableColumnMenu: true,
      renderCell: (params) => {
        const symbol = params?.row?.asset || '';
        return (
          <div
            sx={{
              textTransform: "capitalize",
              display: "flex",
              alignContent: "center",
              justifyContent: "center",
              flexDirection: "row",
              height: "100%",
            }}
          >
            <div sx={{
              display: "flex",
              alignItems: "center",
            }}>
              <TokenIcon
                symbol={symbol}
                style={{ height: "2rem", width: "2rem" }}
              />
            </div>
            <div sx={{
              display: "flex",
              alignItems: "center",
            }}>
              <Typography variant="body2" sx={{marginLeft: "8px"}}>
                {symbol || ''}
              </Typography>
            </div>
          </div>
        );
      },
    },
    {
      minWidth: 90,
      flex: 1,
      field: 'amount',
      headerName: 'Amount',
      sortable: false,
      disableColumnMenu: true,
      renderCell: (params) => {
        let useAmount = 0;
        if (params.row.amount) {
          useAmount = formatEther(params.row.amount.toString());
        }
        return (
          <span style={{textTransform: 'capitalize'}}>
            {useAmount || '0'}
          </span>
        );
      },
    },
  ];

  const columns = colData;
  const rows = useRows || [];

  let noStaked = true;
  if (rows.some(e => e.amount > 0)) {
    noStaked = false;
  }

  const StyledDataGrid = styled(DataGrid)(({ theme }) => ({
    border: 0,
    fontFamily: [
      '"Poppins"',
      'sans-serif',
    ].join(','),
    WebkitFontSmoothing: 'auto',
    letterSpacing: 'normal',
    '& .MuiDataGrid-columnsContainer': {
      backgroundColor: theme.palette.mode === 'light' ? 'red' : 'green',
    },
    '& .MuiDataGrid-iconSeparator': {
      display: 'none',
    },
    '& .MuiDataGrid-columnHeader': {
      color: "#ffffff",
      fontWeight: "bold",
      fontSize: "1rem",
    },
    '& .MuiDataGrid-columnHeaders, & .MuiDataGrid-row': {
      backgroundImage: "linear-gradient( to right, transparent, rgba(255, 255, 255, 0.5) 15%, rgba(255, 255, 255, 0.5) 85%, transparent )",
      backgroundRepeat: "no-repeat",
      backgroundSize: "100% 1px",
      backgroundPosition: "center bottom",
    },
    '& .MuiDataGrid-row, & .MuiDataGrid-columnHeaders, & .MuiDataGrid-columnsContainer, .MuiDataGrid-cell, & .MuiDataGrid-footerContainer': {
      border: "none",
    },
    '& .MuiDataGrid-cell': {
      color: 'rgba(255,255,255,0.9)',
    },
    '& .MuiPaginationItem-root': {
      borderRadius: 0,
    },
    "& .MuiTablePagination-selectLabel, & .MuiDataGrid-menuIconButton, & .MuiDataGrid-sortIcon, & .MuiTablePagination-displayedRows, & .MuiTablePagination-actions, & .MuiIconButton-root": {
      opacity: 1,
      color: "white",
    },
    "& .Mui-disabled": {
      opacity: 0.4,
    },
    '& .MuiDataGrid-menuList': {
      backgroundColor: 'pink',

      '& .MuiMenuItem-root': {
        fontSize: 26,
      },
    },
    "& .MuiSelect-select, & .MuiSelect-icon, & .MuiSvgIcon-root-MuiSelect-icon": {
      fill: "white",
    },
    "& .MuiTablePagination-select, & .MuiInputBase-root-MuiTablePagination-select": {
      color: "white",
    },
    "& .MuiDataGrid-overlay": {
      background: "rgba(0, 0, 0, 0.38)",
    },
  }));

  return (
    <Card
      sx={{
        padding: "1.5rem",
      }}
    >
      <div
        sx={{
          display: "flex",
          justifyContent: "space-between",
        }}
      >
        <Typography
          sx={{
            color: "#fff",
            margin: "0",
            marginBottom: "0rem",
            fontSize: {
              xs: "1.2rem",
              md: "1.5rem"
            }
          }}
          variant="h4"
        >
          Staked Assets
        </Typography>
      </div>
      <StyledDataGrid
        slots={{
          noRowsOverlay: NoDataOverlay,
        }}
        columns={columns}
        // rowCount={totalRows || 0}
        rows={rows || []}
        getRowId={(row) => `${row?.asset}${row?.amount}`}
        disableRowSelectionOnClick
        pageSizeOptions={[5, 10, 15, 20]}
        paginationMode="server"
        paginationModel={paginationModel}
        onPaginationModelChange={setPaginationModel}
        hideFooter={true}
      />
      <div sx={{
        marginTop: "1rem",
        display: "flex",
        flexDirection: {
          xs: "column",
          sm: "row",
        },
        justifyContent: {
          xs: "normal",
          sm: "flex-end",
        },
        alignItems: "center"
      }}>
        <Button
          lighter
          sx={{
            width: {
              xs: "fill-available",
              sm: "unset"
            }
          }}
          clickFunction={() => setOpen(true)}
          isDisabled={noStaked}
        >
          Withdraw
        </Button>
      </div>
      <StakingDecreaseModal
        stakedPositions={rows}
        handleCloseModal={handleCloseModal}
        isOpen={open}
      />
    </Card>
  )
};

export default StakingAssets;
