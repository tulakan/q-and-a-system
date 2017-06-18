import { QandASystemPage } from './app.po';

describe('qand-a-system App', () => {
  let page: QandASystemPage;

  beforeEach(() => {
    page = new QandASystemPage();
  });

  it('should display message saying app works', () => {
    page.navigateTo();
    expect(page.getParagraphText()).toEqual('app works!');
  });
});
