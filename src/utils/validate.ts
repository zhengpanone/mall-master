export const isValidUsername=(str:string)=> {
  // const valid_map = ['admin', 'test']
  // return valid_map.indexOf(str.trim()) >= 0
  return str.trim().length>=3
}

/* 合法uri*/
export const validateURL=(textVal:string)=> {
  const urlRegex = /^(https?|ftp):\/\/([a-zA-Z0-9.-]+(:[a-zA-Z0-9.&%$-]+)*@)*((25[0-5]|2[0-4][0-9]|1[0-9]{2}|[1-9][0-9]?)(\.(25[0-5]|2[0-4][0-9]|1[0-9]{2}|[1-9]?[0-9])){3}|([a-zA-Z0-9-]+\.)*[a-zA-Z0-9-]+\.(com|edu|gov|int|mil|net|org|biz|arpa|info|name|pro|aero|coop|museum|[a-zA-Z]{2}))(:[0-9]+)*(\/($|[a-zA-Z0-9.,?'\\+&%$#=~_-]+))*$/
  return urlRegex.test(textVal)
}

/* 小写字母*/
export const validateLowerCase=(str:string)=> {
  const reg = /^[a-z]+$/
  return reg.test(str)
}

/* 大写字母*/
export const validateUpperCase=(str:string)=> {
  const reg = /^[A-Z]+$/
  return reg.test(str)
}

/* 大小写字母*/
export const validateAlphabets=(str:string)=> {
  const reg = /^[A-Za-z]+$/
  return reg.test(str)
}

