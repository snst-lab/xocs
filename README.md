[![node version](https://img.shields.io/node/v/xocs.svg)](https://img.shields.io/node/v/xocs.svg)
[![npm version](https://badge.fury.io/js/xocs.svg)](https://badge.fury.io/js/xocs)
[![Build Status](https://travis-ci.org/snst-lab/xocs.svg?branch=master)](https://travis-ci.org/snst-lab/xocs)
[![License](https://img.shields.io/badge/License-Apache%202.0-blue.svg)](https://opensource.org/licenses/Apache-2.0)

xocx 
=============
> #### `[klɔ'ks]`
> ---
> Simple and lightweight source processor (SASS, SCSS, Imagemin etc.), utilities (watcher, BrowserSync, FTP client, etc.), and minimal task runner, 
>
> which makes more easy for you to Front-end developments or Web productions,
>
> aiming to an alternative of [laravelmix](https://github.com/JeffreyWay/laravel-mix), [gulp](https://github.com/gulpjs/gulp), [grunt](https://github.com/gruntjs/grunt),... and so on.


## Screenshot
<img src="https://raw.githubusercontent.com/snst-lab/xocs/master/docs/img/screenshot.gif">

<br>


## Contents

> [Feature](#feature)
>
> [Get Started](#get_started)
>
> [Usage](#usage)
>
> [TypeScript Support](#typescript_support)
>
> [Version](#version)
>
> [Contributing](#contributing)  
>
> [License](#licence)

<br>

---

<br>

## Feature

### Watcher
> - Watching file change to call Processors, browserSync, FTP client, etc.

### Processer
> - SASS, SCSS Compile 
> - postcss
> - Imagemin ( png, jpg, gif, svg, webp)

### Utility
> - BrowserSync
> - FTP Client

### Task Runner
> - Users can register tasks and can call these with CLI command

<br>

## Get_Started

### 1. Run command below to install npm modules


#### Option 1. Yarn

```sh
 $ yarn add -D xocs
```

#### Option 2. NPM

```sh
 $ npm install -D xocs
```


### 2. Automatically generate configuration files to your npm root

```sh
[npm root]
|-- .env                 //  Append setting templates includes FTP and BrowserSync to '.env' 
|                        //   ( will genereate unless already exists ) 
|-- .browserslistrc      //  Generate unless '.browserslistrc' already exists
|-- imagemin.config.js   //  Generate unless 'imagemin.config.js' already exists
|-- postcss.config.js    //  Generate unless 'postcss.config.js' already exists
|-- xocs.mix.js         //  Procedure file ( will genereate unless already exists ) 
```

> Procedure file's name rule is `xocs.***.js` or `xocs.***.ts`. 
If mutliple procedure files exist, these are prioritized in alphabetical order.

### 3. Edit procedure file
> Edit 'xocs.mix.js' to define source directory root (srcRoot) and build directory root (publicRoot)
```js
const xocs = require("xocs").default;

// Define source directory root (srcRoot) and build directory root (publicRoot)
xocs.init({
  srcRoot: "src", 
  publicRoot: "public", 
});

/** Add some  additional procedures below 
*  (ex.  Start watcher, sass compile, ... etc.)
*    .
*    .
*/
```
> See [below section](#usage) for how to write additional procedures.


### 4. Run CLI 
```sh
 $ npx xocs
```

---

#### Optional 
> If you need run CLI command without 'npx', install globally in advance
```sh
 $ npm install -g xocs
 $ xocs
```

---

<br>

## Usage

### Initialize Procedure
```js
const xocs = require("xocs").default;

xocs.init({
  env: "env.production",  // Specify your '.env' file name ( Default is '.env')
  srcRoot: "src",    // Specify your source directory root  ( Default is 'src')
  publicRoot: "public",  // Specify your build directory root ( Default is 'public')
});
```

### SCSS Compile 

```js
// Compile scss files specified with 'glob pattern' (!no 'regex pattern')
xocs.sass("src/**/*.scss");
```

### SCSS Compile with postcss

```js
// Proccess with postcss based on options in 'postcss.config.js'
xocs.sass("src/**/*.scss").postcss();
```

### Image Optimization

```js
// Proccess with postcss based on options in 'postcss.config.js'
xocs.imagemin("src/**/*.@(jpg|jpeg|png|gif|svg|webp)");
```

### Arbitrary shell command execution 

```js
xocs.exec("rm -rf .cache");
```

### Watching files and compile CSS

```js
// Proccess with postcss based on options in 'postcss.config.js'
  xocs.watch(["src/**/*.sass", "src/**/*.scss"], ($) => {
      $.sass().postcss();
    }
  );
```
> Hear, `$` which is a argument of watch property method, has type named `Thread`.   
`Thread` have same functions of `xocs` itself except for it includes the information of target files of watcher.   

### BrowserSync

```js
// Init BrowserSync
  const browser = xocs.browser();

// Watch files to trigger css compile and browser reload
  xocs.watch(["src/**/*.sass", "src/**/*.scss"], ($) => {
      $.sass().postcss();
      browser.reload();
    }
  );
```
> You can also write as below 
```js
// Init BrowserSync
  xocs.browser();

// Watch files to trigger css compile and browser reload
  xocs.watch("src/**/*.@(sass|scss)", ($) => {
      $.sass().postcss().reload();
    }
  );
```

### FTP upload

> Edit `.env` file to path values to  `process.env`  
> and ignore git staging of `.env` with `.gitignore` (recommend)  
> ( `xocs` already includes [dotenv](https://github.com/motdotla/dotenv) module as dependincies )

```js
  // Create FTP connection
  xocs.remote({
    host: process.env.FTP_HOST,
    port: process.env.FTP_PORT,
    user: process.env.FTP_USER,
    password: process.env.FTP_PASS,
    localRoot: process.env.FTP_LOCAL_ROOT,
    remoteRoot: process.env.FTP_REMOTE_ROOT,
  });

// Simply copy file from 'src' directory to 'public' directory and upload remote directory 
  xocs.watch("src/**/*.@(html|php)", ($) => {
    $.copy().upload();
  });

// Compile css from 'src' directory to 'public' directory and upload remote directory 
  xocs.watch(["src/**/*.sass", "src/**/*.scss"], ($) => {
    $.sass().postcss().upload();
  });
```
> You can also write as below, watching public directory insted of src directory 
```js
  // Create FTP connection
  xocs.remote({
    host: process.env.FTP_HOST,
    port: process.env.FTP_PORT,
    user: process.env.FTP_USER,
    password: process.env.FTP_PASS,
    localRoot: process.env.FTP_LOCAL_ROOT,
    remoteRoot: process.env.FTP_REMOTE_ROOT,
  });

// Watching all files in public directory and upload remote directory
  xocs.watch("public/**/*", ($) => {
    $.upload();
  });
```

### Task Runner

#### Usage1: Specify tasks from CLI

> Register task in `xocs.mix.js`
```js
xocs.task("compile", () => {
  xocs.sass("src/**/*.scss").postcss();
  xocs.imagemin("src/**/*.@(jpg|jpeg|png|gif|svg|webp)");
});
```

> Run task from CLI
```sh
$ npx xocs compile
```


#### Usage2: Specify tasks in Procedure

> Register task in `xocs.mix.js`
```js
xocs.task("compile:html", () => {
  // For example, src/index.html => public/pages/index.html
  xocs.watch("src/**/*.@(html|php)", ($, path) => {
    $.copy(path, "pages");
  });
});

xocs.task("compile:js", () => {
  xocs.watch("src/**/*.js", ($) => {
    $.copy();
  });
});

xocs.task("compile:css", () => {
  xocs.watch("src/**/*.scss",($) => {
      $.sass().postcss();
    }
  );
});

xocs.task("compile:img", () => {
  xocs.watch("src/**/*.@(jpg|jpeg|png|gif|svg|webp)",($) => {
      $.imagemin();
    }
  );
});

xocs.task("preview", () => {
  // Start BrowserSync
  xocs.browser({
    proxy: process.env.PUBLIC_URL,
  });

  // Create FTP connection
  xocs.remote({
    host: process.env.FTP_HOST,
    port: process.env.FTP_PORT,
    user: process.env.FTP_USER,
    password: process.env.FTP_PASS,
    localRoot: process.env.FTP_LOCAL_ROOT,
    remoteRoot: process.env.FTP_REMOTE_ROOT,
  });

  // Upload file to remote host when files in public directory are updated & run BrowserSync
  xocs.watch(["public/assets/**/*", "public/pages/**/*"],($) => {
      $.upload().reload();
    }
  );
});

xocs.run("compile:html", "compile:js", "compile:css", "compile:img", "preview")
```

> Run task from CLI
```sh
$ npx xocs
```

<br>

## TypeScript_Support

> You can write procudure file in TypeScript replacing extention from `.js` to `.ts`   
> A `xocs.mix.ts` example is below

```ts
import xocs, { Thread } from "xocs";

xocs.init({
  env: ".env.development", // default is s".env"
  srcRoot: "test/src", // default is "src"
  publicRoot: "test/public", // default is "public"
});

const { srcRoot, publicRoot } = xocs.config;

xocs.watch(srcRoot + "/assets/css/**/*.scss", ($: Thread) => {
  $.sass().postcss();
});

xocs.watch(srcRoot + "/assets/img/**/*.@(jpg|jpeg|png|gif|svg|webp)", ($: Thread) => {
    $.imagemin();
  }
);
```


<br>


## Version
We manage the project version on [VERSION.md](./docs/VERSION.md)
The versioning scheme we refer is [Semantic Versioning](https://semver.org/)

<br>

## Contributing
 We always welcome your ideas and feedback. 
 To contribute this project, please see [CONTRIBUTING.md](./docs/CONTRIBUTING.md) at first.

<br>

## Licence
[Apache Licence 2.0](https://www.apache.org/licenses/LICENSE-2.0.txt) 

<br>

## Founded by

[TANUSUKE](https://github.com/snst-lab)  
