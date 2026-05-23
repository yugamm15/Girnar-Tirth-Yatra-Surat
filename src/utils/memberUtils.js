export const generateMemberCode = (name, existingMembers = []) => {
  if (!name) return '';
  const prefix = name.substring(0, 2).toUpperCase();
  
  if (!existingMembers || existingMembers.length === 0) {
    return `${prefix}GYG022`;
  }

  let maxNum = -1;
  let foundBase = false;

  existingMembers.forEach(m => {
    const code = m.code || (m.name ? m.name.substring(0, 2).toUpperCase() + 'GYG022' : '');
    if (code.startsWith(prefix) && code.endsWith('GYG022')) {
      const middle = code.substring(prefix.length, code.length - 6);
      if (middle === '') {
        foundBase = true;
        if (maxNum < 0) maxNum = 0;
      } else {
        const num = parseInt(middle, 10);
        if (!isNaN(num) && num > maxNum) {
          maxNum = num;
        }
      }
    }
  });

  if (!foundBase && maxNum === -1) {
    return `${prefix}GYG022`;
  } else {
    return `${prefix}${maxNum + 1}GYG022`;
  }
};
