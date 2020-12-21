export function shuffleArr(arr: any[]): any[] {
  const temp = [...arr];
  for (let i = temp.length - 1; i > 0; i--) {
    const j = Math.floor(Math.random() * (i + 1));
    [temp[i], temp[j]] = [temp[j], temp[i]];
  }
  return temp;
}

export function secondsToString(seconds: number, format: "long" | "short" = "long"): string {
  if (format === "long") {
    return new Date(seconds * 1000).toISOString().substr(11, 8)
  } else {
    return new Date(seconds * 1000).toISOString().substr(14, 5)
  }
}

export function toHex(str: string){
  return unescape(encodeURIComponent(str))
    .split('').map(function(v){
      return v.charCodeAt(0).toString(16)
    }).join('')
}
