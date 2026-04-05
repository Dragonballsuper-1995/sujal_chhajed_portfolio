import { test, expect } from '@playwright/test';

test('verify brutalist reveal scroll animation', async ({ page }) => {
  // Navigate to the local server
  await page.goto('http://localhost:5173');

  // Wait for the initial loading animation to finish (it has a timeout in App.tsx)
  await page.waitForTimeout(3000); // Adjust if the loader takes longer

  // Take a screenshot of the initial state
  await page.screenshot({ path: 'verification/initial-state.png' });

  // Scroll down slightly to trigger the pinning and overlapping
  await page.evaluate(() => window.scrollBy(0, 500));
  await page.waitForTimeout(1000); // Wait for GSAP animation to settle
  await page.screenshot({ path: 'verification/scroll-step-1.png' });

  // Scroll down further
  await page.evaluate(() => window.scrollBy(0, 500));
  await page.waitForTimeout(1000); // Wait for GSAP animation to settle
  await page.screenshot({ path: 'verification/scroll-step-2.png' });

  // Scroll to the About section
  await page.evaluate(() => {
    const aboutSection = document.getElementById('about');
    if (aboutSection) {
      aboutSection.scrollIntoView({ behavior: 'smooth' });
    }
  });
  await page.waitForTimeout(2000); // Wait for smooth scroll and animation
  await page.screenshot({ path: 'verification/about-visible.png' });

  // Start recording video
  // Note: Playwright doesn't have a direct "record video now" API in the test context
  // without setting it up in the config, but we can capture multiple frames or
  // rely on the user to check the screenshots. We will use a script that records video
  // if available, but screenshots are our primary tool here.
});
