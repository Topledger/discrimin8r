# React-FI

![npm](https://img.shields.io/npm/v/react-fi)
![npm bundle size](https://img.shields.io/bundlephobia/min/react-fi)
![NPM](https://img.shields.io/npm/l/react-fi)

React library for [Feather icons](https://feathericons.com/).

## Installation

```
$ npm i react-fi
```

## Usage

```javascript
import React from "react";
import { FiActivity } from "react-fi";

const App = () => {
  return <FiActivity />;
};

export default App;
```

Icons can be configured with inline props :

```javascript
<FiActivity color="red" size={48} strokeWidth={4} />
```

Each and every SVG attribute is customizable. Here are few examples :

| Prop Name      | Default Value |
| -------------- | ------------- |
| fill           | none          |
| strokeWidth    | 2             |
| strokeLinecap  | round         |
| strokeLinejoin | round         |

You can also include the whole icon pack :

```javascript
import React from "react";
import * as ReactFI from "react-fi";

const App = () => {
  return <ReactFI.FiActivity />;
};

export default App;
```

## Size Presets

If you're using Tailwind CSS, you might feel more at ease with a predefined size (e.g., 'lg', 'xs', '2xl'). You may do the same for the size prop because it will be changed to the appropriate size value.

```javascript
<FiActivity size="lg" />

// is same as

<FiActivity size={18} />
```

If you are unfamiliar with Tailwind font size standards, please check out https://tailwindcss.com/docs/font-size.

## Issues & Contributions

For a new feature, create an issue [here](https://github.com/monkeyscript/react-fi/issues). Open to all contributions :)

## License

Apache-2.0. Please see the [license file](https://github.com/monkeyscript/react-fi/blob/master/LICENSE) for more information.
