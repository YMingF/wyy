export function limitNumberInRange(val: number, min: number, max: number): number {
  // Math.max(val,min):若val比min都还小，取最大值min
  // Math.min(Math.max(val,min),max)若左边的数值大于max，取最小值,max
  // 总之，目的就是避免百分比的值超出min-max 这个范围
  return Math.min(Math.max(val, min), max);
}

export function getPercent(min: number, max: number, val: number): number {
  return ((val - min) / (max - min)) * 100;
}
