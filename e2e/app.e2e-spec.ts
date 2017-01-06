import { BailoutAdminPage } from './app.po';

describe('bailout-admin App', function() {
  let page: BailoutAdminPage;

  beforeEach(() => {
    page = new BailoutAdminPage();
  });

  it('should display message saying app works', () => {
    page.navigateTo();
    expect(page.getParagraphText()).toEqual('app works!');
  });
});
