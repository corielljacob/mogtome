using MediatR;
using NetStone.Model.Parseables.FreeCompany.Members;
using NetStone;
using MongoDB.Driver;
using fc_tracker_api.Features.Members.Data;
using AutoMapper;

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

            public Handler(ILogger<ProcessMembers> logger, IMapper mapper)
            {
                _logger = logger;
                _mapper = mapper;
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

                // TODO: Implement each of these methods
                var membersWhoHaveLeft = GetMembersWhoHaveLeft(freshFreeCompanyMemberList, archivedFreeCompanyMemberList);
                var membersWhoHaveJoined = GetMembersWhoHaveJoined(freshFreeCompanyMemberList, archivedFreeCompanyMemberList);
                var existingMembers = GetExistingMembers(freshFreeCompanyMemberList, archivedFreeCompanyMemberList);

                // TODO: Remove members who have left or mark them as inactive with a flag

                // TODO: Add new members who have joined

                // TODO: Check each existing member for any data updates that need to be made

                return new Response { ProccessingFinishedSuccessfully = successfullyProcessedAllMembers };
            }

            private async Task<List<FreeCompanyMembersEntry>> GetFreshFreeCompanyMemberList()
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

            private async Task<List<FreeCompanyMember>> GetArchivedFreeCompanyMembers()
            {
                var connectionString = Environment.GetEnvironmentVariable(Constants.ConnectionStringId, EnvironmentVariableTarget.Machine);
                var client = new MongoClient(connectionString);
                var membersCollection = client.GetDatabase("kupo-life").GetCollection<FreeCompanyMember>("members");
                var filter = Builders<FreeCompanyMember>.Filter.Empty;
                var freeCompanyMembers = await membersCollection.Find(filter).ToListAsync();

                return freeCompanyMembers;
            }

            // TODO: Implement Feature
            private List<FreeCompanyMember> GetMembersWhoHaveLeft(List<FreeCompanyMember> FreshFreeCompanyMemberList, List<FreeCompanyMember> ArchivedFreeCompanyMemberList)
            {
                // Find members who have left the FC since last check
                // Find the members who are in the archivedFreeCompanyMemberList list but not in the freshFreeCompanyMemberList list
                // basically, archivedFreeCompanyMemberList - freshFreeCompanyMemberList (set subtraction)
                // .NET has a method for lists called Except that you can use. myList.Except(myOtherList) will return list items in myList that are not in myOtherList

                return null;
            }

            // TODO: Implement Feature
            private List<FreeCompanyMember> GetMembersWhoHaveJoined(List<FreeCompanyMember> FreshFreeCompanyMemberList, List<FreeCompanyMember> ArchivedFreeCompanyMemberList)
            {
                // Find members who have joined the FC since last check
                // Find the members who are in the FreshFreeCompanyMemberList list but not in the ArchivedFreeCompanyMemberList list
                // basically, FreshFreeCompanyMemberList - ArchivedFreeCompanyMemberList (set subtraction)
                // .NET has a method for lists called Except that you can use. myList.Except(myOtherList) will return list items in myList that are not in myOtherList

                return null;
            }

            // TODO: Implement Feature
            private List<FreeCompanyMember> GetExistingMembers(List<FreeCompanyMember> FreshFreeCompanyMemberList, List<FreeCompanyMember> ArchivedFreeCompanyMemberList)
            {
                // Find members who were in the FC the last time we checked
                // Find the members who are in both the FreshFreeCompanyMemberList list and the ArchivedFreeCompanyMemberList list
                // This is called set intersection
                // .NET has a method for lists called Intersect that you can use. myList.Intersect(myOtherList) will return list items in both myList and myOtherList

                return null;
            }
        }
    }
}
