import { describe, it, expect } from 'vitest';
import { render } from '../test/test-utils';
import { StoryDivider } from './StoryDivider';

describe('StoryDivider', () => {
  it('renders an SVG element', () => {
    const { container } = render(<StoryDivider />);
    
    const svg = container.querySelector('svg');
    expect(svg).toBeInTheDocument();
  });

  it('is hidden from assistive technologies', () => {
    const { container } = render(<StoryDivider />);
    
    const svg = container.querySelector('svg');
    expect(svg).toHaveAttribute('aria-hidden', 'true');
  });

  it('applies default medium size', () => {
    const { container } = render(<StoryDivider />);
    
    const svg = container.querySelector('svg');
    // Medium size classes
    expect(svg).toHaveClass('w-56', 'md:w-72', 'h-6');
  });

  it('applies small size when specified', () => {
    const { container } = render(<StoryDivider size="sm" />);
    
    const svg = container.querySelector('svg');
    expect(svg).toHaveClass('w-48', 'md:w-64', 'h-5');
  });

  it('applies large size when specified', () => {
    const { container } = render(<StoryDivider size="lg" />);
    
    const svg = container.querySelector('svg');
    expect(svg).toHaveClass('w-64', 'md:w-80', 'h-7');
  });

  it('applies custom className', () => {
    const { container } = render(<StoryDivider className="mx-auto my-4" />);
    
    const svg = container.querySelector('svg');
    expect(svg).toHaveClass('mx-auto', 'my-4');
  });

  it('contains decorative elements', () => {
    const { container } = render(<StoryDivider />);
    
    // Check for the wavy path
    const path = container.querySelector('path');
    expect(path).toBeInTheDocument();
    
    // Check for decorative circles
    const circles = container.querySelectorAll('circle');
    expect(circles.length).toBeGreaterThan(0);
  });
});
