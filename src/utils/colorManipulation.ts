const rgbToHsl = (r: number, g: number, b: number): [number, number, number] => {
   r /= 255;
   g /= 255;
   b /= 255;

   const max = Math.max(r, g, b);
   const min = Math.min(r, g, b);
   let h = 0;
   let s = 0;
   const l = (max + min) / 2;

   if (max !== min) {
      const d = max - min;
      s = l > 0.5 ? d / (2 - max - min) : d / (max + min);

      switch (max) {
         case r:
            h = (g - b) / d + (g < b ? 6 : 0);
            break;
         case g:
            h = (b - r) / d + 2;
            break;
         case b:
            h = (r - g) / d + 4;
            break;
      }

      h /= 6;
   }

   return [h, s, l];
};

const hslToRgb = (h: number, s: number, l: number): [number, number, number] => {
   let r, g, b;

   if (s === 0) {
      r = g = b = l;
   } else {
      const hue2rgb = (p: number, q: number, t: number) => {
         if (t < 0) t += 1;
         if (t > 1) t -= 1;
         if (t < 1 / 6) return p + (q - p) * 6 * t;
         if (t < 1 / 2) return q;
         if (t < 2 / 3) return p + (q - p) * (2 / 3 - t) * 6;
         return p;
      };

      const q = l < 0.5 ? l * (1 + s) : l + s - l * s;
      const p = 2 * l - q;

      r = hue2rgb(p, q, h + 1 / 3);
      g = hue2rgb(p, q, h);
      b = hue2rgb(p, q, h - 1 / 3);
   }

   return [Math.round(r * 255), Math.round(g * 255), Math.round(b * 255)];
};

export const lightenColor = (hexColor: string, amount: number): string => {
   let hex = hexColor.replace(/^#/, "");

   if (hex.length === 3) {
      hex = hex[0] + hex[0] + hex[1] + hex[1] + hex[2] + hex[2];
   }

   const safeAmount = Math.max(0, Math.min(1, amount));

   const r = parseInt(hex.substring(0, 2), 16);
   const g = parseInt(hex.substring(2, 4), 16);
   const b = parseInt(hex.substring(4, 6), 16);

   const lightenComponent = (component: number) => {
      return Math.round(component + (255 - component) * safeAmount);
   };

   const rHex = lightenComponent(r).toString(16).padStart(2, "0");
   const gHex = lightenComponent(g).toString(16).padStart(2, "0");
   const bHex = lightenComponent(b).toString(16).padStart(2, "0");

   return `#${rHex}${gHex}${bHex}`;
};

export const darkenColor = (hexColor: string, amount: number): string => {
   let hex = hexColor.replace(/^#/, "");
   if (hex.length === 3) {
      hex = hex[0] + hex[0] + hex[1] + hex[1] + hex[2] + hex[2];
   }

   const safeAmount = Math.max(0, Math.min(1, amount));

   const r = parseInt(hex.substring(0, 2), 16);
   const g = parseInt(hex.substring(2, 4), 16);
   const b = parseInt(hex.substring(4, 6), 16);

   const darkenComponent = (component: number) => {
      return Math.round(component * (1 - safeAmount));
   };

   const rHex = darkenComponent(r).toString(16).padStart(2, "0");
   const gHex = darkenComponent(g).toString(16).padStart(2, "0");
   const bHex = darkenComponent(b).toString(16).padStart(2, "0");

   return `#${rHex}${gHex}${bHex}`;
};

export const saturateColor = (hexColor: string, amount: number): string => {
   let hex = hexColor.replace(/^#/, "");
   if (hex.length === 3) {
      hex = hex[0] + hex[0] + hex[1] + hex[1] + hex[2] + hex[2];
   }

   const safeAmount = Math.max(0, Math.min(1, amount));

   const r = parseInt(hex.substring(0, 2), 16);
   const g = parseInt(hex.substring(2, 4), 16);
   const b = parseInt(hex.substring(4, 6), 16);

   // Convert RGB to HSL
   const [h, s, l] = rgbToHsl(r, g, b);

   // Adjust saturation
   const newSaturation = Math.min(1, s + safeAmount * (1 - s));

   // Convert back to RGB
   const [newR, newG, newB] = hslToRgb(h, newSaturation, l);

   // Convert to hex
   const rHex = Math.round(newR).toString(16).padStart(2, "0");
   const gHex = Math.round(newG).toString(16).padStart(2, "0");
   const bHex = Math.round(newB).toString(16).padStart(2, "0");

   return `#${rHex}${gHex}${bHex}`;
};

export const desaturateColor = (hexColor: string, amount: number): string => {
   let hex = hexColor.replace(/^#/, "");
   if (hex.length === 3) {
      hex = hex[0] + hex[0] + hex[1] + hex[1] + hex[2] + hex[2];
   }

   const safeAmount = Math.max(0, Math.min(1, amount));

   const r = parseInt(hex.substring(0, 2), 16);
   const g = parseInt(hex.substring(2, 4), 16);
   const b = parseInt(hex.substring(4, 6), 16);

   // Convert RGB to HSL
   const [h, s, l] = rgbToHsl(r, g, b);

   // Adjust saturation
   const newSaturation = Math.max(0, s * (1 - safeAmount));

   // Convert back to RGB
   const [newR, newG, newB] = hslToRgb(h, newSaturation, l);

   // Convert to hex
   const rHex = Math.round(newR).toString(16).padStart(2, "0");
   const gHex = Math.round(newG).toString(16).padStart(2, "0");
   const bHex = Math.round(newB).toString(16).padStart(2, "0");

   return `#${rHex}${gHex}${bHex}`;
};
