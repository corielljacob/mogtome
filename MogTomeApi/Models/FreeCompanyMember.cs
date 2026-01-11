using MongoDB.Bson;
using MongoDB.Bson.Serialization.Attributes;

namespace MogTomeApi.Models;

[BsonIgnoreExtraElements]
public class FreeCompanyMember
{
    [BsonId]
    [BsonRepresentation(BsonType.ObjectId)]
    public string? Id { get; set; }
    
    public string Name { get; set; } = string.Empty;
    public string FreeCompanyRank { get; set; } = string.Empty;
    public string FreeCompanyRankIcon { get; set; } = string.Empty;
    public string CharacterId { get; set; } = string.Empty;
    public bool ActiveMember { get; set; }
    public DateTime LastUpdatedDate { get; set; }
    public string? MembershipHistory { get; set; }
    public string AvatarLink { get; set; } = string.Empty;
}
