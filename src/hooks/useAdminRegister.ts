// src/hooks/useAdminRegister

export function useAdminRegister() {
  const [loading, setLoading] = useState(false);
  const router = useRouter();

  const register = async (email: string, password: string) => {
    setLoading(true);
    try {
      await apiRequest('/admin/auth/register', {
        method: 'POST',
        body: JSON.stringify({ email, password }),
      });
      toast.success("Compte créé. Veuillez vous connecter.");
      router.push("/admin/login");
    } catch (err: any) {
      toast.error(err.message || "Échec de l'inscription");
    } finally {
      setLoading(false);
    }
  };

  return { register, loading };
}