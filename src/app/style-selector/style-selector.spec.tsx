import { render } from '@testing-library/react';

import StyleSelector from './style-selector';

describe('StyleSelector', () => {
  it('should render successfully', () => {
    const { baseElement } = render(<StyleSelector />);
    expect(baseElement).toBeTruthy();
  });
});
