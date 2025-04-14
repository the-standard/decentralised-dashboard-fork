export const formatNumber = (value, decimals) => {
  if (value === null || value === undefined || value === '') {
    return '';
  }
  const numValue = typeof value === 'string' ? parseFloat(value) : value;
  if (isNaN(numValue)) {
    return '';
  }
  if (decimals === null) {
    return numValue.toLocaleString();
  } else {
    return numValue.toLocaleString(undefined, {
      minimumFractionDigits: decimals,
      maximumFractionDigits: decimals
    });
  }
};

export const formatCurrency = (currency, value, decimals = 2) => {
  const formatted = formatNumber(value, decimals);
  return formatted ? `${currency}${formatted}` : '';
};
