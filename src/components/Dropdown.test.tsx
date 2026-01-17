import { describe, it, expect, vi } from 'vitest';
import { render, screen, fireEvent, userEvent } from '../test/test-utils';
import { Dropdown } from './Dropdown';
import { Heart } from 'lucide-react';

const mockOptions = [
  { value: 'option1', label: 'Option 1' },
  { value: 'option2', label: 'Option 2' },
  { value: 'option3', label: 'Option 3' },
];

const mockOptionsWithIcons = [
  { value: 'love', label: 'Love', icon: <Heart data-testid="heart-icon" /> },
  { value: 'other', label: 'Other' },
];

describe('Dropdown', () => {
  it('renders with placeholder when no value selected', () => {
    render(
      <Dropdown
        options={mockOptions}
        value=""
        onChange={() => {}}
        placeholder="Select an option"
        aria-label="Test dropdown"
      />
    );
    
    expect(screen.getByText('Select an option')).toBeInTheDocument();
  });

  it('renders with selected value label', () => {
    render(
      <Dropdown
        options={mockOptions}
        value="option2"
        onChange={() => {}}
        aria-label="Test dropdown"
      />
    );
    
    expect(screen.getByText('Option 2')).toBeInTheDocument();
  });

  it('opens dropdown menu on click', () => {
    render(
      <Dropdown
        options={mockOptions}
        value="option1"
        onChange={() => {}}
        aria-label="Test dropdown"
      />
    );
    
    const trigger = screen.getByRole('button');
    fireEvent.click(trigger);
    
    // Options should be visible
    expect(screen.getByRole('listbox')).toBeInTheDocument();
    expect(screen.getAllByRole('option')).toHaveLength(3);
  });

  it('calls onChange when option is selected', () => {
    const handleChange = vi.fn();
    
    render(
      <Dropdown
        options={mockOptions}
        value="option1"
        onChange={handleChange}
        aria-label="Test dropdown"
      />
    );
    
    // Open dropdown
    fireEvent.click(screen.getByRole('button'));
    
    // Click on option 3
    fireEvent.click(screen.getByText('Option 3'));
    
    expect(handleChange).toHaveBeenCalledWith('option3');
  });

  it('closes dropdown after selection', () => {
    render(
      <Dropdown
        options={mockOptions}
        value="option1"
        onChange={() => {}}
        aria-label="Test dropdown"
      />
    );
    
    // Open dropdown
    fireEvent.click(screen.getByRole('button'));
    expect(screen.getByRole('listbox')).toBeInTheDocument();
    
    // Select option
    fireEvent.click(screen.getByText('Option 2'));
    
    // Dropdown should close
    expect(screen.queryByRole('listbox')).not.toBeInTheDocument();
  });

  it('shows checkmark for selected option', () => {
    render(
      <Dropdown
        options={mockOptions}
        value="option2"
        onChange={() => {}}
        aria-label="Test dropdown"
      />
    );
    
    fireEvent.click(screen.getByRole('button'));
    
    const selectedOption = screen.getByRole('option', { name: /Option 2/i });
    expect(selectedOption).toHaveAttribute('aria-selected', 'true');
  });

  it('renders options with icons', () => {
    render(
      <Dropdown
        options={mockOptionsWithIcons}
        value="love"
        onChange={() => {}}
        aria-label="Test dropdown"
      />
    );
    
    fireEvent.click(screen.getByRole('button'));
    
    expect(screen.getByTestId('heart-icon')).toBeInTheDocument();
  });

  it('renders with custom icon in trigger', () => {
    render(
      <Dropdown
        options={mockOptions}
        value="option1"
        onChange={() => {}}
        icon={<Heart data-testid="trigger-icon" />}
        aria-label="Test dropdown"
      />
    );
    
    expect(screen.getByTestId('trigger-icon')).toBeInTheDocument();
  });

  it('has correct ARIA attributes', () => {
    render(
      <Dropdown
        options={mockOptions}
        value="option1"
        onChange={() => {}}
        aria-label="Sort by"
      />
    );
    
    const trigger = screen.getByRole('button');
    expect(trigger).toHaveAttribute('aria-haspopup', 'listbox');
    expect(trigger).toHaveAttribute('aria-expanded', 'false');
    expect(trigger).toHaveAttribute('aria-label', 'Sort by');
    
    // Open and check expanded state
    fireEvent.click(trigger);
    expect(trigger).toHaveAttribute('aria-expanded', 'true');
  });

  it('closes on Escape key', () => {
    render(
      <Dropdown
        options={mockOptions}
        value="option1"
        onChange={() => {}}
        aria-label="Test dropdown"
      />
    );
    
    const trigger = screen.getByRole('button');
    fireEvent.click(trigger);
    expect(screen.getByRole('listbox')).toBeInTheDocument();
    
    fireEvent.keyDown(trigger, { key: 'Escape' });
    expect(screen.queryByRole('listbox')).not.toBeInTheDocument();
  });

  it('opens with Enter key', async () => {
    const user = userEvent.setup();
    
    render(
      <Dropdown
        options={mockOptions}
        value="option1"
        onChange={() => {}}
        aria-label="Test dropdown"
      />
    );
    
    const trigger = screen.getByRole('button');
    trigger.focus();
    await user.keyboard('{Enter}');
    
    expect(screen.getByRole('listbox')).toBeInTheDocument();
  });

  it('opens with Space key', async () => {
    const user = userEvent.setup();
    
    render(
      <Dropdown
        options={mockOptions}
        value="option1"
        onChange={() => {}}
        aria-label="Test dropdown"
      />
    );
    
    const trigger = screen.getByRole('button');
    trigger.focus();
    await user.keyboard(' ');
    
    expect(screen.getByRole('listbox')).toBeInTheDocument();
  });

  it('navigates with ArrowDown key', async () => {
    const user = userEvent.setup();
    const handleChange = vi.fn();
    
    render(
      <Dropdown
        options={mockOptions}
        value="option1"
        onChange={handleChange}
        aria-label="Test dropdown"
      />
    );
    
    const trigger = screen.getByRole('button');
    trigger.focus();
    
    // Arrow down to open
    await user.keyboard('{ArrowDown}');
    expect(screen.getByRole('listbox')).toBeInTheDocument();
    
    // Arrow down to move focus, then Enter to select
    await user.keyboard('{ArrowDown}');
    await user.keyboard('{Enter}');
    
    expect(handleChange).toHaveBeenCalled();
  });

  it('closes on Tab key', () => {
    render(
      <Dropdown
        options={mockOptions}
        value="option1"
        onChange={() => {}}
        aria-label="Test dropdown"
      />
    );
    
    const trigger = screen.getByRole('button');
    fireEvent.click(trigger);
    expect(screen.getByRole('listbox')).toBeInTheDocument();
    
    fireEvent.keyDown(trigger, { key: 'Tab' });
    expect(screen.queryByRole('listbox')).not.toBeInTheDocument();
  });

  it('applies custom className', () => {
    const { container } = render(
      <Dropdown
        options={mockOptions}
        value="option1"
        onChange={() => {}}
        className="custom-class"
        aria-label="Test dropdown"
      />
    );
    
    expect(container.firstChild).toHaveClass('custom-class');
  });
});
