# Backend Tests

This directory contains comprehensive tests for the Presight backend API using Jest.

## Test Structure

```
tests/
├── README.md              # This file
├── setup.ts              # Jest setup and global utilities
├── users.test.ts         # Users API tests (pagination, search, filters)
├── worker.test.ts        # Worker queue tests
└── utils/
    └── test-helpers.ts   # Common test utilities
```

## Running Tests

### Run All Tests

```bash
yarn test
```

### Run Tests in Watch Mode

```bash
yarn test:watch
```

### Run Tests with Coverage

```bash
yarn test:coverage
```

### Run Individual Test Suites

```bash
yarn test:users       # Users API tests
yarn test:worker      # Worker tests
```

### Run Specific Test File

```bash
jest users.test.ts
jest worker.test.ts
```

## Test Features

### Users Tests (`users.test.ts`)

- ✅ Pagination functionality (default and custom)
- ✅ Search functionality with validation
- ✅ Nationality filtering
- ✅ Hobbies filtering (single and multiple)
- ✅ Filters endpoint with data structure validation
- ✅ Invalid parameter handling

### Worker Tests (`worker.test.ts`)

- ✅ Request submission with various data types
- ✅ Status checking for valid and invalid requests
- ✅ Request listing with counts
- ✅ Queue clearing functionality
- ✅ Empty queue handling
- ✅ Request lifecycle validation

## Test Setup

The `setup.ts` file provides:

- Global test configuration
- Server readiness checking
- Timeout configuration
- Global utilities

## Prerequisites

Make sure the server is running before executing tests:

```bash
yarn dev
```

## Jest Configuration

Tests use Jest with:

- TypeScript support via `ts-jest`
- Coverage reporting
- Watch mode for development

## Test Output

Jest provides:

- ✅/❌ Test result indicators
- 📊 Coverage reports
- ⏱️ Execution time
- 📝 Detailed error messages
- 🔄 Watch mode for development
