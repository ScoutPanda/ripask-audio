export function shuffleArr<T>(arr: T[]): T[] {
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
    .split("").map(function(v){
      return v.charCodeAt(0).toString(16)
    }).join("")
}

export function filterLimit<A>(array: A[], condition: (a: A) => boolean, maxSize: number): A[] {
  return [...fl(array, condition, maxSize)];
}

function *fl<A>(array: A[], condition: (a: A) => boolean, maxSize: number) {
  if (!maxSize || maxSize > array.length) {
    maxSize = array.length;
  }
  let count = 0;
  let i = 0;
  while ( count < maxSize && i < array.length ) {
    if (condition(array[i])) {
      yield array[i];
      count++;
    }
    i++;
  }
}

export function generateAvatar(text: string) {
  const canvas = document.createElement("canvas");
  const context = canvas.getContext("2d");
  const color = materialColors[getRandomInt(0, materialColors.length)];

  canvas.width = 300;
  canvas.height = 300;

  if (context) {
    // Draw background
    context.fillStyle = color.secondary;
    context.fillRect(0, 0, canvas.width, canvas.height);

    // Draw text
    context.font = "bold 150px Assistant";
    context.fillStyle = color.primary;
    context.textAlign = "center";
    context.textBaseline = "middle";
    context.fillText(getNameInitials(text), canvas.width / 2, canvas.height / 2);
  }

  return canvas.toDataURL("image/png");
}

function getNameInitials(name: string) {
  const a = name.split(" ");
  if (a.length == 2) {
    return `${a[0][0]}${a[1][0]}`;
  } else {
    return `${a[0][0]}${a[0][1]}`;
  }
}

function getRandomInt(min: number, max: number) {
  min = Math.ceil(min);
  max = Math.floor(max);
  return Math.floor(Math.random() * (max - min) + min);
}

const materialColors = [
  {primary: "black", secondary: "#FFEBEE"},
  {primary: "black", secondary: "#FFCDD2"},
  {primary: "black", secondary: "#EF9A9A"},
  {primary: "black", secondary: "#E57373"},
  {primary: "black", secondary: "#EF5350"},
  {primary: "black", secondary: "#F44336"},
  {primary: "black", secondary: "#E53935"},
  {primary: "white", secondary: "#D32F2F"},
  {primary: "white", secondary: "#C62828"},
  {primary: "white", secondary: "#B71C1C"},
  {primary: "black", secondary: "#FF8A80"},
  {primary: "black", secondary: "#FF5252"},
  {primary: "black", secondary: "#FF1744"},
  {primary: "white", secondary: "#D50000"},

  {primary: "black", secondary: "#FCE4EC"},
  {primary: "black", secondary: "#F8BBD0"},
  {primary: "black", secondary: "#F48FB1"},
  {primary: "black", secondary: "#F06292"},
  {primary: "black", secondary: "#EC407A"},
  {primary: "black", secondary: "#E91E63"},
  {primary: "white", secondary: "#D81B60"},
  {primary: "white", secondary: "#C2185B"},
  {primary: "white", secondary: "#AD1457"},
  {primary: "white", secondary: "#880E4F"},
  {primary: "black", secondary: "#FF80AB"},
  {primary: "black", secondary: "#FF4081"},
  {primary: "black", secondary: "#F50057"},
  {primary: "white", secondary: "#C51162"},

  {primary: "black", secondary: "#F3E5F5"},
  {primary: "black", secondary: "#E1BEE7"},
  {primary: "black", secondary: "#CE93D8"},
  {primary: "black", secondary: "#BA68C8"},
  {primary: "white", secondary: "#AB47BC"},
  {primary: "white", secondary: "#9C27B0"},
  {primary: "white", secondary: "#8E24AA"},
  {primary: "white", secondary: "#7B1FA2"},
  {primary: "white", secondary: "#6A1B9A"},
  {primary: "white", secondary: "#4A148C"},
  {primary: "black", secondary: "#EA80FC"},
  {primary: "black", secondary: "#E040FB"},
  {primary: "black", secondary: "#D500F9"},
  {primary: "white", secondary: "#AA00FF"},

  {primary: "black", secondary: "#EDE7F6"},
  {primary: "black", secondary: "#D1C4E9"},
  {primary: "black", secondary: "#B39DDB"},
  {primary: "black", secondary: "#9575CD"},
  {primary: "white", secondary: "#7E57C2"},
  {primary: "white", secondary: "#673AB7"},
  {primary: "white", secondary: "#5E35B1"},
  {primary: "white", secondary: "#512DA8"},
  {primary: "white", secondary: "#4527A0"},
  {primary: "white", secondary: "#311B92"},
  {primary: "black", secondary: "#B388FF"},
  {primary: "white", secondary: "#7C4DFF"},
  {primary: "white", secondary: "#651FFF"},
  {primary: "white", secondary: "#6200EA"},

  {primary: "black", secondary: "#E8EAF6"},
  {primary: "black", secondary: "#C5CAE9"},
  {primary: "black", secondary: "#9FA8DA"},
  {primary: "black", secondary: "#7986CB"},
  {primary: "white", secondary: "#5C6BC0"},
  {primary: "white", secondary: "#3F51B5"},
  {primary: "white", secondary: "#3949AB"},
  {primary: "white", secondary: "#303F9F"},
  {primary: "white", secondary: "#283593"},
  {primary: "white", secondary: "#1A237E"},
  {primary: "black", secondary: "#8C9EFF"},
  {primary: "black", secondary: "#536DFE"},
  {primary: "white", secondary: "#3D5AFE"},
  {primary: "white", secondary: "#304FFE"},

  {primary: "black", secondary: "#E3F2FD"},
  {primary: "black", secondary: "#BBDEFB"},
  {primary: "black", secondary: "#90CAF9"},
  {primary: "black", secondary: "#64B5F6"},
  {primary: "black", secondary: "#42A5F5"},
  {primary: "black", secondary: "#2196F3"},
  {primary: "black", secondary: "#1E88E5"},
  {primary: "white", secondary: "#1976D2"},
  {primary: "white", secondary: "#1565C0"},
  {primary: "white", secondary: "#0D47A1"},
  {primary: "black", secondary: "#82B1FF"},
  {primary: "black", secondary: "#448AFF"},
  {primary: "black", secondary: "#2979FF"},
  {primary: "white", secondary: "#2962FF"},

  {primary: "black", secondary: "#E1F5FE"},
  {primary: "black", secondary: "#B3E5FC"},
  {primary: "black", secondary: "#81D4FA"},
  {primary: "black", secondary: "#4FC3F7"},
  {primary: "black", secondary: "#29B6F6"},
  {primary: "black", secondary: "#03A9F4"},
  {primary: "black", secondary: "#039BE5"},
  {primary: "black", secondary: "#0288D1"},
  {primary: "white", secondary: "#0277BD"},
  {primary: "white", secondary: "#01579B"},
  {primary: "black", secondary: "#80D8FF"},
  {primary: "black", secondary: "#40C4FF"},
  {primary: "black", secondary: "#00B0FF"},
  {primary: "black", secondary: "#0091EA"},

  {primary: "black", secondary: "#E0F7FA"},
  {primary: "black", secondary: "#B2EBF2"},
  {primary: "black", secondary: "#80DEEA"},
  {primary: "black", secondary: "#4DD0E1"},
  {primary: "black", secondary: "#26C6DA"},
  {primary: "black", secondary: "#00BCD4"},
  {primary: "black", secondary: "#00ACC1"},
  {primary: "black", secondary: "#0097A7"},
  {primary: "black", secondary: "#00838F"},
  {primary: "white", secondary: "#006064"},
  {primary: "black", secondary: "#84FFFF"},
  {primary: "black", secondary: "#18FFFF"},
  {primary: "black", secondary: "#00E5FF"},
  {primary: "black", secondary: "#00B8D4"},

  {primary: "black", secondary: "#E0F2F1"},
  {primary: "black", secondary: "#B2DFDB"},
  {primary: "black", secondary: "#80CBC4"},
  {primary: "black", secondary: "#4DB6AC"},
  {primary: "black", secondary: "#26A69A"},
  {primary: "black", secondary: "#009688"},
  {primary: "black", secondary: "#00897B"},
  {primary: "white", secondary: "#00796B"},
  {primary: "white", secondary: "#00695C"},
  {primary: "white", secondary: "#004D40"},
  {primary: "black", secondary: "#A7FFEB"},
  {primary: "black", secondary: "#64FFDA"},
  {primary: "black", secondary: "#1DE9B6"},
  {primary: "black", secondary: "#00BFA5"},

  {primary: "black", secondary: "#E8F5E9"},
  {primary: "black", secondary: "#C8E6C9"},
  {primary: "black", secondary: "#A5D6A7"},
  {primary: "black", secondary: "#81C784"},
  {primary: "black", secondary: "#66BB6A"},
  {primary: "black", secondary: "#4CAF50"},
  {primary: "black", secondary: "#43A047"},
  {primary: "black", secondary: "#388E3C"},
  {primary: "white", secondary: "#2E7D32"},
  {primary: "white", secondary: "#1B5E20"},
  {primary: "black", secondary: "#B9F6CA"},
  {primary: "black", secondary: "#69F0AE"},
  {primary: "black", secondary: "#00E676"},
  {primary: "black", secondary: "#00C853"},

  {primary: "black", secondary: "#F1F8E9"},
  {primary: "black", secondary: "#DCEDC8"},
  {primary: "black", secondary: "#C5E1A5"},
  {primary: "black", secondary: "#AED581"},
  {primary: "black", secondary: "#9CCC65"},
  {primary: "black", secondary: "#8BC34A"},
  {primary: "black", secondary: "#7CB342"},
  {primary: "black", secondary: "#689F38"},
  {primary: "black", secondary: "#558B2F"},
  {primary: "white", secondary: "#33691E"},
  {primary: "black", secondary: "#CCFF90"},
  {primary: "black", secondary: "#B2FF59"},
  {primary: "black", secondary: "#76FF03"},
  {primary: "black", secondary: "#64DD17"},

  {primary: "black", secondary: "#F9FBE7"},
  {primary: "black", secondary: "#F0F4C3"},
  {primary: "black", secondary: "#E6EE9C"},
  {primary: "black", secondary: "#DCE775"},
  {primary: "black", secondary: "#D4E157"},
  {primary: "black", secondary: "#CDDC39"},
  {primary: "black", secondary: "#C0CA33"},
  {primary: "black", secondary: "#AFB42B"},
  {primary: "black", secondary: "#9E9D24"},
  {primary: "black", secondary: "#827717"},
  {primary: "black", secondary: "#F4FF81"},
  {primary: "black", secondary: "#EEFF41"},
  {primary: "black", secondary: "#C6FF00"},
  {primary: "black", secondary: "#AEEA00"},

  {primary: "black", secondary: "#FFFDE7"},
  {primary: "black", secondary: "#FFF9C4"},
  {primary: "black", secondary: "#FFF59D"},
  {primary: "black", secondary: "#FFF176"},
  {primary: "black", secondary: "#FFEE58"},
  {primary: "black", secondary: "#FFEB3B"},
  {primary: "black", secondary: "#FDD835"},
  {primary: "black", secondary: "#FBC02D"},
  {primary: "black", secondary: "#F9A825"},
  {primary: "black", secondary: "#F57F17"},
  {primary: "black", secondary: "#FFFF8D"},
  {primary: "black", secondary: "#FFFF00"},
  {primary: "black", secondary: "#FFEA00"},
  {primary: "black", secondary: "#FFD600"},

  {primary: "black", secondary: "#FFF8E1"},
  {primary: "black", secondary: "#FFECB3"},
  {primary: "black", secondary: "#FFE082"},
  {primary: "black", secondary: "#FFD54F"},
  {primary: "black", secondary: "#FFCA28"},
  {primary: "black", secondary: "#FFC107"},
  {primary: "black", secondary: "#FFB300"},
  {primary: "black", secondary: "#FFA000"},
  {primary: "black", secondary: "#FF8F00"},
  {primary: "black", secondary: "#FF6F00"},
  {primary: "black", secondary: "#FFE57F"},
  {primary: "black", secondary: "#FFD740"},
  {primary: "black", secondary: "#FFC400"},
  {primary: "black", secondary: "#FFAB00"},

  {primary: "black", secondary: "#FFF3E0"},
  {primary: "black", secondary: "#FFE0B2"},
  {primary: "black", secondary: "#FFCC80"},
  {primary: "black", secondary: "#FFB74D"},
  {primary: "black", secondary: "#FFA726"},
  {primary: "black", secondary: "#FF9800"},
  {primary: "black", secondary: "#FB8C00"},
  {primary: "black", secondary: "#F57C00"},
  {primary: "black", secondary: "#EF6C00"},
  {primary: "black", secondary: "#E65100"},
  {primary: "black", secondary: "#FFD180"},
  {primary: "black", secondary: "#FFAB40"},
  {primary: "black", secondary: "#FF9100"},
  {primary: "black", secondary: "#FF6D00"},

  {primary: "black", secondary: "#FBE9E7"},
  {primary: "black", secondary: "#FFCCBC"},
  {primary: "black", secondary: "#FFAB91"},
  {primary: "black", secondary: "#FF8A65"},
  {primary: "black", secondary: "#FF7043"},
  {primary: "black", secondary: "#FF5722"},
  {primary: "black", secondary: "#F4511E"},
  {primary: "black", secondary: "#E64A19"},
  {primary: "black", secondary: "#D84315"},
  {primary: "white", secondary: "#BF360C"},
  {primary: "black", secondary: "#FF9E80"},
  {primary: "black", secondary: "#FF6E40"},
  {primary: "black", secondary: "#FF3D00"},
  {primary: "white", secondary: "#DD2C00"},

  {primary: "black", secondary: "#EFEBE9"},
  {primary: "black", secondary: "#D7CCC8"},
  {primary: "black", secondary: "#BCAAA4"},
  {primary: "black", secondary: "#A1887F"},
  {primary: "white", secondary: "#8D6E63"},
  {primary: "white", secondary: "#795548"},
  {primary: "white", secondary: "#6D4C41"},
  {primary: "white", secondary: "#5D4037"},
  {primary: "white", secondary: "#4E342E"},
  {primary: "white", secondary: "#3E2723"},

  {primary: "black", secondary: "#FAFAFA"},
  {primary: "black", secondary: "#F5F5F5"},
  {primary: "black", secondary: "#EEEEEE"},
  {primary: "black", secondary: "#E0E0E0"},
  {primary: "black", secondary: "#BDBDBD"},
  {primary: "black", secondary: "#9E9E9E"},
  {primary: "white", secondary: "#757575"},
  {primary: "white", secondary: "#616161"},
  {primary: "white", secondary: "#424242"},
  {primary: "white", secondary: "#212121"},

  {primary: "black", secondary: "#ECEFF1"},
  {primary: "black", secondary: "#CFD8DC"},
  {primary: "black", secondary: "#B0BEC5"},
  {primary: "black", secondary: "#90A4AE"},
  {primary: "black", secondary: "#78909C"},
  {primary: "black", secondary: "#607D8B"},
  {primary: "white", secondary: "#546E7A"},
  {primary: "white", secondary: "#455A64"},
  {primary: "white", secondary: "#37474F"},
  {primary: "white", secondary: "#263238"}
]
