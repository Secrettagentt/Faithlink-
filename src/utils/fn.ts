export const formatNumber = (num: number = 0) => {
  if (num >= 1_000_000_000_000 && num < 1_000_000_000_000_000) {
    const trillions = num / 1_000_000_000_000;
    return Number.isInteger(trillions)
      ? trillions + "T"
      : (Math.floor(trillions * 10) / 10).toFixed(1) + "T";
  } else if (num >= 1_000_000_000 && num < 1_000_000_000_000) {
    const billions = num / 1_000_000_000;
    return Number.isInteger(billions)
      ? billions + "B"
      : (Math.floor(billions * 10) / 10).toFixed(1) + "B";
  } else if (num >= 1_000_000 && num < 1_000_000_000) {
    const millions = num / 1_000_000;
    return Number.isInteger(millions)
      ? millions + "M"
      : (Math.floor(millions * 10) / 10).toFixed(1) + "M";
  } else if (num >= 1_000 && num < 1_000_000) {
    const thousands = num / 1_000;
    return Number.isInteger(thousands)
      ? thousands.toString() + "K"
      : thousands.toFixed(1) + "K";
  } else {
    return Number.isInteger(num) ? num.toString() : num.toFixed(0);
  }
};
