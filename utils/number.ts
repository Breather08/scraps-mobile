export const truncToPrecision = (num: number, precision = 0) =>
  Math.floor(num * 10 ** precision) / 10 ** precision;

export const formatNumber = (
  num: number,
  {
    suffix = "",
    prefix = "",
    precision = 0,
    locale = "ru-RU" as Intl.LocalesArgument,
  } = {}
) => {
  const rounded = truncToPrecision(num, precision);

  return `${prefix ? prefix + "\xA0" : ""}${Intl.NumberFormat(locale).format(
    rounded
  )}${suffix ? "\xA0" + suffix : ""}`;
};
