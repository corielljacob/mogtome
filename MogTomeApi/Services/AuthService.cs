using System.IdentityModel.Tokens.Jwt;
using System.Security.Claims;
using System.Text;
using Microsoft.IdentityModel.Tokens;
using MogTomeApi.Models;

namespace MogTomeApi.Services;

public class AuthService
{
    private readonly IConfiguration _configuration;
    private readonly string _jwtSecret;

    public AuthService(IConfiguration configuration)
    {
        _configuration = configuration;
        _jwtSecret = _configuration["Jwt:Secret"] 
            ?? Environment.GetEnvironmentVariable("JWT_SECRET") 
            ?? "your-super-secret-key-change-in-production-kupo";
    }

    public string GenerateToken(AdminUser user)
    {
        var tokenHandler = new JwtSecurityTokenHandler();
        var key = Encoding.ASCII.GetBytes(_jwtSecret);
        
        var tokenDescriptor = new SecurityTokenDescriptor
        {
            Subject = new ClaimsIdentity(new[]
            {
                new Claim(ClaimTypes.NameIdentifier, user.Id ?? ""),
                new Claim(ClaimTypes.Name, user.Username),
                new Claim("isAdmin", user.IsAdmin.ToString().ToLower())
            }),
            Expires = DateTime.UtcNow.AddDays(7),
            SigningCredentials = new SigningCredentials(
                new SymmetricSecurityKey(key),
                SecurityAlgorithms.HmacSha256Signature
            )
        };

        var token = tokenHandler.CreateToken(tokenDescriptor);
        return tokenHandler.WriteToken(token);
    }

    public string HashPassword(string password)
    {
        return BCrypt.Net.BCrypt.HashPassword(password);
    }

    public bool VerifyPassword(string password, string hash)
    {
        return BCrypt.Net.BCrypt.Verify(password, hash);
    }
}
