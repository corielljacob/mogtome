namespace MogTomeApi.DTOs;

public record MemberDto(
    string? Id,
    string Name,
    string FreeCompanyRank,
    string FreeCompanyRankIcon,
    string CharacterId,
    bool ActiveMember,
    DateTime LastUpdatedDate,
    string AvatarLink
);

public record PaginatedResponse<T>(
    List<T> Items,
    int TotalCount,
    int Page,
    int PageSize,
    int TotalPages
);

public record MemberQueryParams(
    int Page = 1,
    int PageSize = 20,
    string? Search = null,
    string[]? Ranks = null
);
