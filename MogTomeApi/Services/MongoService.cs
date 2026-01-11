using MogTomeApi.Models;
using MongoDB.Driver;

namespace MogTomeApi.Services;

public class MongoService
{
    private readonly MongoClient _client;
    private readonly IMongoDatabase _database;
    private const string ConnectionStringEnvVar = "FC_Tracker_Connection_String";

    public MongoService()
    {
        var connectionString = Environment.GetEnvironmentVariable(ConnectionStringEnvVar, EnvironmentVariableTarget.Machine);

        if (string.IsNullOrWhiteSpace(connectionString))
            connectionString = Environment.GetEnvironmentVariable(ConnectionStringEnvVar);

        if (string.IsNullOrWhiteSpace(connectionString))
            throw new InvalidOperationException($"MongoDB connection string not found. Set the {ConnectionStringEnvVar} environment variable.");

        _client = new MongoClient(connectionString);
        _database = _client.GetDatabase("kupo-life");
    }

    public IMongoCollection<FreeCompanyMember> Members => 
        _database.GetCollection<FreeCompanyMember>("members");

    public IMongoCollection<AdminUser> AdminUsers => 
        _database.GetCollection<AdminUser>("admin_users");

    public async Task<List<FreeCompanyMember>> GetActiveMembersAsync()
    {
        var filter = Builders<FreeCompanyMember>.Filter.Eq(m => m.ActiveMember, true);
        return await Members.Find(filter).ToListAsync();
    }

    public async Task<FreeCompanyMember?> GetMemberByIdAsync(string id)
    {
        var filter = Builders<FreeCompanyMember>.Filter.Eq(m => m.Id, id);
        return await Members.Find(filter).FirstOrDefaultAsync();
    }

    public async Task<FreeCompanyMember?> GetMemberByCharacterIdAsync(string characterId)
    {
        var filter = Builders<FreeCompanyMember>.Filter.Eq(m => m.CharacterId, characterId);
        return await Members.Find(filter).FirstOrDefaultAsync();
    }

    public async Task<AdminUser?> GetAdminUserByUsernameAsync(string username)
    {
        var filter = Builders<AdminUser>.Filter.Eq(u => u.Username, username.ToLowerInvariant());
        return await AdminUsers.Find(filter).FirstOrDefaultAsync();
    }

    public async Task CreateAdminUserAsync(AdminUser user)
    {
        user.Username = user.Username.ToLowerInvariant();
        await AdminUsers.InsertOneAsync(user);
    }
}
