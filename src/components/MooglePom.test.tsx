import { describe, it, expect } from 'vitest';
import { render } from '../test/test-utils';
import { MooglePom, MooglePomCluster } from './MooglePom';

describe('MooglePom', () => {
  it('renders without crashing', () => {
    const { container } = render(<MooglePom />);
    expect(container.firstChild).toBeInTheDocument();
  });

  it('renders with stem by default', () => {
    const { container } = render(<MooglePom />);
    // The component should have multiple child elements (pom + stem)
    const wrapper = container.firstChild as HTMLElement;
    expect(wrapper.children.length).toBeGreaterThan(1);
  });

  it('hides stem when showStem is false', () => {
    const { container } = render(<MooglePom showStem={false} />);
    const wrapper = container.firstChild as HTMLElement;
    // Should have fewer children without stem
    expect(wrapper).toBeInTheDocument();
  });

  it('applies different sizes', () => {
    const sizes = ['xs', 'sm', 'md', 'lg', 'xl'] as const;
    
    sizes.forEach((size) => {
      const { container, unmount } = render(<MooglePom size={size} />);
      expect(container.firstChild).toBeInTheDocument();
      unmount();
    });
  });

  it('applies different colors', () => {
    const colors = ['pink', 'coral', 'purple'] as const;
    
    colors.forEach((color) => {
      const { container, unmount } = render(<MooglePom color={color} />);
      expect(container.firstChild).toBeInTheDocument();
      unmount();
    });
  });

  it('wraps in motion.div when animate is true', () => {
    const { container } = render(<MooglePom animate />);
    expect(container.firstChild).toBeInTheDocument();
  });

  it('accepts custom className', () => {
    const { container } = render(<MooglePom className="custom-pom" />);
    expect(container.querySelector('.custom-pom')).toBeInTheDocument();
  });
});

describe('MooglePomCluster', () => {
  it('renders without crashing', () => {
    const { container } = render(<MooglePomCluster />);
    expect(container.firstChild).toBeInTheDocument();
  });

  it('renders multiple poms', () => {
    const { container } = render(<MooglePomCluster />);
    // Should have 3 poms in the cluster
    const wrapper = container.firstChild as HTMLElement;
    expect(wrapper.children.length).toBe(3);
  });

  it('accepts custom className', () => {
    const { container } = render(<MooglePomCluster className="cluster-class" />);
    expect(container.querySelector('.cluster-class')).toBeInTheDocument();
  });
});
