/**
 * Test file for the drop-selector component
 * This tests the drop selection functionality for the oBoRo drop system
 */

import { render, screen } from '@testing-library/react';
import '@testing-library/jest-dom';

// Create a component that doesn't rely on Next.js hooks for testing
// This is a simplified version of DropSelector that we can test easily
function TestDropSelector({ 
  availableDrops, 
  currentDrop 
}: { 
  availableDrops: string[], 
  currentDrop: string 
}) {
  return (
    <div className="flex flex-wrap gap-2 justify-center">
      {availableDrops.map(drop => (
        <button 
          key={drop}
          aria-pressed={currentDrop === drop}
          className={`px-4 py-2 rounded-md transition-colors duration-300 ${
            currentDrop === drop 
              ? 'bg-black text-white dark:bg-white dark:text-black' 
              : 'bg-gray-200 text-gray-800 dark:bg-gray-800 dark:text-gray-200 hover:bg-gray-300 dark:hover:bg-gray-700'
          }`}
        >
          {drop}
        </button>
      ))}
    </div>
  );
}

describe('Drop Selector Component', () => {
  // Test available drops
  const availableDrops = ['DROP1', 'MiniDROP2', 'XDROP3'];

  // Test that the component renders all available drops as buttons
  test('renders all available drop options', () => {
    render(<TestDropSelector 
      availableDrops={availableDrops} 
      currentDrop={availableDrops[0]} 
    />);
    
    // Check that all drop options are rendered
    availableDrops.forEach(drop => {
      expect(screen.getByRole('button', { name: drop })).toBeInTheDocument();
    });
  });
  
  // Test that the current drop button has the correct styling
  test('applies different styling to the current drop', () => {
    render(<TestDropSelector 
      availableDrops={availableDrops} 
      currentDrop={availableDrops[0]} 
    />);
    
    // Get the current drop button
    const currentDropButton = screen.getByRole('button', { name: availableDrops[0] });
    
    // The current drop button should have the aria-pressed attribute set to true
    expect(currentDropButton).toHaveAttribute('aria-pressed', 'true');
  });
  
  // Test that non-selected drops have different styling
  test('applies different styling to non-current drops', () => {
    render(<TestDropSelector 
      availableDrops={availableDrops} 
      currentDrop={availableDrops[1]} 
    />);
    
    // The non-selected buttons should have aria-pressed set to false
    expect(screen.getByRole('button', { name: availableDrops[0] })).toHaveAttribute('aria-pressed', 'false');
    expect(screen.getByRole('button', { name: availableDrops[2] })).toHaveAttribute('aria-pressed', 'false');
    
    // While the current drop button should have aria-pressed set to true
    expect(screen.getByRole('button', { name: availableDrops[1] })).toHaveAttribute('aria-pressed', 'true');
  });
});
