import { useMutation } from '@tanstack/react-query';
import { useNavigate } from 'react-router-dom';
import { authApi } from '../api/auth';
import { useAuthStore } from '../stores/authStore';
import type { LoginCredentials } from '../types';

export function useLogin() {
  const navigate = useNavigate();
  const { setAuth, setLoading } = useAuthStore();

  return useMutation({
    mutationFn: (credentials: LoginCredentials) => authApi.login(credentials),
    onMutate: () => {
      setLoading(true);
    },
    onSuccess: (data) => {
      setAuth(data.token, data.user);
      navigate('/admin');
    },
    onSettled: () => {
      setLoading(false);
    },
  });
}

export function useLogout() {
  const navigate = useNavigate();
  const { logout } = useAuthStore();

  return useMutation({
    mutationFn: () => authApi.logout(),
    onSuccess: () => {
      logout();
      navigate('/');
    },
    onError: () => {
      // Even if the API call fails, log out locally
      logout();
      navigate('/');
    },
  });
}
