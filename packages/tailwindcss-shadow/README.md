# @achamaro/tailwindcss-shadow

Tailwind CSS plugin that sets the shadow color based on the specified color.

## Installation

Install the plugin from npm:

```sh
npm i -D @achamaro/tailwindcss-shadow
```

Then add the plugin to your `tailwind.config.js` file:

```typescript
import { coloredShadow, shadowColor } from "@achamaro/tailwindcss-shadow";

/** @type {import('tailwindcss').Config} */
export default {
  // ...
  plugins: [
    // ...
    shadowColor(),
    coloredShadow(),
  ],
};
```

## Usage

```html
<div class="shadow-sc-10 shadow-sc-sky-500"></div>
```

## shadowColor Options

### utilities

prefix?: string;
generator?: GeneratorFunction;

- **Type**: `Record<string, string>`
- **Default**: `{ shadow: "--tw-shadow-color" }`

The directory to download icons.

### prefix

- **Type**: `string`
- **Default**: `"sc"`

### generator

- **Type**:
  ```typescript
  // type ColorResult = {
  //   type: "rgb" | "hsl" | "hsv";
  //   values: [number, number, number];
  //   alpha: number;
  // }
  (hsv: ColorResult, original: ColorResult) => ColorResult;
  ```
- **Default**:
  ```typescript
  (hsv) => {
    hsv.values[2] = Math.max(0, hsv.values[2] - 25);
    return hsv;
  };
  ```
