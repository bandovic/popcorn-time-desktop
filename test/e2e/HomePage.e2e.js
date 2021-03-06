import { Selector } from 'testcafe';
import {
  BASE_URL,
  getPageTitle,
  getPageUrl,
  cardlistSelector,
  cardSelector,
  scrollBottom,
  navigateTo,
  clearConfigs
} from './helpers';

fixture`Home Page`.page(BASE_URL).beforeEach(() => clearConfigs());

test('it should have the expected title', async t => {
  await t.expect(getPageTitle()).eql('Popcorn Time');
});

test('it should display cards list and cards', async t => {
  await navigateTo(t, 'shows');
  await t
    .expect(cardlistSelector.visible)
    .ok()
    .expect(cardSelector.visible)
    .ok();
});

test('it should search items', async t => {
  await t.typeText('#pct-search-input', 'harry potter').pressKey('enter');
  await t
    .expect(
      (await cardSelector.find('.Card--title').nth(0).innerText).toLowerCase()
    )
    .contains('harry potter');
});

test('it should search items (2)', async t => {
  await navigateTo(t, 'home');
  await t
    .typeText('#pct-search-input', 'lord of the rings', { replace: true })
    .pressKey('enter');
  await t
    .expect(
      (await cardSelector.find('.Card--title').nth(0).innerText).toLowerCase()
    )
    .contains('lord of the rings');
});

test('it should navigate to item on CardList click', async t => {
  await navigateTo(t, 'shows');
  await t
    .click(cardSelector)
    .expect(getPageUrl())
    .contains('#/item/shows/')
    .expect(Selector('#title').visible)
    .ok()
    .expect(Selector('#summary').visible)
    .ok();
});

test('it should navigate between movies and shows', async t => {
  await navigateTo(t, 'shows');
  await t
    .expect(getPageUrl())
    .contains('#/item/shows')
  await navigateTo(t, 'movies');
  await t
    .expect(getPageUrl())
    .contains('#/item/movies');
});

test('it should paginate items on scroll to bottom of viewport', async t => {
  await navigateTo(t, 'shows');

  const selector1 = await Selector('.Card a').count;
  await scrollBottom();
  await t
    .expect(Selector('.Loader').visible)
    .notOk()
    .wait(3000);
  const selector2 = await Selector('.Card a').count;

  await t.expect(selector1).lt(selector2);
});
