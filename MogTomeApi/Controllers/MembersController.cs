using Microsoft.AspNetCore.Authorization;
using Microsoft.AspNetCore.Mvc;
using MogTomeApi.DTOs;
using MogTomeApi.Services;

namespace MogTomeApi.Controllers;

[ApiController]
[Route("api/[controller]")]
public class MembersController : ControllerBase
{
    private readonly MongoService _mongoService;
    
    // FC Rank order for sorting
    private static readonly List<string> RankOrder = new()
    {
        "Moogle Guardian",
        "Moogle Knight",
        "Paissa Trainer",
        "Coeurl Hunter",
        "Mandragora",
        "Apkallu Seeker",
        "Kupo Shelf",
        "Bom Boko"
    };

    public MembersController(MongoService mongoService)
    {
        _mongoService = mongoService;
    }

    [HttpGet]
    public async Task<ActionResult<PaginatedResponse<MemberDto>>> GetMembers(
        [FromQuery] int page = 1,
        [FromQuery] int pageSize = 20,
        [FromQuery] string? search = null,
        [FromQuery] string[]? ranks = null)
    {
        var allMembers = await _mongoService.GetActiveMembersAsync();
        
        // Apply search filter
        if (!string.IsNullOrWhiteSpace(search))
        {
            allMembers = allMembers
                .Where(m => m.Name.Contains(search, StringComparison.OrdinalIgnoreCase) ||
                           m.FreeCompanyRank.Contains(search, StringComparison.OrdinalIgnoreCase))
                .ToList();
        }

        // Apply rank filter
        if (ranks != null && ranks.Length > 0)
        {
            allMembers = allMembers
                .Where(m => ranks.Contains(m.FreeCompanyRank))
                .ToList();
        }

        // Sort by rank order
        allMembers = allMembers
            .OrderBy(m => RankOrder.IndexOf(m.FreeCompanyRank) is var idx && idx >= 0 ? idx : 999)
            .ThenBy(m => m.Name)
            .ToList();

        // Pagination
        var totalCount = allMembers.Count;
        var totalPages = (int)Math.Ceiling(totalCount / (double)pageSize);
        
        var items = allMembers
            .Skip((page - 1) * pageSize)
            .Take(pageSize)
            .Select(m => new MemberDto(
                m.Id,
                m.Name,
                m.FreeCompanyRank,
                m.FreeCompanyRankIcon,
                m.CharacterId,
                m.ActiveMember,
                m.LastUpdatedDate,
                m.AvatarLink
            ))
            .ToList();

        return Ok(new PaginatedResponse<MemberDto>(
            items,
            totalCount,
            page,
            pageSize,
            totalPages
        ));
    }

    [HttpGet("{id}")]
    public async Task<ActionResult<MemberDto>> GetMember(string id)
    {
        var member = await _mongoService.GetMemberByIdAsync(id);
        
        if (member == null)
            return NotFound(new { message = "Member not found, kupo!" });

        return Ok(new MemberDto(
            member.Id,
            member.Name,
            member.FreeCompanyRank,
            member.FreeCompanyRankIcon,
            member.CharacterId,
            member.ActiveMember,
            member.LastUpdatedDate,
            member.AvatarLink
        ));
    }

    [HttpGet("character/{characterId}")]
    public async Task<ActionResult<MemberDto>> GetMemberByCharacterId(string characterId)
    {
        var member = await _mongoService.GetMemberByCharacterIdAsync(characterId);
        
        if (member == null)
            return NotFound(new { message = "Member not found, kupo!" });

        return Ok(new MemberDto(
            member.Id,
            member.Name,
            member.FreeCompanyRank,
            member.FreeCompanyRankIcon,
            member.CharacterId,
            member.ActiveMember,
            member.LastUpdatedDate,
            member.AvatarLink
        ));
    }

    [HttpPost("refresh")]
    [Authorize]
    public async Task<ActionResult> RefreshMembers()
    {
        // TODO: Implement Lodestone scraping/API call to refresh member data
        // For now, just return the current count
        var members = await _mongoService.GetActiveMembersAsync();
        return Ok(new { message = "Member data refreshed!", count = members.Count });
    }
}
