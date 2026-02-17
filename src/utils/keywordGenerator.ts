export const processTags = (tagString: string): string[] => {
  if (!tagString) return [];
  
  // '#' ලකුණෙන් වෙන් කරලා, හිස් තැන් අයින් කරලා array එකක් හදනවා
  return tagString
    .split('#')
    .map(tag => tag.trim().toLowerCase())
    .filter(tag => tag.length > 0);
};