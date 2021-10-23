module.exports = {
    settings: { react: { version: 'detect' } },
    globals: {
        // for process.env.FOO
        process: true,
    },
    env: {
        browser: true,
        es2020: true,
    },
    ignorePatterns: ['*.test.ts'],
    extends: [
        'eslint:recommended',
        'plugin:react/recommended',
        'plugin:@typescript-eslint/recommended',
    ],
    parser: '@typescript-eslint/parser',
    parserOptions: {
        ecmaFeatures: {
            jsx: true,
        },
        ecmaVersion: 11,
        sourceType: 'module',
        project: './tsconfig.json',
    },
    plugins: ['react', 'react-hooks', '@typescript-eslint'],
    rules: {
        '@typescript-eslint/no-unnecessary-type-assertion': 'error',
        'react-hooks/rules-of-hooks': 'error',
        'react-hooks/exhaustive-deps': 'error',
        // No longer necessary for React 17
        'react/react-in-jsx-scope': 'off',
        // TS is enough to ensure property consistencies
        'react/prop-types': 'off',
        // It's not a problem to put "'" or other characters
        // literally in JSX.
        'react/no-unescaped-entities': 'off',
        // Handled by TS/LSP
        '@typescript-eslint/no-unused-vars': 'off',
        // Handled by TS/LSP
        '@typescript-eslint/explicit-module-boundary-types': 'off',
        // Handled by TS/LSP
        '@typescript-eslint/ban-types': 'off',
        // We know what we are doing, thanks.
        '@typescript-eslint/no-non-null-assertion': 'off',
        // We use 'any' on purpose for easier development, with the
        // intent of replacing them ultimately with the right type.
        '@typescript-eslint/no-explicit-any': 'off',
        // If the sole purpose is to pass a function, doing nothing,
        // there is nothing wrong with writing () => {}
        '@typescript-eslint/no-empty-function': 'off',
        // Stop the craziness. Expliciting a type, even if redundant,
        // should not be an error!
        '@typescript-eslint/no-inferrable-types': 'off',
        // We DO want to put unbreakable space sometimes.
        // Typically between a number and prefix/unit, such as
        // in "9.81 m/s²".
        // (Editors should show them explicitly anyway)
        'no-irregular-whitespace': 'off',
        // Using `let` instead of `const` is indeed not optimal, but
        // not actually broken code.
        'prefer-const': 'warn',
        // Empty blocks can happen when waiting for a specific implementation.
        'no-empty': 'warn',
        // while (true) is a pretty current idiom!
        'no-constant-condition': ['error', { checkLoops: false }],
    },
};
