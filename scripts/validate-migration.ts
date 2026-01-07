#!/usr/bin/env bun
/**
 * Migration Validation Script
 * 
 * Validates that the data migration from PostgreSQL to MongoDB was successful
 */

import { validateMigration } from './migrate-data'

async function main() {
  console.log('🔍 Running migration validation...')

  const isValid = await validateMigration()

  if (isValid) {
    console.log('\n✅ Migration validation passed!')
    process.exit(0)
  } else {
    console.log('\n❌ Migration validation failed!')
    process.exit(1)
  }
}

if (import.meta.main) {
  main().catch((error) => {
    console.error('❌ Validation script failed:', error)
    process.exit(1)
  })
}