import { MyNewsPage } from './app.po';

describe('my-news App', function() {
  let page: MyNewsPage;

  beforeEach(() => {
    page = new MyNewsPage();
  });

  it('should display message saying app works', () => {
    page.navigateTo();
    expect(page.getParagraphText()).toEqual('app works!');
  });
});
