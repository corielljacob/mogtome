import { describe, it, expect } from 'vitest';
import { render, screen } from '../test/test-utils';
import { ContentCard } from './ContentCard';

describe('ContentCard', () => {
  it('renders children correctly', () => {
    render(
      <ContentCard>
        <p>Card content</p>
      </ContentCard>
    );
    
    expect(screen.getByText('Card content')).toBeInTheDocument();
  });

  it('applies default styling', () => {
    const { container } = render(
      <ContentCard>Content</ContentCard>
    );
    
    const card = container.firstChild as HTMLElement;
    expect(card).toHaveClass('rounded-2xl');
    expect(card).toHaveClass('shadow-lg');
  });

  it('applies custom className', () => {
    const { container } = render(
      <ContentCard className="custom-class">Content</ContentCard>
    );
    
    expect(container.firstChild).toHaveClass('custom-class');
  });

  it('supports ARIA role', () => {
    render(
      <ContentCard role="alert">Alert content</ContentCard>
    );
    
    expect(screen.getByRole('alert')).toBeInTheDocument();
  });

  it('supports aria-busy attribute', () => {
    const { container } = render(
      <ContentCard aria-busy={true}>Loading content</ContentCard>
    );
    
    expect(container.firstChild).toHaveAttribute('aria-busy', 'true');
  });

  it('supports aria-live attribute for polite announcements', () => {
    const { container } = render(
      <ContentCard aria-live="polite">Dynamic content</ContentCard>
    );
    
    expect(container.firstChild).toHaveAttribute('aria-live', 'polite');
  });

  it('supports aria-live attribute for assertive announcements', () => {
    const { container } = render(
      <ContentCard aria-live="assertive">Urgent content</ContentCard>
    );
    
    expect(container.firstChild).toHaveAttribute('aria-live', 'assertive');
  });

  it('renders complex nested content', () => {
    render(
      <ContentCard>
        <header>
          <h2>Title</h2>
        </header>
        <main>
          <p>Paragraph 1</p>
          <p>Paragraph 2</p>
        </main>
        <footer>
          <button>Action</button>
        </footer>
      </ContentCard>
    );
    
    expect(screen.getByRole('heading', { name: 'Title' })).toBeInTheDocument();
    expect(screen.getByText('Paragraph 1')).toBeInTheDocument();
    expect(screen.getByText('Paragraph 2')).toBeInTheDocument();
    expect(screen.getByRole('button', { name: 'Action' })).toBeInTheDocument();
  });
});
