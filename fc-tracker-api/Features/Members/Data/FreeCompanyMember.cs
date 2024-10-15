using MongoDB.Bson.Serialization.Attributes;

namespace fc_tracker_api.Features.Members.Data
{
    [BsonIgnoreExtraElements]
    public class FreeCompanyMember
    {
        public string Name { get; set; } 
    }
}
