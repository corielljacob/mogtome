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
            private string _connectionString;
            private MongoClient _mongoClient;

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
                UpdateMembersWhoHaveJoined(freshFreeCompanyMemberList, archivedFreeCompanyMemberList);
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

                var update = Builders<FreeCompanyMember>.Update.Pipeline(
                    new BsonDocument[]
                    {
                        new BsonDocument("$set", new BsonDocument
                        {
                            { "MembershipHistory", new BsonDocument("$concat", new BsonArray { "$MembershipHistory", $"{DateTime.Now.Date}" }) },
                            { "ActiveMember", false },
                            { "LastLeaveDate", DateTime.Now },
                            { "LastUpdateDate", DateTime.Now }
                        })
                    }
                );

                var result = membersCollection.UpdateMany(filter, update);
            }

            private void UpdateMembersWhoHaveJoined(List<FreeCompanyMember> freshFreeCompanyMemberList, List<FreeCompanyMember> archivedFreeCompanyMemberList)
            {
                var membersWhoHaveJoined = GetMembersWhoHaveJoined(freshFreeCompanyMemberList, archivedFreeCompanyMemberList);
            }

            private void UpdateExistingMembers(List<FreeCompanyMember> freshFreeCompanyMemberList, List<FreeCompanyMember> archivedFreeCompanyMemberList)
            {
                var existingMembers = GetExistingMembers(freshFreeCompanyMemberList, archivedFreeCompanyMemberList);
            }

            private static List<FreeCompanyMember> GetMembersWhoHaveLeft(List<FreeCompanyMember> freshFreeCompanyMemberList, List<FreeCompanyMember> archivedFreeCompanyMemberList)
            {
                var membersWhoHaveLeft = archivedFreeCompanyMemberList
                    .Where(member => member.ActiveMember)
                    .Except(freshFreeCompanyMemberList)
                    .ToList();

                return membersWhoHaveLeft;
            }

            private static List<FreeCompanyMember> GetMembersWhoHaveJoined(List<FreeCompanyMember> freshFreeCompanyMemberList, List<FreeCompanyMember> archivedFreeCompanyMemberList)
            {
                var membersWhoHaveJoined = freshFreeCompanyMemberList.Except(archivedFreeCompanyMemberList).ToList();
                return membersWhoHaveJoined;
            }

            private static List<FreeCompanyMember> GetExistingMembers(List<FreeCompanyMember> freshFreeCompanyMemberList, List<FreeCompanyMember> archivedFreeCompanyMemberList)
            {
                var existingMembers = archivedFreeCompanyMemberList
                    .Where(member => member.ActiveMember)
                    .Intersect(freshFreeCompanyMemberList)
                    .ToList();

                return existingMembers;
            }
        }
    }
}
