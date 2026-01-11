using System.Security.Claims;
using Microsoft.AspNetCore.Authorization;
using Microsoft.AspNetCore.Mvc;
using MogTomeApi.DTOs;
using MogTomeApi.Models;
using MogTomeApi.Services;

namespace MogTomeApi.Controllers;

[ApiController]
[Route("api/[controller]")]
public class AuthController : ControllerBase
{
    private readonly MongoService _mongoService;
    private readonly AuthService _authService;

    public AuthController(MongoService mongoService, AuthService authService)
    {
        _mongoService = mongoService;
        _authService = authService;
    }

    [HttpPost("login")]
    public async Task<ActionResult<LoginResponse>> Login([FromBody] LoginRequest request)
    {
        if (string.IsNullOrWhiteSpace(request.Username) || string.IsNullOrWhiteSpace(request.Password))
        {
            return BadRequest(new { message = "Username and password are required, kupo!" });
        }

        var user = await _mongoService.GetAdminUserByUsernameAsync(request.Username);
        
        if (user == null || !_authService.VerifyPassword(request.Password, user.PasswordHash))
        {
            return Unauthorized(new { message = "Invalid credentials, kupo!" });
        }

        var token = _authService.GenerateToken(user);
        
        return Ok(new LoginResponse(
            token,
            new UserDto(user.Id ?? "", user.Username, user.IsAdmin)
        ));
    }

    [HttpPost("logout")]
    [Authorize]
    public IActionResult Logout()
    {
        // JWT tokens are stateless, so we just return success
        // Client should remove the token from storage
        return Ok(new { message = "Logged out successfully, kupo!" });
    }

    [HttpGet("me")]
    [Authorize]
    public IActionResult GetCurrentUser()
    {
        var userId = User.FindFirst(ClaimTypes.NameIdentifier)?.Value;
        var username = User.FindFirst(ClaimTypes.Name)?.Value;
        var isAdmin = User.FindFirst("isAdmin")?.Value == "true";

        if (string.IsNullOrEmpty(userId))
        {
            return Unauthorized(new { message = "Not authenticated, kupo!" });
        }

        return Ok(new UserDto(userId, username ?? "", isAdmin));
    }

    [HttpGet("validate")]
    [Authorize]
    public IActionResult ValidateToken()
    {
        return Ok(new { valid = true });
    }

    // Helper endpoint to create the first admin user
    // In production, remove this or protect it better
    [HttpPost("setup")]
    public async Task<ActionResult> SetupAdminUser([FromBody] RegisterRequest request)
    {
        if (string.IsNullOrWhiteSpace(request.Username) || string.IsNullOrWhiteSpace(request.Password))
        {
            return BadRequest(new { message = "Username and password are required, kupo!" });
        }

        // Check if any admin exists
        var existingUser = await _mongoService.GetAdminUserByUsernameAsync(request.Username);
        if (existingUser != null)
        {
            return Conflict(new { message = "User already exists, kupo!" });
        }

        var hashedPassword = _authService.HashPassword(request.Password);
        var adminUser = new AdminUser
        {
            Username = request.Username,
            PasswordHash = hashedPassword,
            IsAdmin = true,
            CreatedAt = DateTime.UtcNow
        };

        await _mongoService.CreateAdminUserAsync(adminUser);

        return Ok(new { message = "Admin user created successfully, kupo!" });
    }
}
