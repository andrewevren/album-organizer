import { render } from '@testing-library/react';

import Shelf from './shelf';

describe('Shelf', () => {
  it('should render successfully', () => {
    const { baseElement } = render(<Shelf />);
    expect(baseElement).toBeTruthy();
  });
});
