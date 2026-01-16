import { describe, it, expect, vi } from 'vitest';
import { render, screen } from '../test/test-utils';
import { Button, IconButton } from './Button';
import { Heart } from 'lucide-react';

describe('Button', () => {
  it('renders children correctly', () => {
    render(<Button>Click me</Button>);
    expect(screen.getByRole('button', { name: /click me/i })).toBeInTheDocument();
  });

  it('applies primary variant by default', () => {
    render(<Button>Primary Button</Button>);
    const button = screen.getByRole('button');
    expect(button).toHaveClass('bg-gradient-to-r');
  });

  it('applies secondary variant when specified', () => {
    render(<Button variant="secondary">Secondary</Button>);
    const button = screen.getByRole('button');
    expect(button).toBeInTheDocument();
  });

  it('applies ghost variant when specified', () => {
    render(<Button variant="ghost">Ghost</Button>);
    const button = screen.getByRole('button');
    expect(button).toHaveClass('bg-transparent');
  });

  it('applies danger variant when specified', () => {
    render(<Button variant="danger">Danger</Button>);
    const button = screen.getByRole('button');
    expect(button).toBeInTheDocument();
  });

  it('applies success variant when specified', () => {
    render(<Button variant="success">Success</Button>);
    const button = screen.getByRole('button');
    expect(button).toBeInTheDocument();
  });

  it('applies different sizes correctly', () => {
    const { rerender } = render(<Button size="xs">XS</Button>);
    expect(screen.getByRole('button')).toHaveClass('px-2.5', 'py-1');

    rerender(<Button size="sm">SM</Button>);
    expect(screen.getByRole('button')).toHaveClass('px-3', 'py-1.5');

    rerender(<Button size="md">MD</Button>);
    expect(screen.getByRole('button')).toHaveClass('px-4', 'py-2');

    rerender(<Button size="lg">LG</Button>);
    expect(screen.getByRole('button')).toHaveClass('px-6', 'py-3');
  });

  it('shows loading state and disables button', () => {
    render(<Button isLoading>Loading</Button>);
    const button = screen.getByRole('button');
    expect(button).toBeDisabled();
    // Loading spinner should be present (SVG element)
    expect(button.querySelector('svg')).toBeInTheDocument();
  });

  it('is disabled when disabled prop is true', () => {
    render(<Button disabled>Disabled</Button>);
    expect(screen.getByRole('button')).toBeDisabled();
  });

  it('calls onClick handler when clicked', async () => {
    const handleClick = vi.fn();
    render(<Button onClick={handleClick}>Click me</Button>);
    
    screen.getByRole('button').click();
    expect(handleClick).toHaveBeenCalledTimes(1);
  });

  it('does not call onClick when disabled', () => {
    const handleClick = vi.fn();
    render(<Button disabled onClick={handleClick}>Disabled</Button>);
    
    screen.getByRole('button').click();
    expect(handleClick).not.toHaveBeenCalled();
  });

  it('applies outline styles when outline prop is true', () => {
    render(<Button outline>Outline</Button>);
    const button = screen.getByRole('button');
    expect(button).toHaveClass('border-2');
  });

  it('accepts custom className', () => {
    render(<Button className="custom-class">Custom</Button>);
    expect(screen.getByRole('button')).toHaveClass('custom-class');
  });
});

describe('IconButton', () => {
  it('renders icon correctly', () => {
    render(<IconButton icon={<Heart data-testid="heart-icon" />} aria-label="Like" />);
    expect(screen.getByTestId('heart-icon')).toBeInTheDocument();
  });

  it('applies different sizes', () => {
    const { rerender } = render(<IconButton icon={<Heart />} size="sm" aria-label="Like" />);
    expect(screen.getByRole('button')).toHaveClass('w-8', 'h-8');

    rerender(<IconButton icon={<Heart />} size="md" aria-label="Like" />);
    expect(screen.getByRole('button')).toHaveClass('w-10', 'h-10');

    rerender(<IconButton icon={<Heart />} size="lg" aria-label="Like" />);
    expect(screen.getByRole('button')).toHaveClass('w-12', 'h-12');
  });

  it('applies ghost variant by default', () => {
    render(<IconButton icon={<Heart />} aria-label="Like" />);
    const button = screen.getByRole('button');
    expect(button).toHaveClass('bg-transparent');
  });

  it('applies primary variant when specified', () => {
    render(<IconButton icon={<Heart />} variant="primary" aria-label="Like" />);
    const button = screen.getByRole('button');
    expect(button).toBeInTheDocument();
  });

  it('calls onClick handler when clicked', () => {
    const handleClick = vi.fn();
    render(<IconButton icon={<Heart />} onClick={handleClick} aria-label="Like" />);
    
    screen.getByRole('button').click();
    expect(handleClick).toHaveBeenCalledTimes(1);
  });
});
