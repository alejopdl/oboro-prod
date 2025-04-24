module.exports = {
  ci: {
    collect: {
      // Static HTML target configuration
      staticDistDir: './.next',
      // Or URL based configuration
      url: [
        'http://localhost:3000/',
        'http://localhost:3000/producto/1',
        // Add other critical pages
      ],
      numberOfRuns: 3,
      settings: {
        // Lighthouse settings
        preset: 'desktop', // 'mobile' or 'desktop'
        formFactor: 'desktop', // 'mobile' or 'desktop'
        throttling: {
          rttMs: 40,
          throughputKbps: 10240,
          cpuSlowdownMultiplier: 1,
        },
        // Setting high thresholds to match project goals
        chromeFlags: '--headless --no-sandbox',
      },
    },
    upload: {
      // Artifacts upload (optional)
      target: 'temporary-public-storage',
    },
    assert: {
      // Assertions to enforce high performance standards
      assertions: {
        // Performance scores
        'categories:performance': ['error', {minScore: 0.9}],
        'categories:accessibility': ['error', {minScore: 0.9}],
        'categories:best-practices': ['error', {minScore: 0.9}],
        'categories:seo': ['error', {minScore: 0.9}],

        // Core Web Vitals
        'largest-contentful-paint': ['error', {maxNumericValue: 2500}],
        'first-contentful-paint': ['error', {maxNumericValue: 1800}],
        'speed-index': ['error', {maxNumericValue: 3000}],
        'interactive': ['error', {maxNumericValue: 3500}],
        'total-blocking-time': ['error', {maxNumericValue: 200}],
        'cumulative-layout-shift': ['error', {maxNumericValue: 0.1}],
        
        // Accessibility requirements for WCAG 2.1 AA
        'aria-allowed-attr': ['error', {level: 'error'}],
        'aria-required-attr': ['error', {level: 'error'}],
        'aria-required-children': ['error', {level: 'error'}],
        'aria-required-parent': ['error', {level: 'error'}],
        'aria-roles': ['error', {level: 'error'}],
        'aria-valid-attr-value': ['error', {level: 'error'}],
        'aria-valid-attr': ['error', {level: 'error'}],
        'button-name': ['error', {level: 'error'}],
        'color-contrast': ['error', {level: 'error'}],
        'document-title': ['error', {level: 'error'}],
        'html-has-lang': ['error', {level: 'error'}],
        'image-alt': ['error', {level: 'error'}],
        'link-name': ['error', {level: 'error'}],
        'list': ['error', {level: 'error'}],
        'meta-viewport': ['error', {level: 'error'}],
      },
    },
  },
};
