import { NyTimesPage } from './app.po';

describe('ny-times App', function() {
  let page: NyTimesPage;

  beforeEach(() => {
    page = new NyTimesPage();
  });

  it('should display message saying app works', () => {
    page.navigateTo();
    expect(page.getParagraphText()).toEqual('app works!');
  });
});
