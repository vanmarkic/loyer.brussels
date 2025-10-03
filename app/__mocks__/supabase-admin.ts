/**
 * Mock Supabase Admin Client for Testing
 *
 * This mock provides a fake Supabase client that can be used in tests
 * without requiring actual database credentials.
 *
 * Usage:
 *   vi.mock("@/app/server/supabase-admin", () => mockSupabaseAdmin)
 */

export const mockSupabaseAdmin = {
  // Track whether we have credentials (for skip logic)
  hasSupabaseAdminCredentials: false,

  // Mock Supabase client
  supabaseAdmin: {
    from: (table: string) => ({
      insert: (data: any) => ({
        select: () => ({
          single: async () => {
            // Simulate successful insert with returned data
            const insertedData = Array.isArray(data) ? data[0] : data;
            return {
              data: {
                ...insertedData,
                id: Math.floor(Math.random() * 100000), // Generate random ID
              },
              error: null,
            };
          },
        }),
      }),
      select: (columns?: string) => ({
        eq: (column: string, value: any) => ({
          single: async () => {
            // Simulate successful select
            return {
              data: {
                id: 1,
                [column]: value,
              },
              error: null,
            };
          },
        }),
      }),
      delete: () => ({
        eq: (column: string, value: any) => ({
          // Simulate successful delete
          then: async (callback: any) => callback({ error: null }),
        }),
      }),
    }),
  },
};

/**
 * Mock Supabase Admin with Error Responses
 * Use this to test error handling
 */
export const mockSupabaseAdminWithError = (errorMessage: string) => ({
  hasSupabaseAdminCredentials: false,

  supabaseAdmin: {
    from: (table: string) => ({
      insert: (data: any) => ({
        select: () => ({
          single: async () => ({
            data: null,
            error: {
              message: errorMessage,
              details: "Mock error for testing",
              hint: "This is a simulated error",
              code: "MOCK_ERROR",
            },
          }),
        }),
      }),
      select: (columns?: string) => ({
        eq: (column: string, value: any) => ({
          single: async () => ({
            data: null,
            error: {
              message: errorMessage,
              details: "Mock error for testing",
              hint: "This is a simulated error",
              code: "MOCK_ERROR",
            },
          }),
        }),
      }),
      delete: () => ({
        eq: (column: string, value: any) => ({
          then: async (callback: any) => callback({
            error: {
              message: errorMessage,
              details: "Mock error for testing",
              code: "MOCK_ERROR",
            },
          }),
        }),
      }),
    }),
  },
});

/**
 * Create a custom mock with specific responses
 */
export const createMockSupabaseAdmin = (responses: {
  insert?: { data?: any; error?: any };
  select?: { data?: any; error?: any };
  delete?: { error?: any };
} = {}) => ({
  hasSupabaseAdminCredentials: false,

  supabaseAdmin: {
    from: (table: string) => ({
      insert: (data: any) => ({
        select: () => ({
          single: async () => responses.insert || {
            data: {
              ...(Array.isArray(data) ? data[0] : data),
              id: Math.floor(Math.random() * 100000),
            },
            error: null,
          },
        }),
      }),
      select: (columns?: string) => ({
        eq: (column: string, value: any) => ({
          single: async () => responses.select || {
            data: { id: 1, [column]: value },
            error: null,
          },
        }),
      }),
      delete: () => ({
        eq: (column: string, value: any) => ({
          then: async (callback: any) => callback(responses.delete || { error: null }),
        }),
      }),
    }),
  },
});

export default mockSupabaseAdmin;
