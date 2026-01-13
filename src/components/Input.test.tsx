import { describe, it, expect, vi } from 'vitest';
import { render, screen } from '../test/test-utils';
import userEvent from '@testing-library/user-event';
import { Input, Textarea, Select } from './Input';
import { Search } from 'lucide-react';

describe('Input', () => {
  it('renders correctly', () => {
    render(<Input placeholder="Enter text" />);
    expect(screen.getByPlaceholderText('Enter text')).toBeInTheDocument();
  });

  it('renders label when provided', () => {
    render(<Input label="Username" />);
    expect(screen.getByText('Username')).toBeInTheDocument();
  });

  it('renders error message when provided', () => {
    render(<Input error="This field is required" />);
    expect(screen.getByText('This field is required')).toBeInTheDocument();
  });

  it('applies error styling when error is provided', () => {
    render(<Input error="Error" data-testid="input" />);
    const input = screen.getByTestId('input');
    expect(input).toHaveClass('border-red-500');
  });

  it('renders hint when provided and no error', () => {
    render(<Input hint="Enter your username" />);
    expect(screen.getByText('Enter your username')).toBeInTheDocument();
  });

  it('hides hint when error is provided', () => {
    render(<Input hint="Hint text" error="Error text" />);
    expect(screen.queryByText('Hint text')).not.toBeInTheDocument();
    expect(screen.getByText('Error text')).toBeInTheDocument();
  });

  it('renders icon when provided', () => {
    render(<Input icon={<Search data-testid="search-icon" />} />);
    expect(screen.getByTestId('search-icon')).toBeInTheDocument();
  });

  it('renders rightElement when provided', () => {
    render(<Input rightElement={<button data-testid="clear-btn">Clear</button>} />);
    expect(screen.getByTestId('clear-btn')).toBeInTheDocument();
  });

  it('handles value changes', async () => {
    const user = userEvent.setup();
    const handleChange = vi.fn();
    render(<Input onChange={handleChange} data-testid="input" />);
    
    const input = screen.getByTestId('input');
    await user.type(input, 'Hello');
    
    expect(handleChange).toHaveBeenCalled();
  });

  it('is disabled when disabled prop is true', () => {
    render(<Input disabled data-testid="input" />);
    expect(screen.getByTestId('input')).toBeDisabled();
  });

  it('accepts custom className', () => {
    render(<Input className="custom-input" data-testid="input" />);
    expect(screen.getByTestId('input')).toHaveClass('custom-input');
  });

  it('forwards ref correctly', () => {
    const ref = vi.fn();
    render(<Input ref={ref} />);
    expect(ref).toHaveBeenCalled();
  });
});

describe('Textarea', () => {
  it('renders correctly', () => {
    render(<Textarea placeholder="Enter description" />);
    expect(screen.getByPlaceholderText('Enter description')).toBeInTheDocument();
  });

  it('renders label when provided', () => {
    render(<Textarea label="Description" />);
    expect(screen.getByText('Description')).toBeInTheDocument();
  });

  it('renders error message when provided', () => {
    render(<Textarea error="Description is required" />);
    expect(screen.getByText('Description is required')).toBeInTheDocument();
  });

  it('renders hint when provided and no error', () => {
    render(<Textarea hint="Maximum 500 characters" />);
    expect(screen.getByText('Maximum 500 characters')).toBeInTheDocument();
  });

  it('handles value changes', async () => {
    const user = userEvent.setup();
    const handleChange = vi.fn();
    render(<Textarea onChange={handleChange} data-testid="textarea" />);
    
    const textarea = screen.getByTestId('textarea');
    await user.type(textarea, 'Test');
    
    expect(handleChange).toHaveBeenCalled();
  });

  it('forwards ref correctly', () => {
    const ref = vi.fn();
    render(<Textarea ref={ref} />);
    expect(ref).toHaveBeenCalled();
  });
});

describe('Select', () => {
  const options = [
    { value: '1', label: 'Option 1' },
    { value: '2', label: 'Option 2' },
    { value: '3', label: 'Option 3' },
  ];

  it('renders correctly with options', () => {
    render(<Select options={options} data-testid="select" />);
    const select = screen.getByTestId('select');
    expect(select).toBeInTheDocument();
    expect(screen.getByText('Option 1')).toBeInTheDocument();
    expect(screen.getByText('Option 2')).toBeInTheDocument();
    expect(screen.getByText('Option 3')).toBeInTheDocument();
  });

  it('renders label when provided', () => {
    render(<Select label="Choose an option" options={options} />);
    expect(screen.getByText('Choose an option')).toBeInTheDocument();
  });

  it('renders error message when provided', () => {
    render(<Select options={options} error="Please select an option" />);
    expect(screen.getByText('Please select an option')).toBeInTheDocument();
  });

  it('handles selection changes', async () => {
    const user = userEvent.setup();
    const handleChange = vi.fn();
    render(<Select options={options} onChange={handleChange} data-testid="select" />);
    
    const select = screen.getByTestId('select');
    await user.selectOptions(select, '2');
    
    expect(handleChange).toHaveBeenCalled();
  });

  it('supports numeric option values', () => {
    const numericOptions = [
      { value: 1, label: 'One' },
      { value: 2, label: 'Two' },
    ];
    render(<Select options={numericOptions} data-testid="select" />);
    expect(screen.getByTestId('select')).toBeInTheDocument();
  });

  it('forwards ref correctly', () => {
    const ref = vi.fn();
    render(<Select options={options} ref={ref} />);
    expect(ref).toHaveBeenCalled();
  });
});
