import { render } from '@testing-library/react';

import CLib from './c-lib';

describe('CLib', () => {
  it('should render successfully', () => {
    const { baseElement } = render(<CLib />);
    expect(baseElement).toBeTruthy();
  });
});
