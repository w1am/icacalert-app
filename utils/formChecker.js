export const checkEmail = (em) => {
  let atFormat = em.split('@');
  let dotFormat = em.split('.');
  if (atFormat.length == 2 && ((dotFormat[0].indexOf('@') > 0) && (dotFormat[1] == 'com'))) {
    return true
  }
  return false
}

export const checkPhone = (ph) => {
  let phone = parseInt(ph);
  if (phone.toString().length == 8) {
    if (ph.slice(0, 1) == '5') {
      return true
    }
  } else {
    return false
  }
}
