#!/bin/bash

echo "🔍 Running code quality checks..."

echo "📝 Type checking..."
pnpm type-check
if [ $? -ne 0 ]; then
    echo "❌ Type check failed"
    exit 1
fi

echo "🎨 Checking code formatting..."
pnpm format:check
if [ $? -ne 0 ]; then
    echo "❌ Code formatting check failed"
    exit 1
fi

echo "🔧 Running ESLint..."
pnpm lint
if [ $? -ne 0 ]; then
    echo "❌ ESLint check failed"
    exit 1
fi

echo "🧪 Running tests..."
pnpm test --run
if [ $? -ne 0 ]; then
    echo "❌ Tests failed"
    exit 1
fi

echo "✅ All checks passed!"
