import { render } from '@testing-library/react';

import C from './c';

describe('C', () => {
  it('should render successfully', () => {
    const { baseElement } = render(<C />);
    expect(baseElement).toBeTruthy();
  });
});
