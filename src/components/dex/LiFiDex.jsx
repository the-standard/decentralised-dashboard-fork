import React, { useState } from "react";
import Card from "../ui/Card";
import Typography from "../ui/Typography";
import LiFiWidget from "../LiFiWidget";

const LiFiDex = () => {

  return (
    <Card className="card-compact w-full">
      <div className="card-body">
        <Typography variant="h2" className="card-title justify-between">
          Need TST or EUROs?
        </Typography>
        <Typography variant="p" className="mb-2">
          You can easily buy it here with the cross chain DEX below.
        </Typography>
        <LiFiWidget />
      </div>
    </Card>
  );
};

export default LiFiDex;
