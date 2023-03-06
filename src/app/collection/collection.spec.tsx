import { render } from '@testing-library/react';

import Collection from './collection';

describe('Collection', () => {
  it('should render successfully', () => {
    const { baseElement } = render(<Collection />);
    expect(baseElement).toBeTruthy();
  });
});
