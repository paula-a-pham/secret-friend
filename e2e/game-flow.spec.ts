import { test, expect } from '@playwright/test'

test.describe('Full game flow', () => {
  test.beforeEach(async ({ page }) => {
    await page.goto('/')
    // Clear any saved state
    await page.evaluate(() => localStorage.clear())
    await page.reload()
  })

  test('home screen shows title and start button', async ({ page }) => {
    await expect(page.getByText('Secret Friend')).toBeVisible()
    await expect(page.getByText('Start New Game')).toBeVisible()
  })

  test('complete game: setup PIN → add players → draw → results', async ({ page }) => {
    // Step 1: Click start
    await page.getByText('Start New Game').click()

    // Step 2: Enter PIN
    await expect(page.getByText('Set Organizer PIN')).toBeVisible()
    const pinInputs = page.getByRole('textbox')
    await pinInputs.first().click()
    await page.keyboard.type('1234')
    await expect(page.getByText('PIN Set!')).toBeVisible()

    // Step 3: Add participants
    await expect(page.getByText('Add Participants')).toBeVisible({ timeout: 2000 })
    const nameInput = page.getByPlaceholder('Enter a name...')

    await nameInput.fill('Alice')
    await page.getByRole('button', { name: 'Add' }).click()
    await nameInput.fill('Bob')
    await page.getByRole('button', { name: 'Add' }).click()
    await nameInput.fill('Carol')
    await page.getByRole('button', { name: 'Add' }).click()

    await expect(page.getByText('3 participants added')).toBeVisible()
    await page.getByText('Start Drawing!').click()

    // Step 4: Draw names for each participant
    await expect(page.getByText('Draw Names')).toBeVisible()
    await expect(page.getByText('0 of 3 have drawn')).toBeVisible()

    // Draw for each person
    for (const name of ['Alice', 'Bob', 'Carol']) {
      await page.getByRole('button', { name: `${name} — tap to draw` }).click()

      // Privacy screen
      await expect(page.getByText('Hand the device to')).toBeVisible()
      await page.getByText(`I'm ${name} — Draw!`).click()

      // Wait for shuffle + reveal
      await expect(page.getByText('Your secret friend is')).toBeVisible({ timeout: 5000 })
      await page.getByText('Accept').click()
    }

    // Step 5: View results
    await page.getByText('All Done — View Results').click()

    // Enter PIN to unlock
    await expect(page.getByText('View Results')).toBeVisible()
    const resultPinInputs = page.getByRole('textbox')
    await resultPinInputs.first().click()
    await page.keyboard.type('1234')
    await expect(page.getByText('Unlocked!')).toBeVisible()

    // Verify results page shows all participants as flip cards
    await expect(page.getByText('Secret Friends')).toBeVisible({ timeout: 2000 })
    await expect(page.getByText('Tap a card to reveal the secret friend')).toBeVisible()
  })

  test('wrong PIN shows error on results screen', async ({ page }) => {
    // Set up a completed game via localStorage
    await page.evaluate(() => {
      const game = {
        phase: 'results',
        participants: ['Alice', 'Bob', 'Carol'],
        pin: '5678',
        assignments: { Alice: 'Bob', Bob: 'Carol', Carol: 'Alice' },
        drawn: ['Alice', 'Bob', 'Carol'],
        pool: [],
      }
      localStorage.setItem('secret-friend-game', JSON.stringify(game))
    })
    await page.reload()

    await page.getByText('Continue Game').click()
    await expect(page.getByText('View Results')).toBeVisible()

    const pinInputs = page.getByRole('textbox')
    await pinInputs.first().click()
    await page.keyboard.type('0000')

    await expect(page.getByText('Wrong PIN')).toBeVisible()
  })
})

test.describe('Game persistence', () => {
  test('saved game shows continue button', async ({ page }) => {
    await page.goto('/')
    await page.evaluate(() => {
      const game = {
        phase: 'draw',
        participants: ['Alice', 'Bob', 'Carol'],
        pin: '1234',
        assignments: {},
        drawn: [],
        pool: ['Alice', 'Bob', 'Carol'],
      }
      localStorage.setItem('secret-friend-game', JSON.stringify(game))
    })
    await page.reload()

    await expect(page.getByText('Continue Game')).toBeVisible()
    await expect(page.getByText('Reset Everything')).toBeVisible()
  })

  test('reset clears saved game', async ({ page }) => {
    await page.goto('/')
    await page.evaluate(() => {
      const game = {
        phase: 'draw',
        participants: ['Alice', 'Bob', 'Carol'],
        pin: '1234',
        assignments: {},
        drawn: [],
        pool: ['Alice', 'Bob', 'Carol'],
      }
      localStorage.setItem('secret-friend-game', JSON.stringify(game))
    })
    await page.reload()

    await page.getByText('Reset Everything').click()
    await expect(page.getByText('This will delete your saved game. Are you sure?')).toBeVisible()
    await page.getByRole('button', { name: 'Reset', exact: true }).click()

    // After a brief delay, the dialog closes and continue should be gone
    await expect(page.getByText('Continue Game')).not.toBeVisible({ timeout: 2000 })
  })
})

test.describe('Setup validation', () => {
  test('prevents duplicate names', async ({ page }) => {
    await page.goto('/')
    await page.getByText('Start New Game').click()

    // Enter PIN
    await page.getByRole('textbox').first().click()
    await page.keyboard.type('1234')
    await expect(page.getByText('Add Participants')).toBeVisible({ timeout: 2000 })

    const nameInput = page.getByPlaceholder('Enter a name...')
    await nameInput.fill('Alice')
    await page.getByRole('button', { name: 'Add' }).click()
    await nameInput.fill('Alice')
    await page.getByRole('button', { name: 'Add' }).click()

    await expect(page.getByText('Name already added')).toBeVisible()
  })

  test('requires at least 3 participants', async ({ page }) => {
    await page.goto('/')
    await page.getByText('Start New Game').click()

    await page.getByRole('textbox').first().click()
    await page.keyboard.type('1234')
    await expect(page.getByText('Add Participants')).toBeVisible({ timeout: 2000 })

    const nameInput = page.getByPlaceholder('Enter a name...')
    await nameInput.fill('Alice')
    await page.getByRole('button', { name: 'Add' }).click()
    await nameInput.fill('Bob')
    await page.getByRole('button', { name: 'Add' }).click()

    // Button should be disabled with only 2 participants
    await expect(page.getByText('Start Drawing!')).toBeDisabled()
    await expect(page.getByText('(need at least 3)')).toBeVisible()
  })
})
