import { render } from '@testing-library/react';

import Organizer from './organizer';

describe('Organizer', () => {
  it('should render successfully', () => {
    const { baseElement } = render(<Organizer />);
    expect(baseElement).toBeTruthy();
  });
});
