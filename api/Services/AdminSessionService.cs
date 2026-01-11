namespace MogTomeWeb.Services
{
    public class AdminSessionService : IAdminSessionService
    {
        private readonly IHttpContextAccessor _httpContextAccessor;
        private const string AdminKey = "IsAdmin";

        public event Action? OnAdminStateChanged;

        public bool IsAdmin => _httpContextAccessor.HttpContext?.Session.GetString(AdminKey) == "true";

        public AdminSessionService(IHttpContextAccessor accessor)
        {
            _httpContextAccessor = accessor;
        }

        public bool Authenticate(string passcode)
        {
            var adminPasscode = Environment.GetEnvironmentVariable("AdminPasscode", EnvironmentVariableTarget.Process);

            if (passcode == adminPasscode)
            {
                _httpContextAccessor.HttpContext?.Session.SetString(AdminKey, "true");
                OnAdminStateChanged?.Invoke();
                return true;
            }
            else
            {
                _httpContextAccessor.HttpContext?.Session.SetString(AdminKey, "false");
                OnAdminStateChanged?.Invoke();
                return false;
            }
        }

        public void Revoke()
        {
            _httpContextAccessor.HttpContext?.Session.Remove(AdminKey);
        }
    }
}
