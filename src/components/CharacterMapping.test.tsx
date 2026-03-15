import { describe, it, expect, vi, beforeEach } from 'vitest';
import { render, screen, waitFor } from '../test/test-utils';
import userEvent from '@testing-library/user-event';
import { CharacterMapping } from './CharacterMapping';
import { characterMappingApi } from '../api/characterMapping';

// Mock @tanstack/react-virtual since jsdom has no layout engine
vi.mock('@tanstack/react-virtual', () => ({
  useVirtualizer: (opts: { count: number; estimateSize: () => number; gap?: number }) => ({
    getTotalSize: () => opts.count * (opts.estimateSize() + (opts.gap ?? 0)),
    getVirtualItems: () =>
      Array.from({ length: opts.count }, (_, i) => ({
        index: i,
        key: i,
        start: i * (opts.estimateSize() + (opts.gap ?? 0)),
        size: opts.estimateSize(),
      })),
  }),
}));

// Mock the characterMappingApi
vi.mock('../api/characterMapping', () => ({
  characterMappingApi: {
    getUnmappedCharacters: vi.fn(),
    getUnmappedDiscordUsers: vi.fn(),
    mapCharacter: vi.fn(),
  },
}));

const mockCharacterMappingApi = characterMappingApi as {
  getUnmappedCharacters: ReturnType<typeof vi.fn>;
  getUnmappedDiscordUsers: ReturnType<typeof vi.fn>;
  mapCharacter: ReturnType<typeof vi.fn>;
};

describe('CharacterMapping', () => {
  beforeEach(() => {
    vi.clearAllMocks();
  });

  it('renders loading state initially', async () => {
    mockCharacterMappingApi.getUnmappedCharacters.mockReturnValue(
      new Promise(() => {}),
    );
    mockCharacterMappingApi.getUnmappedDiscordUsers.mockReturnValue(
      new Promise(() => {}),
    );

    render(<CharacterMapping />);

    expect(
      screen.getByText(/loading unmapped accounts/i),
    ).toBeInTheDocument();
  });

  it('renders the component header', async () => {
    mockCharacterMappingApi.getUnmappedCharacters.mockResolvedValue({
      suggestedCharacters: [],
      unmappedCharacters: [],
    });
    mockCharacterMappingApi.getUnmappedDiscordUsers.mockResolvedValue({
      suggestedDiscordUsers: [],
      unmappedDiscordUsers: [],
    });

    render(<CharacterMapping />);

    await waitFor(() => {
      expect(screen.getByText('Character Mapping')).toBeInTheDocument();
    });
    expect(
      screen.getByText('Link characters to Discord accounts'),
    ).toBeInTheDocument();
  });

  it('renders empty state when no unmapped accounts', async () => {
    mockCharacterMappingApi.getUnmappedCharacters.mockResolvedValue({
      suggestedCharacters: [],
      unmappedCharacters: [],
    });
    mockCharacterMappingApi.getUnmappedDiscordUsers.mockResolvedValue({
      suggestedDiscordUsers: [],
      unmappedDiscordUsers: [],
    });

    render(<CharacterMapping />);

    await waitFor(() => {
      expect(screen.getByText('All accounts mapped!')).toBeInTheDocument();
    });
  });

  it('shows tab bar with Smart Matches and Manual tabs', async () => {
    mockCharacterMappingApi.getUnmappedCharacters.mockResolvedValue({
      suggestedCharacters: [],
      unmappedCharacters: [
        {
          characterId: '1',
          name: 'Test Character',
          avatarLink: '',
          freeCompanyRank: 'Knight',
        },
      ],
    });
    mockCharacterMappingApi.getUnmappedDiscordUsers.mockResolvedValue({
      suggestedDiscordUsers: [],
      unmappedDiscordUsers: [
        { discordId: '123', serverNickName: 'SomeUser' },
      ],
    });

    render(<CharacterMapping />);

    await waitFor(() => {
      expect(screen.getByText('Smart Matches')).toBeInTheDocument();
      expect(screen.getByText('Manual')).toBeInTheDocument();
    });
  });

  it('renders character and Discord lists on the Manual tab', async () => {
    const user = userEvent.setup();
    mockCharacterMappingApi.getUnmappedCharacters.mockResolvedValue({
      suggestedCharacters: [],
      unmappedCharacters: [
        {
          characterId: '1',
          name: 'Test Character',
          avatarLink: 'https://example.com/avatar.png',
          freeCompanyRank: 'Moogle Knight',
        },
      ],
    });
    mockCharacterMappingApi.getUnmappedDiscordUsers.mockResolvedValue({
      suggestedDiscordUsers: [],
      unmappedDiscordUsers: [
        { discordId: '123', serverNickName: 'TestDiscordUser' },
      ],
    });

    render(<CharacterMapping />);

    // Switch to manual tab
    await waitFor(() => {
      expect(screen.getByText('Manual')).toBeInTheDocument();
    });
    await user.click(screen.getByText('Manual'));

    await waitFor(() => {
      expect(screen.getByText('Characters')).toBeInTheDocument();
      expect(screen.getByText('Discord Accounts')).toBeInTheDocument();
    });

    expect(screen.getByText('Test Character')).toBeInTheDocument();
    expect(screen.getByText('TestDiscordUser')).toBeInTheDocument();
  });

  it('shows exact match pairs when names match', async () => {
    mockCharacterMappingApi.getUnmappedCharacters.mockResolvedValue({
      suggestedCharacters: [],
      unmappedCharacters: [
        {
          characterId: '1',
          name: 'Miko Cocoa',
          avatarLink: '',
          freeCompanyRank: 'Knight',
        },
      ],
    });
    mockCharacterMappingApi.getUnmappedDiscordUsers.mockResolvedValue({
      suggestedDiscordUsers: [],
      unmappedDiscordUsers: [
        { discordId: '10', serverNickName: 'Miko Cocoa' },
      ],
    });

    render(<CharacterMapping />);

    // Smart Matches tab is the default
    await waitFor(() => {
      expect(screen.getByText('Exact Matches')).toBeInTheDocument();
    });
    expect(screen.getByText('Exact Match')).toBeInTheDocument();
  });

  it('shows search inputs on the Manual tab', async () => {
    const user = userEvent.setup();
    mockCharacterMappingApi.getUnmappedCharacters.mockResolvedValue({
      suggestedCharacters: [],
      unmappedCharacters: [
        {
          characterId: '1',
          name: 'Test Char',
          avatarLink: '',
          freeCompanyRank: 'Knight',
        },
      ],
    });
    mockCharacterMappingApi.getUnmappedDiscordUsers.mockResolvedValue({
      suggestedDiscordUsers: [],
      unmappedDiscordUsers: [
        { discordId: '1', serverNickName: 'TestUser' },
      ],
    });

    render(<CharacterMapping />);

    await waitFor(() => {
      expect(screen.getByText('Manual')).toBeInTheDocument();
    });
    await user.click(screen.getByText('Manual'));

    await waitFor(() => {
      expect(
        screen.getByPlaceholderText('Search characters...'),
      ).toBeInTheDocument();
      expect(
        screen.getByPlaceholderText('Search Discord users...'),
      ).toBeInTheDocument();
    });
  });

  it('has a refresh button', async () => {
    mockCharacterMappingApi.getUnmappedCharacters.mockResolvedValue({
      suggestedCharacters: [],
      unmappedCharacters: [],
    });
    mockCharacterMappingApi.getUnmappedDiscordUsers.mockResolvedValue({
      suggestedDiscordUsers: [],
      unmappedDiscordUsers: [],
    });

    render(<CharacterMapping />);

    await waitFor(() => {
      expect(
        screen.getByLabelText('Refresh unmapped lists'),
      ).toBeInTheDocument();
    });
  });
});
