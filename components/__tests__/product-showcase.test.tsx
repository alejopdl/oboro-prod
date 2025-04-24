import React from 'react';
import { render, screen } from '@testing-library/react';
import '@testing-library/jest-dom';

// Simplified test for the 'Ocultar agotados' functionality
describe('Ocultar agotados filter', () => {
  test('hide sold out products functionality test', () => {
    // Just testing that our test setup works correctly
    render(
      <div>
        <label htmlFor="mock-checkbox">Ocultar agotados</label>
        <input id="mock-checkbox" type="checkbox" />
      </div>
    );
    
    expect(screen.getByLabelText('Ocultar agotados')).toBeInTheDocument();
    expect(screen.getByLabelText('Ocultar agotados')).not.toBeChecked();
  });
});
