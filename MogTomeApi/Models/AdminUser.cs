using MongoDB.Bson;
using MongoDB.Bson.Serialization.Attributes;

namespace MogTomeApi.Models;

[BsonIgnoreExtraElements]
public class AdminUser
{
    [BsonId]
    [BsonRepresentation(BsonType.ObjectId)]
    public string? Id { get; set; }
    
    public string Username { get; set; } = string.Empty;
    public string PasswordHash { get; set; } = string.Empty;
    public bool IsAdmin { get; set; } = true;
    public DateTime CreatedAt { get; set; } = DateTime.UtcNow;
}
