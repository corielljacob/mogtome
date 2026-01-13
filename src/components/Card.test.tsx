import { describe, it, expect } from 'vitest';
import { render, screen } from '../test/test-utils';
import { Card, CardBody, CardTitle, CardActions, CardHeader } from './Card';

describe('Card', () => {
  it('renders children correctly', () => {
    render(<Card>Card content</Card>);
    expect(screen.getByText('Card content')).toBeInTheDocument();
  });

  it('renders with default variant', () => {
    const { container } = render(<Card>Content</Card>);
    // Card renders as a div with rounded corners
    const card = container.firstChild as HTMLElement;
    expect(card).toBeInTheDocument();
    expect(card.tagName).toBe('DIV');
  });

  it('renders with glass variant', () => {
    const { container } = render(<Card variant="glass">Glass Card</Card>);
    const card = container.firstChild as HTMLElement;
    expect(card).toBeInTheDocument();
    expect(screen.getByText('Glass Card')).toBeInTheDocument();
  });

  it('renders with flat variant', () => {
    const { container } = render(<Card variant="flat">Flat Card</Card>);
    const card = container.firstChild as HTMLElement;
    expect(card).toBeInTheDocument();
  });

  it('renders with different padding sizes', () => {
    const { rerender, container } = render(<Card padding="none">No Padding</Card>);
    expect(container.firstChild).toBeInTheDocument();

    rerender(<Card padding="sm">Small Padding</Card>);
    expect(screen.getByText('Small Padding')).toBeInTheDocument();

    rerender(<Card padding="md">Medium Padding</Card>);
    expect(screen.getByText('Medium Padding')).toBeInTheDocument();

    rerender(<Card padding="lg">Large Padding</Card>);
    expect(screen.getByText('Large Padding')).toBeInTheDocument();
  });

  it('renders with hover prop enabled', () => {
    const { container } = render(<Card hover>Hoverable</Card>);
    expect(container.firstChild).toBeInTheDocument();
    expect(screen.getByText('Hoverable')).toBeInTheDocument();
  });

  it('renders with hover prop disabled', () => {
    const { container } = render(<Card hover={false}>No Hover</Card>);
    expect(container.firstChild).toBeInTheDocument();
  });

  it('accepts custom className', () => {
    const { container } = render(<Card className="custom-class">Custom</Card>);
    expect(container.querySelector('.custom-class')).toBeInTheDocument();
  });
});

describe('CardBody', () => {
  it('renders children correctly', () => {
    render(<CardBody>Body content</CardBody>);
    expect(screen.getByText('Body content')).toBeInTheDocument();
  });

  it('renders with correct structure', () => {
    const { container } = render(<CardBody>Content</CardBody>);
    expect(container.firstChild).toBeInTheDocument();
  });

  it('accepts custom className', () => {
    const { container } = render(<CardBody className="extra-class">Content</CardBody>);
    expect(container.querySelector('.extra-class')).toBeInTheDocument();
  });
});

describe('CardTitle', () => {
  it('renders children correctly', () => {
    render(<CardTitle>My Title</CardTitle>);
    expect(screen.getByText('My Title')).toBeInTheDocument();
  });

  it('renders as h3 by default', () => {
    render(<CardTitle>Title</CardTitle>);
    expect(screen.getByRole('heading', { level: 3 })).toBeInTheDocument();
  });

  it('renders as different heading levels', () => {
    const { rerender } = render(<CardTitle as="h1">H1</CardTitle>);
    expect(screen.getByRole('heading', { level: 1 })).toBeInTheDocument();

    rerender(<CardTitle as="h2">H2</CardTitle>);
    expect(screen.getByRole('heading', { level: 2 })).toBeInTheDocument();

    rerender(<CardTitle as="h4">H4</CardTitle>);
    expect(screen.getByRole('heading', { level: 4 })).toBeInTheDocument();
  });

  it('accepts custom className', () => {
    render(<CardTitle className="title-class">Title</CardTitle>);
    expect(screen.getByText('Title')).toHaveClass('title-class');
  });
});

describe('CardActions', () => {
  it('renders children correctly', () => {
    render(<CardActions><button>Action</button></CardActions>);
    expect(screen.getByRole('button', { name: /action/i })).toBeInTheDocument();
  });

  it('applies end justification by default', () => {
    render(<CardActions><button>Action</button></CardActions>);
    const container = screen.getByRole('button').parentElement;
    expect(container).toHaveClass('justify-end');
  });

  it('applies different justification options', () => {
    const { rerender } = render(<CardActions justify="start"><button>Start</button></CardActions>);
    expect(screen.getByRole('button').parentElement).toHaveClass('justify-start');

    rerender(<CardActions justify="center"><button>Center</button></CardActions>);
    expect(screen.getByRole('button').parentElement).toHaveClass('justify-center');

    rerender(<CardActions justify="between"><button>Between</button></CardActions>);
    expect(screen.getByRole('button').parentElement).toHaveClass('justify-between');
  });
});

describe('CardHeader', () => {
  it('renders children correctly', () => {
    render(<CardHeader>Header Content</CardHeader>);
    expect(screen.getByText('Header Content')).toBeInTheDocument();
  });

  it('renders with correct structure', () => {
    const { container } = render(<CardHeader>Header</CardHeader>);
    expect(container.firstChild).toBeInTheDocument();
  });

  it('accepts custom className', () => {
    const { container } = render(<CardHeader className="header-class">Header</CardHeader>);
    expect(container.querySelector('.header-class')).toBeInTheDocument();
  });
});
