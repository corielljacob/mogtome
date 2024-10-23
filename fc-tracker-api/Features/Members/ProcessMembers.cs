using MediatR;
using NetStone.Model.Parseables.FreeCompany.Members;
using NetStone;
using MongoDB.Driver;
using fc_tracker_api.Features.Members.Data;
using AutoMapper;
using MongoDB.Bson;

namespace fc_tracker_api.Features.Members
{
    public class ProcessMembers
    {
        public class Command : IRequest<Response> { }

        public class Response
        {
            public bool ProccessingFinishedSuccessfully { get; set; }
        }

        public class Handler : IRequestHandler<Command, Response>
        {
            private readonly ILogger<ProcessMembers> _logger;
            private readonly IMapper _mapper;
            private readonly string _connectionString;
            private readonly MongoClient _mongoClient;

            public Handler(ILogger<ProcessMembers> logger, IMapper mapper)
            {
                _logger = logger;
                _mapper = mapper;
                _connectionString = Environment.GetEnvironmentVariable(Constants.ConnectionStringId, EnvironmentVariableTarget.Machine);
                _mongoClient = new MongoClient(_connectionString);
            }

            public async Task<Response> Handle(Command command, CancellationToken cancellationToken)
            {
                List<FreeCompanyMember> freshFreeCompanyMemberList;
                List<FreeCompanyMember> archivedFreeCompanyMemberList;
                var successfullyProcessedAllMembers = true;

                try
                {
                    var freshFreeCompanyMemberEntries = await GetFreshFreeCompanyMemberList();
                    freshFreeCompanyMemberList = _mapper.Map<List<FreeCompanyMember>>(freshFreeCompanyMemberEntries);
                    archivedFreeCompanyMemberList = await GetArchivedFreeCompanyMembers();
                }
                catch (Exception ex)
                {
                    _logger.LogError(ex, "Unable to retrieve free company member list. Exception message: {message}\n{stackTrace}", ex.Message, ex.StackTrace);
                    return new Response { ProccessingFinishedSuccessfully = false };
                }

                await UpdateMembersWhoHaveLeft(freshFreeCompanyMemberList, archivedFreeCompanyMemberList);
                await UpdateMembersWhoHaveJoined(freshFreeCompanyMemberList.GetRange(0, 5), archivedFreeCompanyMemberList);
                UpdateExistingMembers(freshFreeCompanyMemberList, archivedFreeCompanyMemberList);

                return new Response { ProccessingFinishedSuccessfully = successfullyProcessedAllMembers };
            }

            private static async Task<List<FreeCompanyMembersEntry>> GetFreshFreeCompanyMemberList()
            {
                List<FreeCompanyMembersEntry> members = [];

                var lodestoneClient = await LodestoneClient.GetClientAsync();
                var freeCompanyMembers = await lodestoneClient.GetFreeCompanyMembers(Constants.KupoLifeId);

                while (freeCompanyMembers != null)
                {
                    members.AddRange(freeCompanyMembers.Members);
                    freeCompanyMembers = await freeCompanyMembers.GetNextPage();
                }

                return members;
            }

            private static async Task<List<FreeCompanyMember>> GetArchivedFreeCompanyMembers()
            {
                var connectionString = Environment.GetEnvironmentVariable(Constants.ConnectionStringId, EnvironmentVariableTarget.Machine);
                var client = new MongoClient(connectionString);
                var membersCollection = client.GetDatabase("kupo-life").GetCollection<FreeCompanyMember>("members");
                var filter = Builders<FreeCompanyMember>.Filter.Empty;
                var freeCompanyMembers = await membersCollection.Find(filter).ToListAsync();

                return freeCompanyMembers;
            }

            private async Task UpdateMembersWhoHaveLeft(List<FreeCompanyMember> freshFreeCompanyMemberList, List<FreeCompanyMember> archivedFreeCompanyMemberList)
            {
                var membersWhoHaveLeft = GetMembersWhoHaveLeft(freshFreeCompanyMemberList, archivedFreeCompanyMemberList);
                var idsOfMembersWhoHaveLeft = membersWhoHaveLeft.Select(member => member.CharacterId).ToList();

                var membersCollection = _mongoClient.GetDatabase("kupo-life").GetCollection<FreeCompanyMember>("members");
                var filter = Builders<FreeCompanyMember>.Filter.In("CharacterId", idsOfMembersWhoHaveLeft);

                // todo: get rid of pipeline and use UpdateOneModel and BulkUpdate instead
                var update = Builders<FreeCompanyMember>.Update.Pipeline(
                    new BsonDocument[]
                    {
                        new ("$set", new BsonDocument
                        {
                            { "MembershipHistory", new BsonDocument("$concat", new BsonArray { "$MembershipHistory", $"{DateTime.Now.Date}" }) },
                            { "ActiveMember", false },
                            { "LastLeaveDate", DateTime.Now },
                            { "LastUpdateDate", DateTime.Now }
                        })
                    }
                );

                await membersCollection.UpdateManyAsync(filter, update);
            }

            private async Task UpdateMembersWhoHaveJoined(List<FreeCompanyMember> freshFreeCompanyMemberList, List<FreeCompanyMember> archivedFreeCompanyMemberList)
            {
                var newMembersWhoHaveJoined = GetNewMembersWhoHaveJoined(freshFreeCompanyMemberList, archivedFreeCompanyMemberList);
                var returningMembersWhoHaveJoined = GetReturningMembersWhoHaveJoined(freshFreeCompanyMemberList, archivedFreeCompanyMemberList);

                if (newMembersWhoHaveJoined.Count == 0 && returningMembersWhoHaveJoined.Count == 0)
                    return; 

                var membersCollection = _mongoClient.GetDatabase("kupo-life").GetCollection<FreeCompanyMember>("members");

                // Insert brand new members
                if (newMembersWhoHaveJoined.Count > 0)
                    await membersCollection.InsertManyAsync(newMembersWhoHaveJoined);

                // Update documents for rejoining members
                if(returningMembersWhoHaveJoined.Count > 0)
                {
                    var idsOfMembersWhoHaveRejoined = returningMembersWhoHaveJoined.Select(member => member.CharacterId).ToList();
                    var filter = Builders<FreeCompanyMember>.Filter.In("CharacterId", idsOfMembersWhoHaveRejoined);

                    // todo: get rid of pipeline and use UpdateOneModel and BulkUpdate instead
                    var update = Builders<FreeCompanyMember>.Update.Pipeline(
                        new BsonDocument[]
                        {
                            new ("$set", new BsonDocument
                            {
                                { "MembershipHistory", new BsonDocument("$concat", new BsonArray { "$MembershipHistory", $"+{DateTime.Now.Date}-" }) },
                                { "ActiveMember", true },
                                { "LastJoinDate", DateTime.Now },
                                { "LastUpdateDate", DateTime.Now }
                            })
                        }
                    );

                    await membersCollection.UpdateManyAsync(filter, update);
                }
            }

            private void UpdateExistingMembers(List<FreeCompanyMember> freshFreeCompanyMemberList, List<FreeCompanyMember> archivedFreeCompanyMemberList)
            {
                var existingMembers = GetExistingMembers(freshFreeCompanyMemberList, archivedFreeCompanyMemberList);
                var membersCollection = _mongoClient.GetDatabase("kupo-life").GetCollection<FreeCompanyMember>("members");

                var updates = new List<WriteModel<FreeCompanyMember>>();
                foreach (var member in existingMembers)
                {
                    var currentName = freshFreeCompanyMemberList.First(freshMember => freshMember.CharacterId == member.CharacterId).Name;
                    if(currentName != member.Name)
                    {
                        var filter = Builders<FreeCompanyMember>.Filter.Eq("CharacterId", member.CharacterId);
                        var update = Builders<FreeCompanyMember>.Update
                            .Set(member => member.Name, currentName)
                            .Set(member => member.LastUpdatedDate, DateTime.Now);
                        var updateModel = new UpdateOneModel<FreeCompanyMember>(filter, update);
                        updates.Add(updateModel);
                    }

                    var currentRank = freshFreeCompanyMemberList.First(freshMember => freshMember.CharacterId == member.CharacterId).FreeCompanyRank;
                    if (currentName != member.Name)
                    {
                        var filter = Builders<FreeCompanyMember>.Filter.Eq("CharacterId", member.CharacterId);
                        var update = Builders<FreeCompanyMember>.Update.Set(member => member.FreeCompanyRank, currentRank);
                        var updateModel = new UpdateOneModel<FreeCompanyMember>(filter, update);
                        updates.Add(updateModel);
                    }
                }
                
                if(updates.Count > 0)
                {
                    var updateResult = membersCollection.BulkWrite(updates);
                }
            }

            private static List<FreeCompanyMember> GetMembersWhoHaveLeft(List<FreeCompanyMember> freshFreeCompanyMemberList, List<FreeCompanyMember> archivedFreeCompanyMemberList)
            {
                var membersWhoHaveLeft = archivedFreeCompanyMemberList
                    .Where(member => member.ActiveMember)
                    .Where(member => freshFreeCompanyMemberList.Any(freshMember => freshMember.CharacterId.Equals(member.CharacterId)) == false)
                    .ToList();

                return membersWhoHaveLeft;
            }

            private static List<FreeCompanyMember> GetNewMembersWhoHaveJoined(List<FreeCompanyMember> freshFreeCompanyMemberList, List<FreeCompanyMember> archivedFreeCompanyMemberList)
            {
                var membersWhoHaveJoined = freshFreeCompanyMemberList
                    .Where(member => archivedFreeCompanyMemberList.Any(historicalMember => historicalMember.CharacterId.Equals(member.CharacterId)) == false)
                    .ToList();

                return membersWhoHaveJoined;
            }

            private static List<FreeCompanyMember> GetReturningMembersWhoHaveJoined(List<FreeCompanyMember> freshFreeCompanyMemberList, List<FreeCompanyMember> archivedFreeCompanyMemberList)
            {
                var membersWhoHaveRejoined = freshFreeCompanyMemberList
                    .Where(member => archivedFreeCompanyMemberList.Any(historicalMember => historicalMember.CharacterId.Equals(member.CharacterId) && historicalMember.ActiveMember == false))
                    .ToList();

                return membersWhoHaveRejoined;
            }

            private static List<FreeCompanyMember> GetExistingMembers(List<FreeCompanyMember> freshFreeCompanyMemberList, List<FreeCompanyMember> archivedFreeCompanyMemberList)
            {
                var existingMembers = archivedFreeCompanyMemberList
                    .Where(member => member.ActiveMember)
                    .Where(member => freshFreeCompanyMemberList.Any(freshMember => freshMember.CharacterId.Equals(member.CharacterId)))
                    .ToList();

                return existingMembers;
            }
        }
    }
}
