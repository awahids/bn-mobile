import path from "node:path"
import { fileURLToPath } from "node:url"

import coreWebVitals from "eslint-config-next/core-web-vitals"

const __filename = fileURLToPath(import.meta.url)
const __dirname = path.dirname(__filename)

export default [
  {
    ignores: [
      ".next/**",
      "node_modules/**",
      "dist/**",
      "out/**",
      "tsconfig.tsbuildinfo",
      "bun.lockb",
      "package-lock.json",
    ],
  },
  ...coreWebVitals,
  {
    rules: {
      "react-hooks/set-state-in-effect": "off",
    },
  },
]
