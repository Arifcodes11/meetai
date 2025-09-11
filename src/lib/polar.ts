import {Polar} from "@polar-sh/sdk";

// Create a mock Polar client when no access token is provided
const createMockPolarClient = () => {
  return {
    customers: {
      getStateExternal: async () => ({ activeSubscriptions: [] }),
    },
    products: {
      get: async () => ({}),
      list: async () => ({ result: { items: [] } }),
    },
  };
};

// Use real client if token exists, otherwise use mock client
export const polarClient = process.env.POLAR_ACCESS_TOKEN
  ? new Polar ({
      accessToken: process.env.POLAR_ACCESS_TOKEN,
      server: "sandbox",
    })
  : createMockPolarClient() as unknown as Polar;