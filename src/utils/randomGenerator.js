export function generateStableEngagement(pluginId) {
  const seed = pluginId * 1337;
  
  function seededRandom(seed) {
    const x = Math.sin(seed) * 10000;
    return x - Math.floor(x);
  }
  
  const likesRandom = seededRandom(seed);
  const downloadsRandom = seededRandom(seed + 1);
  
  const likes = Math.floor(likesRandom * 500) + 50;
  const downloads = Math.floor(downloadsRandom * 5000) + 500;
  
  return {
    likes,
    downloads
  };
}