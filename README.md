# PortfolioGen

AI-powered resume-to-portfolio generator. Takes in a resume and produces a deployed personal portfolio site, using an LLM-based pipeline to extract structured content and render it into a Next.js app.

## What it does

Resume are dense and unstructured. Turning one into a clean personal site by hand and figuring on how to deploy it is tedious. PortfolioGen automates the gap:

1. Ingests a resume.
2. Uses an LLM to extract structured fields (experience, projects, skills, links).
3. Renders the structured content into a Next.js + React portfolio site.
4. Integrates with the GitHub API to automate generation and deployment.

## Tech stack

* Next.js
* React
* JavaScript (Node.js)
* LLM APIs for content extraction
* GitHub API for deployment automation

## How it works

The pipeline has three stages that stay decoupled:

1. **Extraction.** The résumé is sent to an LLM with a prompt that returns structured output matching a fixed schema. Constraining the output shape improves reliability and makes downstream rendering deterministic.
2. **Generation.** The structured content is passed into React components that render each section of the portfolio.
3. **Deployment.** GitHub API calls automate repository creation and deployment so the user ends up with a live site, not just local files.

Most of the iteration work was on the extraction prompt and context management rather than on rendering logic.

## Getting started

### Prerequisites

* Node.js 18 or higher
* An API key for your LLM provider
* (Optional) A GitHub token if you want the deployment step

### Install

```bash
git clone https://github.com/aniidev/portfolioGenerator.git
cd portfolioGenerator
npm install
```

### Run locally

```bash
npm run dev
```

Then open `http://localhost:3000`.

### Build

```bash
npm run build
npm start
```
