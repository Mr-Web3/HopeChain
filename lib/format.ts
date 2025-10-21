export const formatUSDC = (n: bigint | number) =>
  (Number(n) / 1e6).toLocaleString('en-US', {
    minimumFractionDigits: 2,
    maximumFractionDigits: 2,
  });
