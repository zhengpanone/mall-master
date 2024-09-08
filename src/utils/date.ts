// date.ts
export const formatDate = (date: Date, fmt: string): string => {
  if (/(y+)/.test(fmt)) {
    fmt = fmt.replace(RegExp.$1, (date.getFullYear() + '').substr(4 - RegExp.$1.length));
  }
  const o: { [key: string]: number } = {
    'M+': date.getMonth() + 1,
    'd+': date.getDate(),
    'h+': date.getHours(),
    'm+': date.getMinutes(),
    's+': date.getSeconds()
  };
  for (const k in o) {
    if (new RegExp(`(${k})`).test(fmt)) {
      const str = o[k] + '';
      fmt = fmt.replace(RegExp.$1, (RegExp.$1.length === 1) ? str : padLeftZero(str));
    }
  }
  return fmt;
}

const padLeftZero = (str: string): string => {
  return ('00' + str).substr(str.length);
}

export const str2Date = (dateStr: string, separator: string = "-"): Date => {
  const dateArr = dateStr.split(separator);
  const year = parseInt(dateArr[0], 10);
  let month = parseInt(dateArr[1].replace(/^0/, ''), 10); // 处理月份为04这样的情况
  const day = parseInt(dateArr[2], 10);
  return new Date(year, month - 1, day);
}
