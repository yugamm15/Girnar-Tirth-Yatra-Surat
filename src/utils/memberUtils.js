export const generateMemberCode = (name) => {
  if (!name) return '';
  const prefix = name.substring(0, 2).toUpperCase();
  return `${prefix}GYG022`;
};
