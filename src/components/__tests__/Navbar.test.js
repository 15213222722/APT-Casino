import { render, screen, fireEvent, waitFor } from '@testing-library/react';
import { describe, it, expect, vi, beforeEach, afterEach } from 'vitest';
import Navbar from '../Navbar';

// Mock Next.js dependencies
vi.mock('next/navigation', () => ({
  usePathname: vi.fn(),
  useRouter: vi.fn(),
}));

// Mock React hooks
vi.mock('react', async () => {
  const actual = await vi.importActual('react');
  return {
    ...actual,
    useState: vi.fn(),
    useEffect: vi.fn(),
    useRef: vi.fn(() => ({ current: null })),
    createPortal: vi.fn((children) => children),
  };
});

// Mock Redux
vi.mock('react-redux', () => ({
  useSelector: vi.fn(),
  useDispatch: vi.fn(),
}));

// Mock custom hooks
vi.mock('../../hooks/useOneChainWallet', () => ({
  useOneChainWallet: vi.fn(),
}));

// Mock NotificationSystem
vi.mock('../NotificationSystem', () => ({
  useNotification: vi.fn(() => ({
    success: vi.fn(),
    error: vi.fn(),
    info: vi.fn(),
  })),
}));

// Mock dependencies
vi.mock('../../config/treasury', () => ({
  TREASURY_CONFIG: {
    ADDRESS: '0x1234567890123456789012345678901234567890',
    NETWORK: {
      CHAIN_NAME: 'OneChain Testnet'
    },
    LIMITS: {
      MIN_DEPOSIT: 0.001,
      MAX_DEPOSIT: 1000
    }
  }
}));

// Mock child components
vi.mock('../OneChainWalletButton', () => ({
  default: () => <div data-testid="wallet-button">Wallet Button</div>,
}));

vi.mock('../LiveChat', () => ({
  default: ({ open, onClose }) => open ? <div data-testid="live-chat-modal">Live Chat</div> : null,
}));

vi.mock('../SmartAccountInfo', () => ({
  default: () => <div data-testid="smart-account-info">Smart Account Info</div>,
}));

vi.mock('../SmartAccountModal', () => ({
  default: ({ isOpen, onClose }) => isOpen ? <div data-testid="smart-account-modal">Smart Account Modal</div> : null,
}));

// Mock localStorage
const localStorageMock = {
  getItem: vi.fn(),
  setItem: vi.fn(),
  removeItem: vi.fn(),
  clear: vi.fn(),
};
global.localStorage = localStorageMock;

// Mock fetch
global.fetch = vi.fn();

describe('Navbar Component', () => {
  const mockUsePathname = vi.fn();
  const mockUseRouter = vi.fn();
  const mockUseSelector = vi.fn();
  const mockUseDispatch = vi.fn();
  const mockUseOneChainWallet = vi.fn();

  beforeEach(() => {
    vi.clearAllMocks();
    
    // Setup default mocks
    mockUsePathname.mockReturnValue('/');
    mockUseRouter.mockReturnValue({
      push: vi.fn(),
    });
    
    mockUseSelector.mockImplementation((selector) => {
      if (selector.toString().includes('balance')) {
        return {
          userBalance: '100.00000',
          isLoading: false,
        };
      }
      return {};
    });
    
    mockUseDispatch.mockReturnValue(vi.fn());
    
    mockUseOneChainWallet.mockReturnValue({
      isConnected: true,
      address: '0x1234567890123456789012345678901234567890',
      balance: '100000000000',
      formatOCTAmount: vi.fn(),
      parseOCTAmount: vi.fn(),
      fetchBalance: vi.fn(),
      executeTransaction: vi.fn(),
      suiClient: {
        getCoins: vi.fn(),
      },
    });

    // Import and mock the modules
    const { usePathname, useRouter } = require('next/navigation');
    usePathname.mockImplementation(mockUsePathname);
    useRouter.mockImplementation(mockUseRouter);

    const { useSelector, useDispatch } = require('react-redux');
    useSelector.mockImplementation(mockUseSelector);
    useDispatch.mockImplementation(mockUseDispatch);

    const { useOneChainWallet } = require('../../hooks/useOneChainWallet');
    useOneChainWallet.mockImplementation(mockUseOneChainWallet);

    // Mock window.ethereum
    Object.defineProperty(window, 'ethereum', {
      value: {
        network: vi.fn().mockResolvedValue({ name: 'testnet' }),
        onNetworkChange: vi.fn(),
      },
      writable: true,
    });
  });

  afterEach(() => {
    vi.restoreAllMocks();
  });

  describe('Basic Rendering', () => {
    it('should render the navbar with logo', () => {
      render(<Navbar />);
      
      const logo = screen.getByText('OneArcade');
      expect(logo).toBeInTheDocument();
      
      const walletButton = screen.getByTestId('wallet-button');
      expect(walletButton).toBeInTheDocument();
    });

    it('should render all navigation links', () => {
      render(<Navbar />);
      
      expect(screen.getByText('Home')).toBeInTheDocument();
      expect(screen.getByText('Game')).toBeInTheDocument();
      expect(screen.getByText('Live')).toBeInTheDocument();
      expect(screen.getByText('Bank')).toBeInTheDocument();
    });

    it('should highlight active navigation link', () => {
      mockUsePathname.mockReturnValue('/game');
      render(<Navbar />);
      
      const gameLink = screen.getByText('Game');
      expect(gameLink).toHaveClass('text-transparent', 'bg-clip-text', 'bg-gradient-to-r', 'from-red-magic', 'to-blue-magic');
    });
  });

  describe('Mobile Menu', () => {
    it('should toggle mobile menu on button click', () => {
      render(<Navbar />);
      
      const mobileMenuButton = screen.getByRole('button', { name: 'Toggle mobile menu' });
      fireEvent.click(mobileMenuButton);
      
      // Check if mobile menu items appear
      expect(screen.getByText('Home')).toBeInTheDocument();
      expect(screen.getByText('Game')).toBeInTheDocument();
    });

    it('should close mobile menu on link click', () => {
      render(<Navbar />);
      
      const mobileMenuButton = screen.getByRole('button', { name: 'Toggle mobile menu' });
      fireEvent.click(mobileMenuButton);
      
      const homeLink = screen.getByText('Home');
      fireEvent.click(homeLink);
    });
  });

  describe('Balance Management', () => {
    it('should display user balance when wallet is connected', () => {
      render(<Navbar />);
      
      expect(screen.getByText(/Balance:/i)).toBeInTheDocument();
      expect(screen.getByText('100.00000 OCT')).toBeInTheDocument();
    });

    it('should show balance management modal', async () => {
      render(<Navbar />);
      
      const manageButton = screen.getByText('Manage');
      fireEvent.click(manageButton);
      
      expect(screen.getByText('House Balance')).toBeInTheDocument();
      expect(screen.getByTestId('smart-account-info')).toBeInTheDocument();
    });

    it('should handle deposit functionality', async () => {
      const mockFetch = global.fetch as any;
      mockFetch.mockResolvedValue({
        ok: true,
        json: async () => ({ success: true }),
      });

      mockUseOneChainWallet.mockReturnValue({
        ...mockUseOneChainWallet(),
        suiClient: {
          getCoins: vi.fn().mockResolvedValue({
            data: [{
              coinObjectId: 'coin123',
              balance: '100000000000',
              version: '1',
              digest: '0xabc123',
            }],
          }),
        },
        executeTransaction: vi.fn().mockResolvedValue({ digest: '0x123abc' }),
      });

      render(<Navbar />);
      
      const manageButton = screen.getByText('Manage');
      fireEvent.click(manageButton);
      
      const depositInput = screen.getByPlaceholderText('Enter OCT amount');
      fireEvent.change(depositInput, { target: { value: '10' } });
      
      const depositButton = screen.getByText('Deposit');
      fireEvent.click(depositButton);
      
      await waitFor(() => {
        expect(mockFetch).toHaveBeenCalledWith('/api/deposit', expect.any(Object));
      });
    });

    it('should handle withdrawal functionality', async () => {
      const mockFetch = global.fetch as any;
      mockFetch.mockResolvedValue({
        ok: true,
        json: async () => ({ 
          success: true,
          transactionDigest: '0x456def',
        }),
      });

      render(<Navbar />);
      
      const manageButton = screen.getByText('Manage');
      fireEvent.click(manageButton);
      
      const withdrawButton = screen.getByText('Withdraw All OCT');
      fireEvent.click(withdrawButton);
      
      await waitFor(() => {
        expect(mockFetch).toHaveBeenCalledWith('/api/withdraw', expect.any(Object));
      });
    });

    it('should validate deposit amount limits', async () => {
      render(<Navbar />);
      
      const manageButton = screen.getByText('Manage');
      fireEvent.click(manageButton);
      
      const depositInput = screen.getByPlaceholderText('Enter OCT amount');
      const depositButton = screen.getByText('Deposit');
      
      // Test minimum limit
      fireEvent.change(depositInput, { target: { value: '0.0001' } });
      fireEvent.click(depositButton);
      
      // Test maximum limit
      fireEvent.change(depositInput, { target: { value: '2000' } });
      fireEvent.click(depositButton);
    });
  });

  describe('Search Functionality', () => {
    it('should open search panel on search icon click', () => {
      render(<Navbar />);
      
      const searchButton = screen.getByRole('button', { name: 'Search' });
      fireEvent.click(searchButton);
      
      const searchInput = screen.getByPlaceholderText('Search games, tournaments...');
      expect(searchInput).toBeInTheDocument();
    });

    it('should filter search results based on query', async () => {
      render(<Navbar />);
      
      const searchButton = screen.getByRole('button', { name: 'Search' });
      fireEvent.click(searchButton);
      
      const searchInput = screen.getByPlaceholderText('Search games, tournaments...');
      fireEvent.change(searchInput, { target: { value: 'Roulette' } });
      
      await waitFor(() => {
        expect(screen.getByText('Roulette')).toBeInTheDocument();
      });
    });

    it('should close search panel when clicking outside', () => {
      render(<Navbar />);
      
      const searchButton = screen.getByRole('button', { name: 'Search' });
      fireEvent.click(searchButton);
      
      const searchInput = screen.getByPlaceholderText('Search games, tournaments...');
      expect(searchInput).toBeInTheDocument();
      
      // Simulate click outside
      fireEvent.mouseDown(document.body);
    });
  });

  describe('Notifications', () => {
    it('should display notifications panel', () => {
      render(<Navbar />);
      
      const notificationsButton = screen.getByRole('button', { name: 'Notifications' });
      fireEvent.click(notificationsButton);
      
      expect(screen.getByText('Notifications')).toBeInTheDocument();
      expect(screen.getByText('Mark all as read')).toBeInTheDocument();
    });

    it('should show unread notification count', () => {
      render(<Navbar />);
      
      const notificationsButton = screen.getByRole('button', { name: 'Notifications' });
      expect(notificationsButton).toBeInTheDocument();
    });

    it('should mark notifications as read', () => {
      render(<Navbar />);
      
      const notificationsButton = screen.getByRole('button', { name: 'Notifications' });
      fireEvent.click(notificationsButton);
      
      const markAllButton = screen.getByText('Mark all as read');
      fireEvent.click(markAllButton);
    });
  });

  describe('Dark Mode Toggle', () => {
    it('should toggle dark mode', () => {
      render(<Navbar />);
      
      const darkModeButton = screen.getByRole('button', { name: /Switch to/ });
      fireEvent.click(darkModeButton);
      
      expect(localStorageMock.setItem).toHaveBeenCalledWith('darkMode', 'false');
    });
  });

  describe('Live Chat', () => {
    it('should open live chat modal', () => {
      render(<Navbar />);
      
      const liveChatButton = screen.getByText('Live Chat');
      fireEvent.click(liveChatButton);
      
      expect(screen.getByTestId('live-chat-modal')).toBeInTheDocument();
    });
  });

  describe('Wallet Connection', () => {
    it('should handle wallet disconnection', () => {
      mockUseOneChainWallet.mockReturnValue({
        isConnected: false,
        address: null,
        balance: '0',
        formatOCTAmount: vi.fn(),
        parseOCTAmount: vi.fn(),
        fetchBalance: vi.fn(),
        executeTransaction: vi.fn(),
      });

      render(<Navbar />);
      
      expect(screen.queryByText(/Balance:/i)).not.toBeInTheDocument();
    });

    it('should handle loading states', () => {
      mockUseSelector.mockImplementation((selector) => {
        if (selector.toString().includes('balance')) {
          return {
            userBalance: '100.00000',
            isLoading: true,
          };
        }
        return {};
      });

      render(<Navbar />);
      
      expect(screen.getByText('Loading...')).toBeInTheDocument();
    });
  });

  describe('Error Handling', () => {
    it('should handle fetch errors during deposit', async () => {
      const mockFetch = global.fetch as any;
      mockFetch.mockRejectedValue(new Error('Network error'));

      render(<Navbar />);
      
      const manageButton = screen.getByText('Manage');
      fireEvent.click(manageButton);
      
      const depositInput = screen.getByPlaceholderText('Enter OCT amount');
      fireEvent.change(depositInput, { target: { value: '10' } });
      
      const depositButton = screen.getByText('Deposit');
      fireEvent.click(depositButton);
      
      await waitFor(() => {
        expect(mockFetch).toHaveBeenCalled();
      });
    });

    it('should handle wallet permission errors', async () => {
      mockUseOneChainWallet.mockReturnValue({
        ...mockUseOneChainWallet(),
        executeTransaction: vi.fn().mockRejectedValue(new Error('permission denied')),
      });

      render(<Navbar />);
      
      const manageButton = screen.getByText('Manage');
      fireEvent.click(manageButton);
      
      const depositInput = screen.getByPlaceholderText('Enter OCT amount');
      fireEvent.change(depositInput, { target: { value: '10' } });
      
      const depositButton = screen.getByText('Deposit');
      fireEvent.click(depositButton);
      
      await waitFor(() => {
        const depositButtonAfter = screen.getByText('Deposit');
        expect(depositButtonAfter).not.toBeDisabled();
      });
    });
  });

  describe('Keyboard Navigation', () => {
    it('should close balance modal with ESC key', () => {
      render(<Navbar />);
      
      const manageButton = screen.getByText('Manage');
      fireEvent.click(manageButton);
      
      // Simulate ESC key press
      fireEvent.keyDown(document, { key: 'Escape' });
    });

    it('should focus search input when opening search', async () => {
      render(<Navbar />);
      
      const searchButton = screen.getByRole('button', { name: 'Search' });
      fireEvent.click(searchButton);
      
      const searchInput = screen.getByPlaceholderText('Search games, tournaments...');
      expect(searchInput).toBeInTheDocument();
    });
  });

  describe('Responsive Design', () => {
    it('should render mobile menu button on small screens', () => {
      // Mock window.innerWidth for mobile
      Object.defineProperty(window, 'innerWidth', {
        writable: true,
        configurable: true,
        value: 768,
      });

      render(<Navbar />);
      
      const mobileMenuButton = screen.getByRole('button', { name: 'Toggle mobile menu' });
      expect(mobileMenuButton).toBeInTheDocument();
    });
  });

  describe('Accessibility', () => {
    it('should have proper ARIA labels', () => {
      render(<Navbar />);
      
      const searchButton = screen.getByRole('button', { name: 'Search' });
      expect(searchButton).toHaveAttribute('aria-label', 'Search');
      
      const notificationsButton = screen.getByRole('button', { name: 'Notifications' });
      expect(notificationsButton).toHaveAttribute('aria-label', 'Notifications');
    });

    it('should support keyboard navigation', () => {
      render(<Navbar />);
      
      const homeLink = screen.getByText('Home');
      expect(homeLink).toHaveAttribute('href', '/');
    });
  });
});