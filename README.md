# Halooo, Selamat datang di perwebdev-an NESCO 2025!!!

---

## Prerequisites

- [Node.js](https://nodejs.org/en/) >= v21.1.0

---

## Getting Started

1. Clone the repository

   ```bash
   git clone https://github.com/WEB-NESCO-2025/nesco-2025.git
   ```

2. Install the dependencies

   ```bash
   yarn install
   ```

3. Run the development server

   ```bash
   yarn dev
   ```

4. Open [http://localhost:3000](http://localhost:3000) with your browser to see the deployment
   result.

---

## How to Contribute

1. Clone the repository

2. Create a new branch

   ### Branch Naming Convention

   Write your branch name in the following format:

   ```
    <type>/<scope or short description>.<name>
   ```

   example: `feature/hero.harun`

   ### Branch Types

   - `feature`: A new feature
   - `fix`: A bug fix
   - `docs`: Documentation only changes
   - `style`: Changes that do not affect the meaning of the code (white-space, formatting, missing
     semi-colons, etc)
   - `refactor`: A code change that neither fixes a bug nor adds a feature
   - `perf`: A code change that improves performance

3. Make your changes

   Always make sure to follow the linting rules and the code style guide. You can use either
   `javascript` or `typescript` for your code.

   **IMPORTANT**:

   For Frontend developers, the Frontend page is located in the `/app/(main)` folder.

   ```
   └── 📁app
      └── 📁(admin)
      └── 📁(api)
      └── 📁(auth)
      └── 📁(dashboard)
      └── 📁(main)  <-- you will be working here
         └── layout.tsx
         └── page.tsx
      └── actions.ts
   ```

   Watch for linting errors by running:

   ```bash
    yarn lint
   ```

   also the prettier errors by running:

   ```bash
   yarn format:fix
   ```

   or you can auto fix the prettier at saving by adding this configuration to your editor:

   ```json
   "editor.formatOnSave": true
   ```

   > **THIS IS MANDATORY UNLESS YOU WANT YOUR COMMIT TO BE REJECTED**

4. Commit your changes

   ### Commit Message Convention

   Write your commit message in the following format:

   ```
   <type>(<scope>): <short description>
   ```

   > **THIS IS MANDATORY UNLESS YOU WANT YOUR COMMIT TO BE REJECTED**

   example: `feat(hero): add hero section`

   ### Commit Types

   - `ci`: Changes to our CI configuration files and scripts
   - `chore`: Changes to the build process or auxiliary tools and libraries such as documentation
     generation
   - `docs`: Documentation only changes
   - `ticket`: Changes that are related to a ticket
   - `feat`: A new feature
   - `fix`: A bug fix
   - `perf`: A code change that improves performance
   - `refactor`: A code change that neither fixes a bug nor adds a feature
   - `revert`: Reverts a previous commit
   - `style`: Changes that do not affect the meaning of the code (white-space, formatting, missing
     semi-colons, etc)

5. Push your changes

   ```bash
   git push origin <branch-name>
   ```

6. **IMPORTANT** Pull any changes from the develop branch

   ```bash
   git pull origin develop
   ```

   Resolve any conflicts that might arise.

7. Create a pull request

   Go to the repository on GitHub and create a pull request. Make sure to add a detailed description
   and **MENTION [@runs664](https://github.com/runs664) in the description or in the reviewers
   section**.

---
