import fetch from 'node-fetch';

export const BASE_URL = 'http://localhost:5001/api';

export interface TestResult {
  success: boolean;
  message: string;
  data?: any;
  error?: string;
}

export async function makeRequest(
  endpoint: string,
  options: RequestInit = {}
): Promise<TestResult> {
  try {
    const response = await fetch(`${BASE_URL}${endpoint}`, {
      headers: {
        'Content-Type': 'application/json',
        ...options.headers,
      },
      ...options,
    });

    const data = await response.json();

    return {
      success: response.ok,
      message: response.ok ? 'Request successful' : 'Request failed',
      data,
      error: response.ok ? undefined : `HTTP ${response.status}: ${data.error || 'Unknown error'}`,
    };
  } catch (error) {
    return {
      success: false,
      message: 'Request failed',
      error: error instanceof Error ? error.message : 'Unknown error',
    };
  }
}

export function logTestResult(testName: string, result: TestResult): void {
  if (result.success) {
    console.log(`✅ ${testName}: ${result.message}`);
  } else {
    console.log(`❌ ${testName}: ${result.error || result.message}`);
  }
}

export function logSection(title: string): void {
  console.log(`\n${title}`);
  console.log('-'.repeat(title.length));
}

export function logSummary(passed: number, total: number, duration: number): void {
  console.log('\n' + '='.repeat(50));
  console.log('📊 TEST SUMMARY');
  console.log('='.repeat(50));
  console.log(`✅ Passed: ${passed}/${total}`);
  console.log(`⏱️ Duration: ${duration}ms`);

  if (passed === total) {
    console.log('🎉 All tests passed!');
  } else {
    console.log('⚠️ Some tests failed. Check the output above for details.');
  }
}
