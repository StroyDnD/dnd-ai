/* eslint-disable @typescript-eslint/no-unused-vars */
import type { TestingLibraryMatchers } from "@testing-library/jest-dom/matchers";
import type { expect } from "vitest";

declare global {
  namespace jest {
    type TestingLibraryMatchersExtension<R = void> = TestingLibraryMatchers<typeof expect.stringContaining, R>
  }
}