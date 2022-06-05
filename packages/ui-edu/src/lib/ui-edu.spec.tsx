import { render } from '@testing-library/react';

import UiEdu from './ui-edu';

describe('UiEdu', () => {
  it('should render successfully', () => {
    const { baseElement } = render(<UiEdu />);
    expect(baseElement).toBeTruthy();
  });
});
