export const districtNameTrimmer = (districtName) => {
  var lastIndex = districtName.lastIndexOf(" ");
  districtName = districtName.substring(0, lastIndex);
  return districtName;
};

export const normalizeDistrictName = (districtName) => {
  let namesArr = [];
  let i = '';
  namesArr = districtName.split(' ');
  namesArr.forEach((name) => {
    i = i + name.toLowerCase();
  });
  return i;
};


