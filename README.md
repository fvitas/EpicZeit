<h1 align="center">
  <div>
    <img src="apps/web/public/favicon/logo.svg" height="100" width="auto">
  </div>
  Epic Zeit

  [![Badge License]][License]
</h1>


## Introduction

Epic Zeit is a powerful tool designed to simplify your interaction with time zones worldwide. 

It is crafted for anyone who needs to manage international meetings, travel plans, or simply wishes to keep track of time around the world.

## Look and Feel

<p align="left">
  <img src="apps/web/home/assets/demo_1.png" height="auto" width="100%">
  <img src="apps/web/home/assets/demo_4.png" height="auto" width="100%">
  <img src="apps/web/home/assets/demo_5.png" height="auto" width="100%">
</p>


## Todo

- [x] Enable and show suggestions for frequently added locations
- [x] Settings flag for auto close add location dialog
- [x] Implement my own timepicker (clockpicker)
- [x] Clock picker dialog for mobile users
- [ ] Create android app using capacitor and ship it 🚀
- [ ] Vertical layout for mobile ?
- [ ] Add service workers for PWA ?
- [ ] Replace localstorage with something else and support state migration ?


## Prerequisites
- [Node.js](https://docs.npmjs.com/getting-started/installing-node) _(^18.0.0)_
- [pnpm](https://pnpm.io/installation) _(^8.7.0)_


## Apps and Packages

This Turborepo monorepo includes the following: 

#### apps
- `web`: a [Vite](https://vitejs.dev/) app
- `extension`: a Chrome extension / Firefox addon

#### packages
- `@repo/ui`: a React component library package shared by both `web` and `extension` apps

## Build

To build all apps and packages, run the following command:

```
pnpm run build
```

## Develop

To develop all apps and packages, run the following command:

```
pnpm run dev
```

or you can individually start a web app:
```
cd apps/web
pnpm run dev
```


## License

Epic Zeit is made available under the [GPLv3 License][License]


<!----------------------------------------------------------------------------->

[License]: LICENSE.txt

[Badge License]: https://img.shields.io/badge/License-GPLv3-blue.svg
