import { test, expect } from '@playwright/test';

test.beforeEach(async ({ page }) => {
  await page.goto('https://wrstg.app.staging.workramp.com/login');
});

test('test', async ({ page }) => {
  //login
  await page.getByPlaceholder('Email Address').click();
  await page.getByPlaceholder('Email Address').fill('wrtest01@wrstg.com');

  await page.getByPlaceholder('Password').click();
  await page.getByPlaceholder('Password').fill('Testing01');

  await page.getByRole('button', { name: 'Log In' }).click();

  //create guide
  await page.getByRole('link', { name: 'Content' }).click();
  await page.getByRole('paragraph').filter({ hasText: 'Create New' }).click();
  await page.locator('a').filter({ hasText: 'Guide' }).click();
  await page.getByRole('textbox', { name: 'Enter a name' }).fill('Testing Guide');
  await page.getByRole('button', { name: 'Save' }).click();
  //add text to page
  await page.locator('.redactor-styles').fill('This is a test guide');
  await expect(page.locator('.redactor-styles')).toHaveText('This is a test guide');

  //rename task
  await page.locator('.react-tooltip-lite-black-rounded').first().hover();
  await page.locator('.react-tooltip-lite-black-rounded').first().click();
  await page.getByRole('textbox', { name: 'Enter a title' }).click();
  await page.getByRole('textbox', { name: 'Enter a title' }).fill('New test task');
  await page.getByRole('button', { name: 'Save' }).click();
  // assert that the task has been renamed
  await expect(page.locator('span').filter({ hasText: 'New test task' })).toHaveText(
    'New test task',
  );

  //add a to-do checklist
  await page
    .getByText('To-Do Checklist')
    .dragTo(page.locator('div').filter({ hasText: 'Text' }).first());

  await page.getByPlaceholder('Add checklist item').click();
  await page.getByPlaceholder('Add checklist item').fill('Number one');
  await page.getByRole('link', { name: '+ Add new checklist item' }).click();
  await page.getByPlaceholder('Add checklist item').nth(1).click();
  await page.getByPlaceholder('Add checklist item').nth(1).type('Number Two');

  await page.getByRole('link', { name: 'Add Answer Hint' }).click();
  await page.getByPlaceholder('Add Answer Hint...').click();
  await page.getByPlaceholder('Add Answer Hint...').type('Test Hint');

  //assert that the checklist has been added
  await expect(page.getByText('Number one')).toBeVisible();
  await expect(page.getByText('Number Two')).toBeVisible();
  await expect(page.getByPlaceholder('Add Answer Hint...')).toHaveValue('Test Hint');

  // add a multiple choice question
  await page.getByText('Multiple Choice').dragTo(page.getByText('To-Do ChecklistRequired'));

  await page.getByPlaceholder('Add question').click();
  await page.getByPlaceholder('Add question').fill('What is the best color?');

  await page.getByPlaceholder('Add Answer Choice').click();
  await page.getByPlaceholder('Add Answer Choice').fill('Red');
  await page.getByRole('checkbox').check();
  await page.getByRole('link', { name: '+ Add new choice' }).click();
  await page.getByPlaceholder('Add Answer Choice').nth(1).click();
  await page.getByPlaceholder('Add Answer Choice').nth(1).fill('Blue');

  await page.getByRole('link', { name: 'Add Answer Explanation' }).click();
  await page.getByPlaceholder('Add Answer Explanation...').fill('An Explanation Here');

  //assert that the multiple choice question has been added
  await expect(page.getByPlaceholder('Add Answer Choice').first()).toHaveText('Red');
  await expect(page.getByPlaceholder('Add Answer Choice').nth(1)).toHaveText('Blue');
  await expect(page.getByPlaceholder('Add Answer Explanation...')).toHaveText(
    'An Explanation Here',
  );

  //leave a comment
  await page.getByText('Comments').click();
  await page.getByPlaceholder('Comment or mention others with @').click();
  await page.getByPlaceholder('Comment or mention others with @').fill('Left a comment here');
  await page.getByPlaceholder('Comment or mention others with @').click();
  await page.getByPlaceholder('Comment or mention others with @').press('Meta+Enter');

  //assert that the comment has been added
  await expect(page.getByText('Left a comment here')).toBeVisible();

  //assert that data persists after refresh
  await page.reload();
  await expect(page.locator('span').filter({ hasText: 'New test task' })).toBeVisible();
  await expect(page.getByText('Number one')).toBeVisible();
  await expect(page.getByText('Number Two')).toBeVisible();
  await expect(page.getByPlaceholder('Add Answer Hint...')).toHaveValue('Test Hint');
  await expect(page.getByPlaceholder('Add Answer Choice').first()).toHaveText('Red');
  await expect(page.getByPlaceholder('Add Answer Choice').nth(1)).toHaveText('Blue');
  await expect(page.getByPlaceholder('Add Answer Explanation...')).toHaveText(
    'An Explanation Here',
  );
});
