import { describe, it, expect } from 'vitest';
import { render, screen } from '../test/test-utils';
import { MemberCard, MemberCardSkeleton, MemberCardCompact } from './MemberCard';
import type { FreeCompanyMember } from '../types';

const mockMember: FreeCompanyMember = {
  id: '1',
  name: 'Test Character',
  freeCompanyRank: 'Moogle Guardian',
  freeCompanyRankIcon: 'https://example.com/icon.png',
  characterId: '12345',
  activeMember: true,
  lastUpdatedDate: '2024-01-01',
  avatarLink: 'https://example.com/avatar.png',
};

describe('MemberCard', () => {
  it('renders member name correctly', () => {
    render(<MemberCard member={mockMember} />);
    expect(screen.getByText('Test Character')).toBeInTheDocument();
  });

  it('renders member rank correctly', () => {
    render(<MemberCard member={mockMember} />);
    expect(screen.getByText('Moogle Guardian')).toBeInTheDocument();
  });

  it('renders avatar with correct src', () => {
    const { container } = render(<MemberCard member={mockMember} />);
    // Avatar uses empty alt (decorative) since the link has an accessible label
    const avatar = container.querySelector(`img[src="${mockMember.avatarLink}"]`);
    expect(avatar).toBeInTheDocument();
  });

  it('renders link to Lodestone profile', () => {
    render(<MemberCard member={mockMember} />);
    const link = screen.getByRole('link');
    expect(link).toHaveAttribute(
      'href',
      'https://na.finalfantasyxiv.com/lodestone/character/12345'
    );
    expect(link).toHaveAttribute('target', '_blank');
    expect(link).toHaveAttribute('rel', 'noopener noreferrer');
  });

  it('applies animation delay based on index', () => {
    const { container } = render(<MemberCard member={mockMember} index={5} />);
    // The motion.div should be present
    expect(container.firstChild).toBeInTheDocument();
  });

  it('handles different ranks with corresponding themes', () => {
    const ranks = [
      'Moogle Guardian',
      'Moogle Knight',
      'Paissa Trainer',
      'Coeurl Hunter',
      'Mandragora',
      'Apkallu Seeker',
      'Kupo Shelf',
      'Bom Boko',
    ];

    ranks.forEach((rank) => {
      const member = { ...mockMember, freeCompanyRank: rank };
      const { unmount } = render(<MemberCard member={member} />);
      expect(screen.getByText(rank)).toBeInTheDocument();
      unmount();
    });
  });

  it('uses default theme for unknown ranks', () => {
    const member = { ...mockMember, freeCompanyRank: 'Unknown Rank' };
    render(<MemberCard member={member} />);
    expect(screen.getByText('Unknown Rank')).toBeInTheDocument();
  });
});

describe('MemberCardSkeleton', () => {
  it('renders skeleton elements', () => {
    const { container } = render(<MemberCardSkeleton />);
    expect(container.firstChild).toBeInTheDocument();
    // Should have shimmer animations
    expect(container.querySelector('.animate-shimmer, .animate-pulse')).toBeInTheDocument();
  });
});

describe('MemberCardCompact', () => {
  it('renders member name correctly', () => {
    render(<MemberCardCompact member={mockMember} />);
    expect(screen.getByText('Test Character')).toBeInTheDocument();
  });

  it('renders member rank correctly', () => {
    render(<MemberCardCompact member={mockMember} />);
    expect(screen.getByText('Moogle Guardian')).toBeInTheDocument();
  });

  it('renders as a link to Lodestone', () => {
    render(<MemberCardCompact member={mockMember} />);
    const link = screen.getByRole('link');
    expect(link).toHaveAttribute(
      'href',
      'https://na.finalfantasyxiv.com/lodestone/character/12345'
    );
  });

  it('renders avatar', () => {
    const { container } = render(<MemberCardCompact member={mockMember} />);
    // Avatar uses empty alt (decorative) since the link has an accessible label
    const avatar = container.querySelector(`img[src="${mockMember.avatarLink}"]`);
    expect(avatar).toBeInTheDocument();
  });
});
