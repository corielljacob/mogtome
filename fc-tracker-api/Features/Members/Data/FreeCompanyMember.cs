using MongoDB.Bson.Serialization.Attributes;

namespace fc_tracker_api.Features.Members.Data
{
    [BsonIgnoreExtraElements]
    public class FreeCompanyMember
    {
        // Standard Fields
        public string Name { get; set; } 
        public string FreeCompanyRank { get; set; }
        public string CharacterId { get; set; }
        

        // Fields with names that are different from document properties in database
        [BsonElement("ActiveMember")]
        public bool ActiveMember { get; set; }

        [BsonElement("LastJoinedDate")]
        public DateTime LastJoinedDate { get; set; }

        // Parsed Fields
        //public DateTime LastJoinedDate { get { return DateTime.Parse(LastJoinedDateString); } }
        //public bool ActiveMember {  get { return bool.Parse(ActiveMemberString); } }
    }
}
