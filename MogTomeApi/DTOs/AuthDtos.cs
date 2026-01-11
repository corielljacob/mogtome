namespace MogTomeApi.DTOs;

public record LoginRequest(string Username, string Password);

public record LoginResponse(string Token, UserDto User);

public record UserDto(string Id, string Username, bool IsAdmin);

public record RegisterRequest(string Username, string Password);
