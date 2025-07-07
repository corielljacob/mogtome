namespace MogTomeWeb.Services
{
    public interface IAdminSessionService
    {
        bool IsAdmin { get; }
        bool Authenticate(string passcode);
        void Revoke();
        event Action? OnAdminStateChanged;
    }
}
