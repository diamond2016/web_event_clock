# CI/CD Setup for Local TypeScript Monorepo (2026)

## Overview

This document outlines a comprehensive CI/CD pipeline for a **TypeScript + pnpm monorepo** using **self-hosted Jenkins**. The goal is to automate build, test, lint, and deployment processes without cloud service costs.

---

## Table of Contents

1. [Prerequisites](#prerequisites)
2. [Project Structure](#project-structure)
3. [Jenkins Configuration](#jenkins-configuration)
4. [Pipeline Stages](#pipeline-stages)
5. [pnpm Integration](#pnpm-integration)
6. [Code Quality Standards](#code-quality-standards)
7. [Testing Strategy](#testing-strategy)
8. [Security Scanning](#security-scanning)
9. [Deployment](#deployment)
10. [Monitoring & Alerts](#monitoring--alerts)
11. [Troubleshooting](#troubleshooting)
12. [Best Practices](#best-practices)

---

## Prerequisites

### Required Tools

| Tool | Purpose | Installation |
|------|---------|--------------|
| **Jenkins** | CI/CD orchestration | Self-hosted on your machine/server |
| **pnpm** | Package manager | `npm install -g pnpm` |
| **Node.js** | Runtime | v18+ (LTS recommended) |
| **Git** | Version control | Standard installation |

### Project Requirements

- Monorepo structure with `pnpm-workspace.yaml`
- `package.json` with scripts in each app/package
- ESLint configured for TypeScript
- Test framework (Jest, Vitest, Mocha, etc.)

---

## Project Structure

```
your-monorepo/
├── apps/
│   ├── backend/
│   │   ├── package.json
│   │   └── scripts/
│   │       ├── lint.sh
│   │       ├── test.sh
│   │       └── build.sh
│   └── frontend/
│       └── ...
├── packages/
│   ├── shared/
│   └── utils/
├── Jenkinsfile
├── pnpm-workspace.yaml
├── package.json
└── README.md
```

---

## Jenkins Configuration

### Jenkinsfile Setup

Create `Jenkinsfile` at the root of your monorepo:

```groovy
// Jenkinsfile for TypeScript Monorepo

pipeline {
    agent any
    
    environment {
        NODE_VERSION = '18'
        PNPM_VERSION = '8'
        WORKSPACE = "${env.WORKSPACE}"
    }
    
    stages {
        stage('Checkout') {
            steps {
                checkout scm
                script {
                    echo "Working directory: ${WORKSPACE}"
                }
            }
        }
        
        stage('Setup Environment') {
            steps {
                script {
                    // Install Node.js if not present
                    sh '''
                        if ! command -v node &> /dev/null; then
                            echo "Installing Node.js ${NODE_VERSION}..."
                            curl -fsSL https://deb.nodesource.com/setup_${NODE_VERSION}.x | bash -
                            apt-get install -y nodejs
                        fi
                    '''
                    
                    // Install pnpm if not present
                    sh '''
                        if ! command -v pnpm &> /dev/null; then
                            echo "Installing pnpm..."
                            npm install -g pnpm@${PNPM_VERSION}
                        fi
                    '''
                    
                    echo "Node version: $(node -v)"
                    echo "pnpm version: $(pnpm -v)"
                }
            }
        }
        
        stage('Install Dependencies') {
            steps {
                sh 'pnpm install --frozen-lockfile'
            }
        }
        
        stage('Lint') {
            steps {
                sh 'pnpm lint'
            }
        }
        
        stage('Test') {
            steps {
                sh 'pnpm test'
            }
        }
        
        stage('Build') {
            steps {
                sh 'pnpm build'
            }
        }
        
        stage('Security Scan') {
            steps {
                sh 'pnpm audit'
            }
        }
        
        stage('Deploy') {
            when {
                branch 'main'
            }
            steps {
                script {
                    // Add your deployment steps here
                    // Example: docker build, kubectl deploy, etc.
                }
            }
        }
    }
    
    post {
        always {
            cleanWs()
        }
        success {
            echo 'Pipeline completed successfully!'
        }
        failure {
            echo 'Pipeline failed! Check logs for details.'
        }
    }
}
```

---

## Pipeline Stages

### Stage 1: Checkout
- Pulls latest code from repository
- Sets working directory

### Stage 2: Setup Environment
- Installs Node.js (if needed)
- Installs pnpm (if needed)
- Verifies versions

### Stage 3: Install Dependencies
- Runs `pnpm install --frozen-lockfile`
- Uses lockfile for reproducible builds

### Stage 4: Lint
- Runs ESLint across all packages
- Checks TypeScript types
- Enforces code style

### Stage 5: Test
- Runs test suites
- Generates coverage reports
- Fails on test failures

### Stage 6: Build
- Compiles TypeScript
- Bundles applications
- Creates production artifacts

### Stage 7: Security Scan
- Runs `pnpm audit` for vulnerabilities
- Can integrate Snyk, npm audit, or other scanners

### Stage 8: Deploy
- Deploys to target environment
- Only runs on specific branches (e.g., `main`)

---

## pnpm Integration

### package.json Scripts Standardization

Each app/package should have standardized scripts:

```json
{
  "scripts": {
    "lint": "eslint . --ext .ts,.tsx",
    "lint:fix": "eslint . --ext .ts,.tsx --fix",
    "test": "jest",
    "test:coverage": "jest --coverage",
    "test:watch": "jest --watch",
    "build": "tsc && tsc-alias",
    "build:watch": "tsc --watch",
    "dev": "ts-node src/index.ts",
    "start": "node dist/index.js",
    "clean": "rm -rf dist node_modules .turbo"
  }
}
```

### Workspace Configuration

`pnpm-workspace.yaml`:

```yaml
packages:
  - 'apps/*'
  - 'packages/*'
```

### Root package.json

```json
{
  "name": "monorepo-root",
  "private": true,
  "scripts": {
    "lint": "pnpm -r lint",
    "lint:fix": "pnpm -r lint:fix",
    "test": "pnpm -r test",
    "test:coverage": "pnpm -r test:coverage",
    "build": "pnpm -r build",
    "dev": "pnpm -r dev",
    "clean": "pnpm -r clean"
  }
}
```

---

## Code Quality Standards

### ESLint Configuration

`.eslintrc.js` or `eslint.config.js`:

```javascript
module.exports = {
  parser: '@typescript-eslint/parser',
  plugins: ['@typescript-eslint'],
  extends: [
    'eslint:recommended',
    'plugin:@typescript-eslint/recommended',
    'plugin:prettier/recommended'
  ],
  env: {
    node: true,
    jest: true
  },
  rules: {
    '@typescript-eslint/explicit-function-return-type': 'off',
    '@typescript-eslint/no-explicit-any': 'warn',
    'no-console': 'warn',
    'prefer-const': 'error'
  }
};
```

### TypeScript Configuration

`tsconfig.json`:

```json
{
  "compilerOptions": {
    "target": "ES2020",
    "module": "commonjs",
    "lib": ["ES2020"],
    "outDir": "./dist",
    "rootDir": "./src",
    "strict": true,
    "esModuleInterop": true,
    "skipLibCheck": true,
    "forceConsistentCasingInFileNames": true,
    "resolveJsonModule": true,
    "declaration": true,
    "declarationMap": true,
    "sourceMap": true
  },
  "include": ["src/**/*"],
  "exclude": ["node_modules", "dist"]
}
```

---

## Testing Strategy

### Test Organization

```
apps/backend/
├── src/
│   ├── index.ts
│   └── services/
├── tests/
│   ├── unit/
│   ├── integration/
│   └── e2e/
└── package.json
```

### Test Commands

```bash
# Run all tests
pnpm test

# Run with coverage
pnpm test:coverage

# Watch mode for development
pnpm test:watch

# Run specific test file
pnpm test tests/unit/example.test.ts
```

### Coverage Thresholds

Configure in `jest.config.js`:

```javascript
module.exports = {
  coverageThreshold: {
    global: {
      branches: 80,
      functions: 80,
      lines: 80,
      statements: 80
    }
  }
};
```

---

## Security Scanning

### npm Audit

```bash
pnpm audit
```

### Snyk Integration (Optional)

Add to Jenkinsfile:

```groovy
stage('Snyk Scan') {
    steps {
        sh 'snyk test'
    }
}
```

### Dependency Updates

```bash
# Check for outdated packages
pnpm outdated

# Update all packages
pnpm update --latest
```

---

## Deployment

### Docker Integration

`Dockerfile`:

```dockerfile
FROM node:18-alpine AS builder
WORKDIR /app
COPY package*.json ./
RUN pnpm install --frozen-lockfile
COPY . .
RUN pnpm build

FROM node:18-alpine
WORKDIR /app
COPY --from=builder /app/dist ./dist
COPY --from=builder /app/package*.json ./
RUN npm install -g pm2
CMD ["pm2-runtime", "dist/index.js"]
```

### Jenkins Deployment Stage

```groovy
stage('Deploy') {
    when {
        branch 'main'
    }
    steps {
        sh 'docker build -t myapp:${BUILD_NUMBER} .'
        sh 'docker push myapp:${BUILD_NUMBER}'
        // Add kubectl, helm, or other deployment commands
    }
}
```

---

## Monitoring & Alerts

### Jenkins Notifications

Configure in Jenkins:

1. **Email Notifications**
   - Go to: Manage Jenkins → System → E-mail Notification
   - Configure SMTP settings
   - Set up triggers for build status

2. **Slack Integration**
   - Install Slack plugin
   - Configure webhook URL
   - Create channel for notifications

3. **Webhook Alerts**
   - Use Jenkins webhook plugin
   - Send to monitoring tools (PagerDuty, OpsGenie)

### Pipeline Post-Actions

```groovy
post {
    always {
        // Archive test reports
        archiveArtifacts artifacts: '**/coverage/**'
    }
    success {
        // Send success notification
        emailext subject: "Build Successful: ${env.JOB_NAME}",
                 to: 'team@example.com'
    }
    failure {
        // Send failure notification
        emailext subject: "Build Failed: ${env.JOB_NAME}",
                 to: 'team@example.com',
                 bodyFormat: 'FAILURE'
    }
}
```

---

## Troubleshooting

### Common Issues

| Issue | Solution |
|-------|----------|
| `pnpm` not found | Install globally: `npm install -g pnpm` |
| Lockfile conflicts | Run `pnpm install --force` |
| TypeScript errors | Check `tsconfig.json` settings |
| ESLint errors | Review `.eslintrc` configuration |
| Jenkins agent timeout | Increase timeout in pipeline config |
| Docker build fails | Check Dockerfile syntax and base image |

### Debug Mode

```bash
# Run pipeline with verbose output
JENKINS_DEBUG=true pnpm test

# Check specific stage
sh 'pnpm lint --verbose'
```

---

## Best Practices

### 1. **Lockfile Management**
- Always use `--frozen-lockfile` for CI
- Commit `pnpm-lock.yaml` changes
- Never modify lockfile manually

### 2. **Parallel Execution**
- Use `pnpm -r` for parallel package execution
- Configure `pnpm-workspace.yaml` for workspace optimization

### 3. **Caching**
- Cache `node_modules` in Jenkins
- Use build cache for faster builds

### 4. **Branch Protection**
- Require passing CI before merge
- Require code review for main branch
- Enable status checks

### 5. **Environment Variables**
- Use Jenkins credentials for secrets
- Never commit sensitive data
- Use `.env` files for local development

### 6. **Documentation**
- Keep CI/CD documentation updated
- Document deployment procedures
- Maintain runbooks for common issues

---

## Quick Reference

### Common Commands

```bash
# Install dependencies
pnpm install

# Run linting
pnpm lint

# Run tests
pnpm test

# Build project
pnpm build

# Clean build artifacts
pnpm clean

# Check for vulnerabilities
pnpm audit
```

### Jenkins Pipeline Triggers

| Trigger | Configuration |
|---------|---------------|
| Push to branch | `triggers { git { branchSpec 'main' } }` |
| Pull request | `triggers { git { branchSpec 'refs/pull/*/head' } }` |
| Schedule | `triggers { cron('H 8 * * 1') }` |
| Upstream project | `triggers { upstream('job-name', 'main') }` |

---

## Appendix: File Checklist

### Required Files

- [ ] `Jenkinsfile`
- [ ] `pnpm-workspace.yaml`
- [ ] `package.json` (root)
- [ ] `.eslintrc.js` / `eslint.config.js`
- [ ] `tsconfig.json`
- [ ] `jest.config.js` (or equivalent)
- [ ] `.gitignore`
- [ ] `.env.example`

### Recommended Files

- [ ] `docker-compose.yml`
- [ ] `Dockerfile`
- [ ] `.github/workflows/` (optional local triggers)
- [ ] `codecov.yml`
- [ ] `README.md` (CI/CD section)

---

## Conclusion

This CI/CD setup provides a robust, cost-effective pipeline for TypeScript monorepos using self-hosted Jenkins and pnpm. By following these practices, you ensure:

- ✅ Consistent code quality
- ✅ Faster development cycles
- ✅ Reduced manual effort
- ✅ Better security posture
- ✅ Zero cloud service costs

Start by implementing the core pipeline stages, then gradually add advanced features like Docker integration, monitoring, and automated deployments.


# Appendix
This `CI-CD.md` document presents a robust and well-thought-out CI/CD pipeline proposal for TypeScript + pnpm monorepo project, especially considering goal of using **self-hosted Jenkins** to avoid cloud service costs.

Here's an analysis of why it aligns with best practices and can be considered "state-of-the-art" for a self-hosted setup:

### Strengths and Alignment with Best Practices:

1.  **Comprehensive Pipeline Stages:** The proposed stages (Checkout, Setup Environment, Install Dependencies, Lint, Test, Build, Security Scan, Deploy) cover all critical aspects of a modern CI/CD workflow. This ensures code quality, functionality, and security are checked at each step.
2.  **Monorepo-Specific Best Practices:**
    *   **`pnpm` Integration:** The document correctly leverages `pnpm`'s capabilities, including `pnpm install --frozen-lockfile` for reproducible builds and `pnpm -r` for running scripts across all packages in the monorepo. This is crucial for efficient monorepo management.
    *   **Standardized `package.json` Scripts:** Encouraging standardized scripts (`lint`, `test`, `build`) within each app/package simplifies the root `package.json` and the `Jenkinsfile`.
3.  **Environment Setup:** The `Jenkinsfile` includes logic to install Node.js and pnpm if they are not present, making the pipeline more self-sufficient and resilient on a potentially fresh Jenkins agent.
4.  **Code Quality & Type Safety:**
    *   **ESLint:** Integration of ESLint for code style and quality is a standard best practice for TypeScript projects.
    *   **TypeScript Configuration:** The `tsconfig.json` settings promote strictness and good module resolution.
5.  **Robust Testing Strategy:**
    *   **Dedicated Test Stage:** Running tests in a dedicated stage is essential.
    *   **Coverage Thresholds:** Configuring coverage thresholds (e.g., in `jest.config.js`) is a strong practice to maintain a high level of test coverage.
6.  **Security Scanning:**
    *   **`pnpm audit`:** Including `pnpm audit` is a fundamental step to identify known vulnerabilities in dependencies.
    *   **Snyk Integration (Optional):** Suggesting Snyk is excellent, as it provides more advanced vulnerability scanning and remediation advice.
7.  **Modern Deployment with Docker:**
    *   **Dockerization:** The inclusion of `Dockerfile` examples and integration into the Jenkins deployment stage is a state-of-the-art approach for packaging and deploying applications in a consistent and scalable manner.
    *   **Branch-Specific Deployment:** Deploying only from specific branches (e.g., `main`) is a common and recommended practice for controlled releases.
8.  **Monitoring & Alerts:** Configuring email, Slack, and webhook notifications ensures that the team is immediately aware of pipeline successes or failures, which is vital for rapid response.
9.  **Comprehensive Best Practices Section:** The "Best Practices" section (Lockfile Management, Parallel Execution, Caching, Branch Protection, Environment Variables, Documentation) demonstrates a deep understanding of maintaining a healthy and efficient CI/CD system. Caching `node_modules` in Jenkins is a particularly important performance optimization.
10. **Clear Documentation:** The document itself is well-structured, easy to read, and provides clear explanations and code examples, which is a best practice for any technical documentation.

### "State-of-the-Art" for Self-Hosted:

While "state-of-the-art" often refers to the latest cloud-native CI/CD solutions (like GitHub Actions, GitLab CI, CircleCI, etc.) that offer tight integration with Git platforms and managed infrastructure, this document describes a "state-of-the-art" approach for a **self-hosted Jenkins environment**.

For a project specifically aiming for "zero cloud service costs" and using Jenkins, this proposal is excellent because it:
*   Leverages Jenkins' flexibility and power.
*   Integrates modern tools like pnpm and Docker effectively.
*   Adheres to widely accepted CI/CD principles.
