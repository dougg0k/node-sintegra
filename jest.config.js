module.exports = {
	preset: "ts-jest",
	testEnvironment: "node",
	reporters: ["default"],
	testMatch: ["**/test/**/*.test.ts"],
	verbose: true,
	collectCoverage: false,
	collectCoverageFrom: ["src/**/*.ts"],
	coveragePathIgnorePatterns: ["/node_modules/"],
	coverageReporters: ["text"],
	moduleFileExtensions: ["ts", "js"],
	testTimeout: 50000,
};
