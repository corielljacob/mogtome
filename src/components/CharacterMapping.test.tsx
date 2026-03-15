import { describe, it, expect, vi, beforeEach } from 'vitest';
import { render, screen, waitFor } from '../test/test-utils';
import { CharacterMapping } from './CharacterMapping';
import { characterMappingApi } from '../api/characterMapping';

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
    // Make the API calls hang
    mockCharacterMappingApi.getUnmappedCharacters.mockReturnValue(new Promise(() => {}));
    mockCharacterMappingApi.getUnmappedDiscordUsers.mockReturnValue(new Promise(() => {}));

    render(<CharacterMapping />);

    expect(screen.getByText(/loading unmapped accounts/i)).toBeInTheDocument();
  });

  it('renders the component header', async () => {
    mockCharacterMappingApi.getUnmappedCharacters.mockResolvedValue({ suggested: [], all: [] });
    mockCharacterMappingApi.getUnmappedDiscordUsers.mockResolvedValue({ suggested: [], all: [] });

    render(<CharacterMapping />);

    await waitFor(() => {
      expect(screen.getByText('Character Mapping')).toBeInTheDocument();
    });
    expect(screen.getByText('Link characters to Discord accounts')).toBeInTheDocument();
  });

  it('renders empty state when no unmapped accounts', async () => {
    mockCharacterMappingApi.getUnmappedCharacters.mockResolvedValue({ suggested: [], all: [] });
    mockCharacterMappingApi.getUnmappedDiscordUsers.mockResolvedValue({ suggested: [], all: [] });

    render(<CharacterMapping />);

    await waitFor(() => {
      expect(screen.getByText('All accounts mapped!')).toBeInTheDocument();
    });
  });

  it('renders character and Discord lists when data is available', async () => {
    mockCharacterMappingApi.getUnmappedCharacters.mockResolvedValue({
      suggested: [],
      all: [
        { characterId: '1', name: 'Test Character', avatarLink: 'https://example.com/avatar.png', freeCompanyRank: 'Moogle Knight' },
      ],
    });
    mockCharacterMappingApi.getUnmappedDiscordUsers.mockResolvedValue({
      suggested: [],
      all: [
        { discordId: '123', discordUsername: 'TestDiscordUser' },
      ],
    });

    render(<CharacterMapping />);

    await waitFor(() => {
      expect(screen.getByText('Characters')).toBeInTheDocument();
      expect(screen.getByText('Discord Accounts')).toBeInTheDocument();
    });

    expect(screen.getByText('Test Character')).toBeInTheDocument();
    expect(screen.getByText('TestDiscordUser')).toBeInTheDocument();
  });

  it('renders suggested badge for suggested matches', async () => {
    mockCharacterMappingApi.getUnmappedCharacters.mockResolvedValue({
      suggested: [
        { characterId: '1', name: 'Suggested Char', avatarLink: 'https://example.com/avatar.png', freeCompanyRank: 'Paissa Trainer' },
      ],
      all: [],
    });
    mockCharacterMappingApi.getUnmappedDiscordUsers.mockResolvedValue({
      suggested: [],
      all: [],
    });

    render(<CharacterMapping />);

    await waitFor(() => {
      expect(screen.getByText('Suggested Char')).toBeInTheDocument();
    });

    // Check for the "Suggested" badge
    expect(screen.getByText('Suggested')).toBeInTheDocument();
  });

  it('shows search inputs for filtering', async () => {
    mockCharacterMappingApi.getUnmappedCharacters.mockResolvedValue({
      suggested: [],
      all: [{ characterId: '1', name: 'Test Char', avatarLink: '', freeCompanyRank: 'Knight' }],
    });
    mockCharacterMappingApi.getUnmappedDiscordUsers.mockResolvedValue({
      suggested: [],
      all: [{ discordId: '1', discordUsername: 'TestUser' }],
    });

    render(<CharacterMapping />);

    await waitFor(() => {
      expect(screen.getByPlaceholderText('Search characters...')).toBeInTheDocument();
      expect(screen.getByPlaceholderText('Search Discord users...')).toBeInTheDocument();
    });
  });

  it('has a refresh button', async () => {
    mockCharacterMappingApi.getUnmappedCharacters.mockResolvedValue({ suggested: [], all: [] });
    mockCharacterMappingApi.getUnmappedDiscordUsers.mockResolvedValue({ suggested: [], all: [] });

    render(<CharacterMapping />);

    await waitFor(() => {
      expect(screen.getByLabelText('Refresh unmapped lists')).toBeInTheDocument();
    });
  });
});
