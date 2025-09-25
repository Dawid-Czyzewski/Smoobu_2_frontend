export const formatPrice = (price) => {
  if (!price) return null;
  
  const numPrice = parseFloat(price);
  if (isNaN(numPrice)) return price;
  
  const formatted = numPrice % 1 === 0 ? numPrice.toString() : numPrice.toFixed(2).replace(/\.?0+$/, '');
  
  return `€${formatted}`;
};

export const formatVat = (vat) => {
  if (!vat) return null;
  
  const numVat = parseFloat(vat);
  if (isNaN(numVat)) return vat;
  
  const formatted = numVat % 1 === 0 ? numVat.toString() : numVat.toFixed(2).replace(/\.?0+$/, '');
  
  return `${formatted}%`;
};
