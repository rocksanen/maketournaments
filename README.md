# Project Title

Simple overview of use/purpose.

## Description

Maketournaments is Magic the Gathering Tournament tracker. You can use it to create and join tournaments created by yourself or other users. Tournaments can have custom rulesets, and multiple matches between different players. Tournaments can either exist on their own or as a part of a series.

To get started, register an account, create a tournament and invite other people you know to participate!

## Getting Started

### Setting it up

- .env.local file should be prersent in the project root with following variables:

  ```bash
  NEXTAUTH_SECRET: <secret>
  TOKEN_SECRET: <secret>
  MONGO_URI: <database_url>
  MONGO_URI_TEST: <database_url, start application using this with npm run testserver>
  NEXT_PUBLIC_URL: <address application is run at, for example http://localhost:3000>
  ```

### Installing

```bash
git clone https://github.com/rocksanen/maketournaments.git
npm install
# create .env.local -file & insert environment variables
npm run dev
```

## Help

In case of problems and issues, [you may create a ticket here](https://github.com/rocksanen/maketournaments/issues)

## Authors

- Otto Oksanen [(GitHub)](https://github.com/rocksanen)
- Joni Lassila [(GitHub)](https://github.com/LassilaJoni)
- Emil Ålgars [(GitHub)](https://github.com/emilalg)
- Eetu Soronen [(GitHub)](https://github.com/soronen)

## Version History

## License

All rights reserved™️

## Acknowledgments

- [Hard work and dedication](./images/yougotta.jpg)
