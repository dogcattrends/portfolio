module.exports = {
  ci: {
    collect: {
      startServerCommand: "npm run start -- --hostname 0.0.0.0 --port 3000",
      startServerReadyPattern: "started server on",
      url: ["http://localhost:3000/", "http://localhost:3000/inventory"],
      numberOfRuns: 1
    },
    assert: {
      assertions: {
        "categories:performance": ["warn", { minScore: 0.9 }],
        "largest-contentful-paint": ["error", { maxNumericValue: 2500 }],
        "cumulative-layout-shift": ["error", { maxNumericValue: 0.1 }]
      }
    },
    upload: {
      target: "temporary-public-storage"
    }
  }
};
