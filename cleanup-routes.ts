#!/usr/bin/env bun

import { writeFile, mkdir, open, readdir, rm } from "fs";
import { dirname, resolve } from "path";

const prepRoutes = (arr: string[]) =>
  arr.map((r) => r.replace(/(@|\~)\//, "").replace(".tsx", ".jsx")).sort();

const createMissingFile = async (filename: string) =>
  writeFile(
    filename,
    "",
    (err) => err && console.log(`Created the file ${filename}`),
  );

const cleanup = async (routes: Set<string>) => {
  readdir("./app/routes/", (err, files) => {
    for (let file of files) {
      const filename = `app/routes/${file}`;
      if (!routes.has(filename)) {
        rm(`./${filename}`, (err) => {
          console.log(err);
        });
      }
    }
  });
};

const createMissingDirectory = async (filename: string, directory: string) => {
  mkdir(directory, { recursive: true }, async (err, path) => {
    if (err) console.log(`The following error occured ${err.message}`);
    if (path) createMissingFile(filename);
  });
};

const tryOpen = async (filename: string, directory: string) => {
  createMissingDirectory(filename, directory);
  open(filename, async (err, fd) => {
    if (err && err.code === "EEXIST")
      console.log(`The file ${filename} exists. Skipping...\n\n`);
    if (err) {
      createMissingFile(filename);
      console.log(
        `Generic error occured message: ${err.message}. Creating file ${filename}...\n\n`,
      );
    }
  });
};

const apiRoutes = [
  "app/routes/countries.js",
  "app/routes/countries.js",
  "app/routes/join.tsx",
  "app/routes/healthcheck.tsx",
  "app/routes/login.tsx",
  "app/routes/_index.tsx",
  "app/routes/logout.tsx",
  "app/routes/review.$email.js",
];
const routes = new Set([
  ...apiRoutes,
  ...prepRoutes([
    "app/routes/arival-bank.jsx",
    "app/routes/arival-bank._index.jsx",
    "app/routes/arival-bank.signup.jsx",
    "app/routes/arival-bank.password.jsx",
    "app/routes/arival-bank.review.$id.jsx",
  ]),
]);
const main = async (filename: string, directory: string) =>
  tryOpen(filename, directory);

for (let route of routes) {
  const filename = `./${route}`;
  const directory = dirname(resolve(filename));
  main(filename, directory);
}

cleanup(routes);
