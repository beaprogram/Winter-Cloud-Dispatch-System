# Winter Cloud Dispatch System

A modern web application built with React and TypeScript that provides a secure, cloud authenticated dispatch management interface. The project demonstrates a production oriented front end architecture with strong typing, container based deployment, and integration with AWS Cognito for identity and access management.

## Overview

Winter Cloud Dispatch System is designed to serve as the front end for a dispatch and operations workflow. It focuses on three core engineering goals: a maintainable component model in TypeScript, a secure authentication flow backed by AWS Cognito, and a reproducible build pipeline through Docker for consistent deployment across environments.

## Key Features

- Strongly typed React components written in TypeScript for safer refactoring and clearer contracts
- Secure user authentication and session management through AWS Cognito
- Containerized build configuration with Docker for reliable deployment
- Modular project structure suitable for scaling additional dispatch features
- Production ready build pipeline using Create React App with optimized output

## Tech Stack

| Layer | Technology |
| --- | --- |
| Language | TypeScript |
| Framework | React |
| Authentication | AWS Cognito |
| Tooling | Create React App, Yarn |
| Deployment | Docker |

## Project Structure

```
winter-cloud-dispatch-system/
public/             Static assets and HTML shell
src/                React components, hooks, and TypeScript modules
Dockerfile          Container build definition
package.json        Dependencies and scripts
tsconfig.json       TypeScript compiler configuration
yarn.lock           Locked dependency versions
```

## Getting Started

### Prerequisites

- Node.js 18 or later
- Yarn
- Docker (optional, for container builds)

### Installation

```bash
git clone https://github.com/beaprogram/Winter-Cloud-Dispatch-System.git
cd Winter-Cloud-Dispatch-System
yarn install
```

### Running Locally

```bash
yarn start
```

The application will be available at http://localhost:3000.

### Building for Production

```bash
yarn build
```

### Running with Docker

```bash
docker build -t winter-cloud-dispatch-system .
docker run -p 3000:3000 winter-cloud-dispatch-system
```

## Available Scripts

| Command | Description |
| --- | --- |
| `yarn start` | Run the development server |
| `yarn test` | Run the test suite |
| `yarn build` | Generate an optimized production build |

## Author

Developed by Arup Halder. For questions or collaboration, please reach out through GitHub.
