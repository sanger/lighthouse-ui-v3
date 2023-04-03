# Lighthouse UI

A [Nuxt](https://nuxt.com) application that provides SSRs the ability to interact with the [lighthouse service](https://github.com/sanger/lighthouse) and other LIMS. Some
of the features include:

- Create and download reports which contain the fit to pick samples and their locations
- The ability to scan the barcode of a box or plate and get information about it, such as:
  - whether there is plate map data for the barcode(s)
  - the number of fit to pick samples
  - the number of 'must_sequence' samples
  - the number of 'preferentially_sequence' samples
- Create samples in Sequencescape when scanning in a box - it retrieves the plates from LabWhere, then inserts the fit
  to pick samples into Sequencescape

- Create a cherrypick batch from Sentinel - on scaning a box barcode, it retrieves the plates from LabWhere, then
  creates a cherrypick submission in Sequencescsape. It assumes that the samples are already in Sequencescape and also
  gives you an opportunity to deselect samples that you do not want to include
- View the status of the CSV imports from the lighthouse service
- Print labels
- Create and fail plates in the Beckman pipeline

## Table of Contents

<!-- toc -->

- [Requirements for development](#requirements-for-development)
- [Getting started](#getting-started)
  - [Configuring environment](#configuring-environment)
  - [Setup steps](#setup-steps)
- [Running](#running)
- [Linting](#linting)
- [Testing](#testing)
  - [Running tests](#running-tests)
- [Deployment](#deployment)
- [Miscellaneous](#miscellaneous)
  - [Updating the Table of Contents](#updating-the-table-of-contents)

<!-- tocstop -->

## Requirements for development

The following tools are required for development:

- node (the version used is found in `.nvmrc`). `nvm` makes using the correct
  version much easier.

## Getting started

The following services are not required but can be beneficial during development:

- [lighthouse service](https://github.com/sanger/lighthouse)
- [Sequencescape](https://github.com/sanger/sequencescape)

### Configuring environment

Create a `.env` file, or copy the `.env.example`, and update the values to meet your setup.

### Setup steps

Install the require packages:

    npm install

## Some notes about Nuxt 3

Nuxt 3 is just similar enough to Nuxt 2 that you may think there aren't any tangible differences.
However Nuxt 3 has been a lot more clearly thought about and makes use of existing directory structures in different ways to before.
The following are just examples as there are many changes which can be reviewed in the [Nuxt documentation/guides](https://nuxt.com/docs/guide/concepts/auto-imports).

- Nuxt 3 uses auto-importing a lot.
  Where it was important to import everything as needed in Nuxt 2, files you place in `modules` are auto-loaded and auto-imported when Nuxt starts and `utils` auto-imports the files at the root level so that they can be used as globally scoped variables.
- Modules were previously a place to put anything you didn't have a place for, particularly utility methods.
  However the `utils` folder should be used for those.
  Modules have a specific purpose in Nuxt 3, intended to alter the way the app functions.
  They would be defined using the global function `defineNuxtModule()`
- Typescript is preferred for new code going into your Nuxt app.
- Config for Nuxt itself, Vite (the new build toolkit) and Vitest (the new testing framework) are all defined in separate files.
  Or, perhaps preferably, in the same `nuxt.config.ts` file that is then split up by keys for each component of the system.
  See the directory structure for Nuxt 3 in the guide linked above to see more about how this works.

## Running

To serve the application with hot reloading:

    npm run dev

## Linting

This project is linted using [ESLint](https://github.com/eslint/eslint). To lint the code, run:

    npm run lint

You can also auto-format the Javascript using Prettier via the command:

    npm run format

## Testing

### Running tests

To run the Vitest test suite with auto re-runs:

    npm test

Or else, for a single run and no file watching:

    npm test run

## Deployment

This project uses a Docker image as the unit of deployment. To create a release for deployment, create a release
in GitHub and wait for the GitHub action to create the Docker image.

The release version should align with the [standards](https://github.com/sanger/.github/blob/master/standards.md).

## Miscellaneous

### Updating the Table of Contents

To update the table of contents after adding things to this README you can use the [markdown-toc](https://github.com/jonschlinkert/markdown-toc)
node module. To run:

    npx markdown-toc --bullets="-" -i -- README.md
